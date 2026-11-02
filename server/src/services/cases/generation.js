import { Case } from '../../models/Case.js';
import { Solution } from '../../models/Solution.js';
import { env } from '../../config/env.js';
import { generateMystery } from '../ai/gemini.js';
import { mediaProvider } from '../evidence/mediaProvider.js';

export async function generateCase(caseId) {
  const record = await Case.findById(caseId);
  if (!record) return;
  try {
    const mystery = await generateMystery({ prompt: record.prompt, genre: record.genre, difficulty: record.difficulty, title: record.title === 'Untitled investigation' ? null : record.title });
    record.title = mystery.title; record.premise = mystery.premise; record.incident = mystery.incident;
    record.suspects = mystery.suspects.map((s, i) => ({ ...s, displayOrder: i }));
    record.timeline = mystery.timeline.filter(e => e.visibility === 'public').sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
    record.evidence = mystery.evidence.map((e, i) => ({ ...e, displayOrder: i }));
    for (const item of record.evidence) {
      if (item.type === 'cctv' && item.content && typeof item.content === 'object') {
        item.content = { ...item.content, representationType: 'frame-sequence', provider: mediaProvider.name };
      }
    }
    await Solution.create({ caseId: record._id, ...mystery.solution });
    record.status = 'ready'; record.generationError = undefined;
    await record.save();
  } catch (error) {
    record.status = 'failed';
    const diagnostic = String(error?.message || error || 'unknown generation failure').replace(/AIza[\w-]{20,}/g, '[redacted]').slice(0, 300);
    console.error(`Case generation failed (${String(caseId)}): ${diagnostic}`);
    if (error.message === 'AI_GENERATION_NOT_CONFIGURED') record.generationError = 'Case generation is not configured. Add a Gemini API key and retry.';
    else if (error.message === 'AI_TIMEOUT') record.generationError = 'Gemini took too long to respond. Please retry this case.';
    else if (error.status === 401 || error.status === 403 || /api_key_invalid|api key not valid/i.test(diagnostic)) record.generationError = 'Gemini rejected the configured API key. Check the key and retry.';
    else if (error.status === 404 || /not found/i.test(diagnostic)) record.generationError = 'The configured Gemini model was not found. Check GEMINI_MODEL in .env and retry.';
    else if (error.status === 429 || /quota|rate.?limit|resource_exhausted/i.test(diagnostic)) record.generationError = 'Gemini project quota is exhausted. Check your Google AI Studio usage and rate limits, then retry when quota is available.';
    else record.generationError = 'The generated case did not pass consistency checks after retries. Please try again or simplify the scenario.';
    await record.save();
  }
}

export function expiryDate() { return new Date(Date.now() + env.CASE_RETENTION_DAYS * 86400000); }
