import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  selectedOption: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

const AttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    technology: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Technoloy",
      required: true,
    },
    level: {
      type: String,
      enum: ["basic", "intermediate", "advanced"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    questions: [AnswerSchema],
    score: {
      type: Number, // percentage
      required: true,
      min: 0,
      max: 100,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    timeTaken: {
      type: Number, // seconds
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for analytics
AttemptSchema.index({ user: 1, submittedAt: -1 });
AttemptSchema.index({ technology: 1, submittedAt: -1 });

const Attempt = mongoose.model("Attempt", AttemptSchema);
export default Attempt;
