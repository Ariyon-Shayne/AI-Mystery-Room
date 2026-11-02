import mongoose from 'mongoose';

const { Schema } = mongoose;
const suspectSchema = new Schema({
  id: { type: String, required: true }, name: { type: String, required: true }, role: String,
  biography: String, motiveSummary: String, publicAlibi: String, statement: String, displayOrder: Number
}, { _id: false });
const eventSchema = new Schema({
  id: String, timestamp: Date, title: String, description: String,
  relatedSuspectIds: [String], relatedEvidenceIds: [String], visibility: { type: String, enum: ['public', 'hidden'], default: 'public' }
}, { _id: false });
const evidenceSchema = new Schema({
  id: String, title: String, type: { type: String, enum: ['chat', 'image', 'document', 'cctv', 'statement', 'physical'] },
  description: String, content: Schema.Types.Mixed, source: String, timestamp: Date,
  relatedSuspectIds: [String], assetIds: [String], clueCategory: String, displayOrder: Number
}, { _id: false });

const caseSchema = new Schema({
  title: { type: String, required: true }, prompt: { type: String, required: true }, genre: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] }, status: { type: String, enum: ['generating', 'ready', 'failed'], default: 'generating' },
  premise: String, incident: { type: Schema.Types.Mixed }, suspects: [suspectSchema], timeline: [eventSchema], evidence: [evidenceSchema],
  ownerSessionHash: { type: String, required: true, index: true }, expiresAt: { type: Date, index: { expires: 0 } },
  generationError: String, retryCount: { type: Number, default: 0 }, idempotencyKey: String
}, { timestamps: true, minimize: false });
caseSchema.index({ ownerSessionHash: 1, createdAt: -1 });
caseSchema.index({ ownerSessionHash: 1, idempotencyKey: 1 }, { unique: true });
export const Case = mongoose.model('Case', caseSchema);
