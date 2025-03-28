import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  originalText: string;
  improvedText?: string;
  modelId: string;
  score: number;
  tone: string;
  sentiment: string;
  persuasiveStrength: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  frameworksUsed?: string[];
  techniquesIdentified?: string[];
  powerDynamics?: string;
  negotiationPhase?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AnalysisSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    originalText: {
      type: String,
      required: true
    },
    improvedText: {
      type: String
    },
    modelId: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    tone: {
      type: String,
      required: true
    },
    sentiment: {
      type: String,
      required: true
    },
    persuasiveStrength: {
      type: Number,
      required: true
    },
    strengths: {
      type: [String],
      required: true
    },
    weaknesses: {
      type: [String],
      required: true
    },
    suggestions: {
      type: [String],
      required: true
    },
    frameworksUsed: {
      type: [String]
    },
    techniquesIdentified: {
      type: [String]
    },
    powerDynamics: {
      type: String
    },
    negotiationPhase: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IAnalysis>('Analysis', AnalysisSchema);
