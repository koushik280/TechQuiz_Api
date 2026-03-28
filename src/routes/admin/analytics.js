import express from "express";
import {
  getOverview,
  getTopUsers,
  getTechnologyAnalytics,
  getUserAnalytics,
} from "../../controllers/admin/analyticsController.js";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize("admin"));
/**
 * @swagger
 * tags:
 *   name: Admin Analytics
 *   description: Admin only – platform analytics and statistics
 */
/**
 * @swagger
 * /admin/analytics/overview:
 *   get:
 *     summary: Overall platform statistics (total attempts, users, average scores)
 *     tags: [Admin Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Overview statistics object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalAttempts:
 *                   type: integer
 *                 totalUsers:
 *                   type: integer
 *                 totalTechnologies:
 *                   type: integer
 *                 averageScore:
 *                   type: number
 *                 averageTimeTaken:
 *                   type: number
 *                 attemptsPerDay:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       count:
 *                         type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin only
 */
router.get("/overview", getOverview);
/**
 * @swagger
 * /admin/analytics/top-users:
 *   get:
 *     summary: Leaderboard – top users by average score (minimum attempts)
 *     tags: [Admin Analytics]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users to return
 *       - in: query
 *         name: minAttempts
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Minimum attempts required to be considered
 *     responses:
 *       200:
 *         description: List of top users with stats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *                   totalAttempts:
 *                     type: integer
 *                   averageScore:
 *                     type: number
 *                   bestScore:
 *                     type: number
 *       403:
 *         description: Forbidden – admin only
 */
router.get("/top-users", getTopUsers);
/**
 * @swagger
 * /admin/analytics/technologies:
 *   get:
 *     summary: Analytics per technology (attempts count and average score)
 *     tags: [Admin Analytics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of technology analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   technology:
 *                     $ref: '#/components/schemas/Technology'
 *                   attempts:
 *                     type: integer
 *                   averageScore:
 *                     type: number
 *                   uniqueUsers:
 *                     type: integer
 *       403:
 *         description: Forbidden – admin only
 */
router.get("/technologies", getTechnologyAnalytics);
/**
 * @swagger
 * /admin/analytics/users/{userId}:
 *   get:
 *     summary: Detailed analytics for a specific user (admin only)
 *     tags: [Admin Analytics]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to analyze
 *     responses:
 *       200:
 *         description: User analytics object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
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
 *                 recentAttempts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Attempt'
 *       403:
 *         description: Forbidden – admin only
 *       404:
 *         description: User not found
 */
router.get("/users/:userId", getUserAnalytics);

const adminAnalyticsRoutes = router;

export { adminAnalyticsRoutes };
