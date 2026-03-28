import express from "express";

import { AnalyticsContrl } from "../controllers/analyticsController.js";

import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: User analytics and attempt history
 */

/**
 * @swagger
 * /analytics/history:
 *   get:
 *     summary: Get current user's attempt history
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user's attempts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attempt'
 *       401:
 *         description: Unauthorized
 */
router.get("/history", AnalyticsContrl.geUserAttempts);
/**
 * @swagger
 * /analytics/stats:
 *   get:
 *     summary: Get current user's personal statistics (average score, total attempts, etc.)
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User stats object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalAttempts:
 *                   type: integer
 *                 averageScore:
 *                   type: number
 *                 bestScore:
 *                   type: number
 *                 worstScore:
 *                   type: number
 *                 totalTimeSpent:
 *                   type: number
 *                 attemptsPerTechnology:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       technology:
 *                         type: string
 *                       attempts:
 *                         type: integer
 *                       averageScore:
 *                         type: number
 *       401:
 *         description: Unauthorized
 */
router.get("/stats", AnalyticsContrl.getUserStats);

/**
 * @swagger
 * /analytics/attempt/{id}:
 *   get:
 *     summary: Get detailed results of a specific attempt
 *     tags: [Analytics]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Attempt ID
 *     responses:
 *       200:
 *         description: Full attempt details with answers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 technology:
 *                   $ref: '#/components/schemas/Technology'
 *                 level:
 *                   type: string
 *                 difficulty:
 *                   type: string
 *                 score:
 *                   type: number
 *                 totalQuestions:
 *                   type: number
 *                 timeTaken:
 *                   type: number
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       questionId:
 *                         $ref: '#/components/schemas/Question'
 *                       selectedOption:
 *                         type: string
 *                       isCorrect:
 *                         type: boolean
 *                 submittedAt:
 *                   type: string
 *                   format: date-time
 *       403:
 *         description: Forbidden – user cannot view another user's attempt
 *       404:
 *         description: Attempt not found
 */
router.get("/attempt/:id", AnalyticsContrl.getAttemptDetails);

const analyticsRoutes = router;

export { analyticsRoutes };
