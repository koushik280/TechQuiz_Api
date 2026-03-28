import Attemp from "../models/Attempt.js";

import Technology from "../models/Technology.js";

class AnalyticsController {
  async geUserAttempts(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const skip = (page - 1) * 10;

      const attempts = (
        await Attemp.find({ user: userId }).populate("technology", "name")
      )
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await Attemp.find({ user: userId });

      res.status(200).json({
        attempts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAttemptDetails(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const attempt = await Attempt.findOne({ _id: id, user: userId })
        .populate("technology", "name")
        .populate(
          "questions.questionId",
          "text options correctAnswer explanation",
        )
        .lean();

      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }
      res.status(200).json(attempt);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserStats(req, res) {
    try {
      const userId = req.user.id;

      const stats = await Attemp.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalAttempts: { $sum: 1 },
            avgScore: { $avg: "$score" },
            bestScore: { $max: "$score" },
            totalQuestionsAnswered: { $sum: "$totalQuestions" },
            totalTimeSpent: { $sum: "$timeTaken" },
          },
        },
      ]);

      // Get attempts per technology
      const perTechnology = await Attempt.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: "$technology",
            attempts: { $sum: 1 },
            avgScore: { $avg: "$score" },
            bestScore: { $max: "$score" },
          },
        },
        {
          $lookup: {
            from: "technologies",
            localField: "_id",
            foreignField: "_id",
            as: "technology",
          },
        },
        { $unwind: "$technology" },
        {
          $project: {
            technology: { name: 1 },
            attempts: 1,
            avgScore: 1,
            bestScore: 1,
          },
        },
      ]);

      const summary = stats.length
        ? stats[0]
        : {
            totalAttempts: 0,
            avgScore: 0,
            bestScore: 0,
            totalQuestionsAnswered: 0,
            totalTimeSpent: 0,
          };
      res.status(200).json({
        summary,
        perTechnology,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}


const AnalyticsContrl=new AnalyticsController();
export {AnalyticsContrl};