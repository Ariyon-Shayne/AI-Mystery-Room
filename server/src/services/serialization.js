export function publicCase(record) {
  return {
    caseId: String(record._id), title: record.title, prompt: record.prompt, genre: record.genre, difficulty: record.difficulty,
    status: record.status, premise: record.premise, incident: record.incident,
    suspects: record.suspects?.map(({ id, name, role, biography, motiveSummary, publicAlibi, statement, displayOrder }) => ({ id, name, role, biography, motiveSummary, publicAlibi, statement, displayOrder })),
    timeline: record.timeline?.filter(event => event.visibility !== 'hidden').map(({ id, timestamp, title, description, relatedSuspectIds, relatedEvidenceIds }) => ({ id, timestamp, title, description, relatedSuspectIds, relatedEvidenceIds })),
    evidence: record.evidence?.map(({ id, title, type, description, content, source, timestamp, relatedSuspectIds, assetIds, displayOrder }) => ({ id, title, type, description, content, source, timestamp, relatedSuspectIds, assetIds, displayOrder })),
    progress: { suspects: record.suspects?.length || 0, evidence: record.evidence?.length || 0 }, createdAt: record.createdAt, updatedAt: record.updatedAt
  };
}
export function publicEvidence(record, id) { return record.evidence.find(item => item.id === id); }
