import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Please add question text"],
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length === 4; // enforce 4 options
        },
        message: "Exactly 4 options are required",
      },
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    technology: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Technoloy",
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    explanation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);


QuestionSchema.index({ technology: 1, difficulty: 1 });

const Question = mongoose.model("Question", QuestionSchema);
export default Question;
