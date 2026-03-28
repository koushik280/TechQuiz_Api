import mongoose from "mongoose";
const TechnoloySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a technology name"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Techonology = mongoose.model("Technoloy", TechnoloySchema);

export default Techonology;
