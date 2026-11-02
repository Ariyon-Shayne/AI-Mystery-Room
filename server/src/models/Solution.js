import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', unique: true, required: true },
  culpritId: { type: String, required: true }, motive: String, method: String, canonicalTimeline: [mongoose.Schema.Types.Mixed],
  suspectTruths: [mongoose.Schema.Types.Mixed], decisiveEvidenceIds: [String], misleadingEvidenceIds: [String], explanation: String
}, { timestamps: true });
export const Solution = mongoose.model('Solution', schema);
