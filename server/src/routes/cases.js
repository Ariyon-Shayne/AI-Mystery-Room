import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { Case } from '../models/Case.js';
import { Solution } from '../models/Solution.js';
import { Accusation } from '../models/Accusation.js';
import { createCaseSchema, accusationSchema, hasDisallowedRealWorldRequest } from '../validators/case.js';
import { publicCase, publicEvidence } from '../services/serialization.js';
import { generateCase, expiryDate } from '../services/cases/generation.js';

export const casesRouter = Router();
function fail(status, code, message) { const e = new Error(message); e.status = status; e.code = code; return e; }
async function owned(id, sessionHash) {
  const record = await Case.findOne({ _id: id, ownerSessionHash: sessionHash });
  if (!record) throw fail(404, 'CASE_NOT_FOUND', 'Case not found. It may have expired or belong to another browser session.');
  return record;
}

casesRouter.post('/', async (req, res) => {
  const parsed = createCaseSchema.safeParse(req.body);
  if (!parsed.success) throw fail(400, 'VALIDATION_ERROR', 'Enter a scenario between 30 and 1,500 characters and choose valid settings.');
  if (hasDisallowedRealWorldRequest(parsed.data.prompt)) throw fail(400, 'FICTION_ONLY', 'Please keep scenarios fictional and avoid requests involving real people, private messages, or real-world evidence.');
  const idempotencyKey = req.get('idempotency-key')?.slice(0, 100);
  if (idempotencyKey) {
    const existing = await Case.findOne({ ownerSessionHash: req.sessionHash, idempotencyKey });
    if (existing) return res.status(202).json({ success: true, data: { caseId: String(existing._id), status: existing.status } });
  }
  const input = parsed.data;
  const record = await Case.create({ title: input.title || 'Untitled investigation', prompt: input.prompt, genre: input.genre, difficulty: input.difficulty, status: 'generating', ownerSessionHash: req.sessionHash, expiresAt: expiryDate(), idempotencyKey: idempotencyKey || randomUUID() });
  setImmediate(() => generateCase(record._id).catch(err => req.log?.error({ err }, 'Case generation failed')));
  res.status(202).json({ success: true, data: { caseId: String(record._id), status: 'generating' } });
});

casesRouter.get('/', async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const [records, total] = await Promise.all([
    Case.find({ ownerSessionHash: req.sessionHash }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Case.countDocuments({ ownerSessionHash: req.sessionHash })
  ]);
  res.json({ success: true, data: { cases: records.map(publicCase), pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
});

casesRouter.get('/:caseId/status', async (req, res) => {
  const record = await owned(req.params.caseId, req.sessionHash);
  res.json({ success: true, data: { caseId: String(record._id), status: record.status, message: record.status === 'failed' ? record.generationError : undefined } });
});
casesRouter.get('/:caseId', async (req, res) => {
  const record = await owned(req.params.caseId, req.sessionHash);
  res.json({ success: true, data: publicCase(record) });
});
casesRouter.get('/:caseId/evidence/:evidenceId', async (req, res) => {
  const record = await owned(req.params.caseId, req.sessionHash);
  if (record.status !== 'ready') throw fail(409, 'CASE_NOT_READY', 'Evidence is available when case generation is complete.');
  const item = publicEvidence(record, req.params.evidenceId);
  if (!item) throw fail(404, 'EVIDENCE_NOT_FOUND', 'Evidence not found.');
  res.json({ success: true, data: item });
});

casesRouter.post('/:caseId/accusations', async (req, res) => {
  const parsed = accusationSchema.safeParse(req.body);
  if (!parsed.success) throw fail(400, 'VALIDATION_ERROR', 'Select a valid suspect before submitting.');
  const record = await owned(req.params.caseId, req.sessionHash);
  if (record.status !== 'ready') throw fail(409, 'CASE_NOT_READY', 'This case is not ready for an accusation.');
  if (!record.suspects.some(s => s.id === parsed.data.suspectId)) throw fail(400, 'INVALID_SUSPECT', 'That suspect is not part of this case.');
  const solution = await Solution.findOne({ caseId: record._id });
  if (!solution) throw fail(503, 'SOLUTION_UNAVAILABLE', 'The case solution is temporarily unavailable.');
  const isCorrect = parsed.data.suspectId === solution.culpritId;
  const resultExplanation = isCorrect ? solution.explanation : `The evidence points to ${record.suspects.find(s => s.id === solution.culpritId)?.name}. ${solution.explanation}`;
  const accusation = await Accusation.create({ caseId: record._id, ownerSessionHash: req.sessionHash, selectedSuspectId: parsed.data.suspectId, isCorrect, resultExplanation });
  res.status(201).json({ success: true, data: { selectedSuspectId: accusation.selectedSuspectId, isCorrect, result: isCorrect ? 'correct' : 'incorrect', solution: { culpritId: solution.culpritId, motive: solution.motive, method: solution.method, explanation: resultExplanation, decisiveEvidenceIds: solution.decisiveEvidenceIds } } });
});

casesRouter.get('/:caseId/result', async (req, res) => {
  const record = await owned(req.params.caseId, req.sessionHash);
  const accusation = await Accusation.findOne({ caseId: record._id, ownerSessionHash: req.sessionHash });
  if (!accusation) throw fail(409, 'ACCUSATION_REQUIRED', 'Submit your final accusation to reveal the solution.');
  const solution = await Solution.findOne({ caseId: record._id });
  res.json({ success: true, data: { selectedSuspectId: accusation.selectedSuspectId, isCorrect: accusation.isCorrect, result: accusation.isCorrect ? 'correct' : 'incorrect', solution: { culpritId: solution.culpritId, motive: solution.motive, method: solution.method, explanation: accusation.resultExplanation, decisiveEvidenceIds: solution.decisiveEvidenceIds } } });
});

casesRouter.post('/:caseId/retry', async (req, res) => {
  const record = await owned(req.params.caseId, req.sessionHash);
  if (record.status !== 'failed') throw fail(409, 'CASE_NOT_FAILED', 'Only failed cases can be retried.');
  if (record.retryCount >= 2) throw fail(429, 'RETRY_LIMIT', 'This case has reached its retry limit. Create a new investigation instead.');
  record.status = 'generating'; record.retryCount += 1; record.generationError = undefined; await record.save();
  await Solution.deleteOne({ caseId: record._id });
  setImmediate(() => generateCase(record._id).catch(err => req.log?.error({ err }, 'Case retry failed')));
  res.status(202).json({ success: true, data: { caseId: String(record._id), status: 'generating' } });
});
