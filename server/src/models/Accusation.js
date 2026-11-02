import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true }, ownerSessionHash: { type: String, required: true },
  selectedSuspectId: { type: String, required: true }, isCorrect: { type: Boolean, required: true }, submittedAt: { type: Date, default: Date.now },
  resultExplanation: String
}, { timestamps: true });
schema.index({ caseId: 1, ownerSessionHash: 1 }, { unique: true });
export const Accusation = mongoose.model('Accusation', schema);
