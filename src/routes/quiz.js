import express from "express";
import { startQuiz, submitQuiz } from "../controllers/quizController.js";

import authenticate from "../middleware/authenticate.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Quiz
 *   description: Quiz operations
 */

/**
 * @swagger
 * /quiz/start:
 *   post:
 *     summary: Start a quiz (returns random questions without correct answers)
 *     tags: [Quiz]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - technologyId
 *               - level
 *             properties:
 *               technologyId:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [basic, intermediate, advanced]
 *     responses:
 *       200:
 *         description: Quiz started
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quizId:
 *                   type: string
 *                 technology:
 *                   type: object
 *                   properties:
 *                     _id: { type: string }
 *                     name: { type: string }
 *                 level:
 *                   type: string
 *                 difficulty:
 *                   type: string
 *                 timeLimit:
 *                   type: number
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id: { type: string }
 *                       text: { type: string }
 *                       options:
 *                         type: array
 *                         items: { type: string }
 *                 totalQuestions:
 *                   type: number
 *       400:
 *         description: Invalid input or not enough questions
 *       401:
 *         description: Unauthorized
 */
router.use(authenticate);
router.post("/start", startQuiz);
/**
 * @swagger
 * /quiz/submit:
 *   post:
 *     summary: Submit quiz answers and get score
 *     tags: [Quiz]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - technologyId
 *               - level
 *               - difficulty
 *               - answers
 *               - timeTaken
 *             properties:
 *               technologyId:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [basic, intermediate, advanced]
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     selectedOption:
 *                       type: string
 *               timeTaken:
 *                 type: number
 *                 description: Time in seconds
 *     responses:
 *       201:
 *         description: Quiz submitted, result returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     attemptId: { type: string }
 *                     score: { type: number }
 *                     totalQuestions: { type: number }
 *                     correctAnswers: { type: number }
 *                     wrongAnswers: { type: number }
 *                     timeTaken: { type: number }
 *                     answers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           questionId: { type: string }
 *                           questionText: { type: string }
 *                           userAnswer: { type: string }
 *                           correctAnswer: { type: string }
 *                           isCorrect: { type: boolean }
 *                           options:
 *                             type: array
 *                             items: { type: string }
 *                           explanation: { type: string }
 *       400:
 *         description: Missing fields or invalid data
 *       401:
 *         description: Unauthorized
 */
router.post("/submit", submitQuiz);

const quizRoute = router;

export { quizRoute };
