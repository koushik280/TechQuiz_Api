import mongoose from "mongoose";

const LevelConfigSchema = new mongoose.Schema(
  {
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
    questionCount: {
      type: Number,
      required: true,
      min: 1,
    },
    timeLimit: {
      type: Number, // in minutes
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  },
);

// -----------------------------------------------------------------------------
// COMPOUND INDEX: { technology: 1, level: 1 }
//
// PURPOSE:
// 1. Enforces UNIQUE combination of (technology + level)
//    → Prevents duplicate configs for the same technology & level
//    Example:
//      React + basic (duplicate not allowed)
//      React + basic, React + intermediate (allowed)
//
// 2. Improves query performance for frequent lookups
//    Optimized for queries like:
//      LevelConfig.find({ technology: techId, level: "basic" })
//
// HOW IT WORKS:
// MongoDB creates an internal index (B-Tree) like:
//   (technologyId, level) → document reference
//
// So instead of scanning the whole collection,
// MongoDB directly jumps to the matching document.
//
// QUERY BEHAVIOR:
// FULL INDEX USAGE:
//    { technology, level } → fastest (exact match)
//
// PARTIAL INDEX USAGE:
//    { technology } → still uses index (prefix match)
//
// NO INDEX USAGE:
//    { level } → inefficient (because 'technology' is first key)
//
// ORDER MATTERS:
// The index is defined as:
//    { technology: 1, level: 1 }
// So queries must start with 'technology' to benefit.
//
// TRADE-OFF:
// - Faster reads
// - Slightly slower writes (insert/update) due to index maintenance
//
// USE CASE IN THIS APP:
// Each technology should have only ONE config per level:
//    React → basic / intermediate / advanced
//    Node  → basic / intermediate / advanced
//
// -----------------------------------------------------------------------------

LevelConfigSchema.index({ technology: 1, level: 1 }, { unique: true });

const LevelConfig = mongoose.model("LevelConfig", LevelConfigSchema);
export default LevelConfig;
