// src/controllers/quizController.js
import Techonology from "../models/Technology.js";
import LevelConfig from "../models/LevelConfig.js";
import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js"; // Add this import
import mongoose from "mongoose";

const levelToDifficulty = {
  basic: "easy",
  intermediate: "medium",
  advanced: "hard",
};

/**
 * @desc    Start a quiz
 * @route   POST /api/quiz/start
 * @access  Private
 */
export const startQuiz = async (req, res) => {
  try {
    const { technologyId, level } = req.body;

    if (!technologyId || !level) {
      return res
        .status(400)
        .json({ message: "technologyId and level are required" });
    }

    const technology = await Techonology.findById(technologyId);
    if (!technology) {
      return res.status(404).json({ message: "Technology not found" });
    }

    const normalizedLevel = level.toLowerCase();
    if (!["basic", "intermediate", "advanced"].includes(normalizedLevel)) {
      return res
        .status(400)
        .json({ message: "Level must be basic, intermediate, or advanced" });
    }

    const levelConfig = await LevelConfig.findOne({
      technology: technologyId,
      level: normalizedLevel,
    });
    if (!levelConfig) {
      return res
        .status(404)
        .json({ message: "Level configuration not found for this technology" });
    }

    const difficulty = levelToDifficulty[normalizedLevel];
    const requiredCount = levelConfig.questionCount;

    const questions = await Question.aggregate([
      { $match: { technology: technology._id, difficulty: difficulty } },
      { $sample: { size: requiredCount } },
    ]);

    if (questions.length < requiredCount) {
      return res.status(400).json({
        message: `Not enough questions available. Required: ${requiredCount}, Available: ${questions.length}`,
      });
    }

    // Remove the correctAnswer field from each question before sending
    const quizQuestions = questions.map(({ correctAnswer, ...rest }) => rest);

    const quizData = {
      quizId: new mongoose.Types.ObjectId(), // optional session ID
      technology: {
        _id: technology._id,
        name: technology.name,
      },
      level: normalizedLevel,
      difficulty,
      timeLimit: levelConfig.timeLimit, // in minutes
      questions: quizQuestions,
      totalQuestions: requiredCount,
    };

    res.status(200).json(quizData);
  } catch (error) {
    console.error("Quiz start error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Submit quiz answers and save attempt
 * @route   POST /api/quiz/submit
 * @access  Private
 * @body    {
 *            technologyId,
 *            level,
 *            difficulty,
 *            answers: [ { questionId, selectedOption } ],
 *            timeTaken   // seconds
 *          }
 */
export const submitQuiz = async (req, res) => {
  try {
    const { technologyId, level, difficulty, answers, timeTaken } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (
      !technologyId ||
      !level ||
      !difficulty ||
      !answers ||
      timeTaken === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch all questions
    const questionIds = answers.map((a) => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    if (questions.length !== questionIds.length) {
      return res.status(400).json({ message: "Some questions not found" });
    }

    // Map question ID -> correct answer text
    const correctMap = new Map();
    questions.forEach((q) => {
      correctMap.set(q._id.toString(), q.correctAnswer);
    });

    let correctCount = 0;
    const answersWithCorrectness = answers.map((ans) => {
      const isCorrect =
        ans.selectedOption === correctMap.get(ans.questionId.toString());
      if (isCorrect) correctCount++;
      return {
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        isCorrect,
      };
    });

    const totalQuestions = answers.length;
    const scorePercentage = (correctCount / totalQuestions) * 100;

    // Create attempt record
    const attempt = await Attempt.create({
      user: userId,
      technology: technologyId,
      level,
      difficulty,
      questions: answersWithCorrectness,
      score: scorePercentage,
      totalQuestions,
      timeTaken,
      submittedAt: new Date(),
    });

    // Populate for detailed response
    const populatedAttempt = await Attempt.findById(attempt._id)
      .populate("technology", "name")
      .populate("user", "name email")
      .populate(
        "questions.questionId",
        "text options correctAnswer explanation",
      );

    // Prepare result summary
    const result = {
      attemptId: populatedAttempt._id,
      score: populatedAttempt.score,
      totalQuestions: populatedAttempt.totalQuestions,
      correctAnswers: correctCount,
      wrongAnswers: totalQuestions - correctCount,
      timeTaken: populatedAttempt.timeTaken,
      answers: populatedAttempt.questions.map((q) => ({
        questionId: q.questionId._id,
        questionText: q.questionId.text,
        userAnswer: q.selectedOption,
        correctAnswer: q.questionId.correctAnswer,
        isCorrect: q.isCorrect,
        options: q.questionId.options,
        explanation: q.questionId.explanation,
      })),
    };

    res.status(201).json({
      message: "Quiz submitted successfully",
      result,
    });
  } catch (error) {
    console.error("Submit quiz error:", error);
    res.status(500).json({ message: error.message });
  }
};
