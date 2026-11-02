import { z } from 'zod';

export const createCaseSchema = z.object({
  prompt: z.string().trim().min(30).max(1500),
  genre: z.enum(['murder-mystery', 'theft', 'disappearance', 'corporate-espionage', 'digital-mystery', 'suspicious-incident', 'other']).default('murder-mystery'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  title: z.string().trim().max(80).nullable().optional()
}).strict();
export const accusationSchema = z.object({ suspectId: z.string().min(1).max(80) }).strict();

export function hasDisallowedRealWorldRequest(prompt) {
  const patterns = [
    /\b(?:access|read|retrieve|use|include|recreate|fabricate|leak|expose)\b[\s\S]{0,90}\b(?:someone'?s|real|actual|private)\b[\s\S]{0,60}\b(?:whatsapp|messages?|personal data|private records?|crime evidence|identity)\b/i,
    /\b(?:real|actual)\s+(?:whatsapp|private messages?|personal data|crime evidence|police records?)\b/i
  ];
  return patterns.some(pattern => pattern.test(prompt));
}

const suspect = z.object({ id: z.string(), name: z.string(), role: z.string(), biography: z.string(), motiveSummary: z.string(), publicAlibi: z.string(), statement: z.string() });
const event = z.object({ id: z.string(), timestamp: z.string(), title: z.string(), description: z.string(), relatedSuspectIds: z.array(z.string()).default([]), relatedEvidenceIds: z.array(z.string()).default([]), visibility: z.enum(['public', 'hidden']).default('public') });
const message = z.object({ senderId: z.string().default('unknown'), senderName: z.string().default('Unknown'), timestamp: z.string(), text: z.string(), attachment: z.string().optional() });
const evidence = z.object({ id: z.string(), title: z.string(), type: z.enum(['chat', 'image', 'document', 'cctv', 'statement', 'physical']), description: z.string(), content: z.union([z.string(), z.object({ participants: z.array(z.string()).optional(), messages: z.array(message).optional(), frames: z.array(z.object({ timestamp: z.string(), description: z.string() })).optional(), representationType: z.enum(['frame-sequence', 'illustration', 'video']).optional(), cameraLocation: z.string().optional(), durationSeconds: z.number().optional() })]), source: z.string().default('Investigation record'), timestamp: z.string(), relatedSuspectIds: z.array(z.string()).default([]), clueCategory: z.string().optional() });
export const generatedCaseSchema = z.object({
  title: z.string(), premise: z.string(), incident: z.object({ type: z.string(), location: z.string(), occurredAt: z.string(), description: z.string() }),
  suspects: z.array(suspect).min(3).max(5), timeline: z.array(event).min(4), evidence: z.array(evidence).min(6),
  solution: z.object({ culpritId: z.string(), motive: z.string(), method: z.string(), explanation: z.string(), decisiveEvidenceIds: z.array(z.string()).min(2), misleadingEvidenceIds: z.array(z.string()).default([]), canonicalTimeline: z.array(event), suspectTruths: z.array(z.object({ suspectId: z.string(), truth: z.string() })) })
});

export function assertConsistentCase(value) {
  const parsed = generatedCaseSchema.parse(value);
  const ids = parsed.suspects.map(s => s.id);
  const evidenceIds = parsed.evidence.map(e => e.id);
  if (new Set(ids).size !== ids.length || new Set(evidenceIds).size !== evidenceIds.length) throw new Error('Duplicate suspect or evidence identifiers');
  if (!ids.includes(parsed.solution.culpritId)) throw new Error('Culprit must belong to the suspect list');
  if (parsed.solution.decisiveEvidenceIds.some(id => !evidenceIds.includes(id))) throw new Error('Solution references missing decisive evidence');
  if (parsed.evidence.some(e => e.relatedSuspectIds.some(id => !ids.includes(id)))) throw new Error('Evidence references an unknown suspect');
  if (parsed.timeline.some(e => e.relatedSuspectIds.some(id => !ids.includes(id)))) throw new Error('Timeline references an unknown suspect');
  if (parsed.timeline.some(e => e.relatedEvidenceIds.some(id => !evidenceIds.includes(id)))) throw new Error('Timeline references unknown evidence');
  if (parsed.solution.suspectTruths.some(item => !ids.includes(item.suspectId))) throw new Error('Solution references an unknown suspect');
  if (new Set(parsed.solution.suspectTruths.map(item => item.suspectId)).size !== parsed.solution.suspectTruths.length) throw new Error('Solution contains duplicate suspect truths');
  if (parsed.solution.misleadingEvidenceIds.some(id => !evidenceIds.includes(id))) throw new Error('Solution references missing misleading evidence');
  const sorted = parsed.timeline.map(e => Date.parse(e.timestamp));
  if (sorted.some(Number.isNaN) || sorted.some((v, i) => i && v < sorted[i - 1])) throw new Error('Public timeline must be chronological');
  if (parsed.evidence.some(e => Number.isNaN(Date.parse(e.timestamp)))) throw new Error('Evidence timestamps must be valid');
  const culpritName = parsed.suspects.find(s => s.id === parsed.solution.culpritId).name;
  const escapeRegex = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const name = escapeRegex(culpritName);
  const giveaway = new RegExp(`(?:culprit|killer|thief|perpetrator)\\s+(?:is|was|:)\\s+${name}\\b|\\b${name}\\s+(?:is|was)\\s+(?:the\\s+)?(?:culprit|killer|thief|perpetrator|responsible)|\\b${name}\\s+(?:committed|stole|killed|caused)\\b`, 'i');
  const publicText = JSON.stringify({ premise: parsed.premise, incident: parsed.incident, suspects: parsed.suspects, timeline: parsed.timeline, evidence: parsed.evidence });
  if (giveaway.test(publicText)) throw new Error('Public case content reveals the designated culprit');
  return parsed;
}
