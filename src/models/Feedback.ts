import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  userId: mongoose.Types.ObjectId;
  analysisId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  modelId: string;
  suggestionType: 'analysis' | 'improvement';
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    analysisId: {
      type: Schema.Types.ObjectId,
      ref: 'Analysis',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String
    },
    modelId: {
      type: String,
      required: true
    },
    suggestionType: {
      type: String,
      enum: ['analysis', 'improvement'],
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
