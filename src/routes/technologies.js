import express from 'express';
import { getAllTechnologies } from '../controllers/technologyController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Technologies
 *   description: Public technology listing
 */

/**
 * @swagger
 * /technologies:
 *   get:
 *     summary: Get all technologies (user must be logged in)
 *     tags: [Technologies]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of technologies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Technology'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, getAllTechnologies);
export default router;