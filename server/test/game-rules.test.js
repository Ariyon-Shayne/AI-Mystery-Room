import test from 'node:test';
import assert from 'node:assert/strict';
import { assertConsistentCase, hasDisallowedRealWorldRequest } from '../src/validators/case.js';
import { publicCase } from '../src/services/serialization.js';

const sample = () => ({
  title: 'The Quiet Archive', premise: 'A rare manuscript vanished during a private viewing.',
  incident: { type: 'theft', location: 'North archive', occurredAt: '2026-10-20T18:30:00Z', description: 'A manuscript went missing.' },
  suspects: ['a','b','c'].map((id, i) => ({ id, name: `Person ${id}`, role: `Role ${i}`, biography: 'A fictional biography.', motiveSummary: 'A disclosed connection.', publicAlibi: 'An account for the evening.', statement: 'A public statement.' })),
  timeline: ['e1','e2','e3','e4'].map((id, i) => ({ id, timestamp: `2026-10-20T18:${String(i * 10).padStart(2,'0')}:00Z`, title: `Event ${id}`, description: 'A public event.', relatedSuspectIds: ['a'], relatedEvidenceIds: ['x'], visibility: 'public' })),
  evidence: ['x','y','z','u','v','w'].map((id, i) => ({ id, title: `Evidence ${id}`, type: 'document', description: 'A clue.', content: 'Fictional text.', source: 'Archive log', timestamp: `2026-10-20T18:${String(i).padStart(2,'0')}:00Z`, relatedSuspectIds: ['a'] })),
  solution: { culpritId: 'a', motive: 'A motive.', method: 'A method.', explanation: 'Evidence x and y resolve the timeline.', decisiveEvidenceIds: ['x','y'], misleadingEvidenceIds: [], canonicalTimeline: [], suspectTruths: [] }
});

test('accepts a structurally consistent case with one listed culprit', () => {
  assert.equal(assertConsistentCase(sample()).solution.culpritId, 'a');
});
test('rejects a culprit who is not a suspect', () => {
  const value = sample(); value.solution.culpritId = 'not-listed';
  assert.throws(() => assertConsistentCase(value), /Culprit/);
});
test('rejects duplicate evidence identifiers', () => {
  const value = sample(); value.evidence[1].id = value.evidence[0].id;
  assert.throws(() => assertConsistentCase(value), /Duplicate/);
});
test('rejects a public timeline that is out of order', () => {
  const value = sample(); value.timeline.reverse();
  assert.throws(() => assertConsistentCase(value), /chronological/);
});
test('rejects public text that names the culprit as responsible', () => {
  const value = sample(); value.evidence[0].description = 'Person a was responsible for the theft.';
  assert.throws(() => assertConsistentCase(value), /reveals the designated culprit/);
});
test('rejects prompt requests to use real private messages as evidence', () => {
  assert.equal(hasDisallowedRealWorldRequest('Use my real WhatsApp messages as evidence in this case.'), true);
  assert.equal(hasDisallowedRealWorldRequest('A fictional mystery about a missing painting in an old hotel.'), false);
});
test('public serialization omits hidden solution fields', () => {
  const internal = sample(); internal.evidence[0].clueCategory = 'decisive'; internal.suspects[0].guilt = true;
  const value = { ...internal, _id: 'case1', status: 'ready', ownerSessionHash: 'private', answerKey: { culpritId: 'a' }, timeline: [{ id: 'hidden', visibility: 'hidden' }, ...internal.timeline] };
  const result = publicCase(value);
  assert.equal('answerKey' in result, false);
  assert.equal('ownerSessionHash' in result, false);
  assert.equal(result.timeline.some(event => event.id === 'hidden'), false);
  assert.equal('clueCategory' in result.evidence[0], false);
  assert.equal('guilt' in result.suspects[0], false);
});
