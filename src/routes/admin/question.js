import express from "express";
import { questionCtrl } from "../../controllers/admin/questionController.js";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
const router = express.Router();

router.use(authenticate);
router.use(authorize("admin"));
/**
 * @swagger
 * tags:
 *   name: Admin Questions
 *   description: Admin only – manage questions
 */
/**
 * @swagger
 * /admin/questions:
 *   get:
 *     summary: Get all questions (optionally filtered by technology and difficulty)
 *     tags: [Admin Questions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: technology
 *         schema:
 *           type: string
 *         description: Technology ID to filter by
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *         description: Difficulty to filter by
 *     responses:
 *       200:
 *         description: List of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin only
 *   post:
 *     summary: Create a new question
 *     tags: [Admin Questions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - options
 *               - correctOption
 *               - technology
 *               - difficulty
 *             properties:
 *               text:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               correctOption:
 *                 type: number
 *                 description: 0‑based index of correct option
 *               explanation:
 *                 type: string
 *               technology:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *     responses:
 *       201:
 *         description: Question created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Technology not found
 */
router
  .route("/")
  .get(questionCtrl.getQuestions)
  .post(questionCtrl.createQuestion);
/**
 * @swagger
 * /admin/questions/{id}:
 *   put:
 *     summary: Update a question by ID
 *     tags: [Admin Questions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               correctOption:
 *                 type: number
 *               explanation:
 *                 type: string
 *               technology:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *     responses:
 *       200:
 *         description: Question updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: Question not found
 *       400:
 *         description: Validation error
 *   delete:
 *     summary: Delete a question by ID
 *     tags: [Admin Questions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question deleted
 *       404:
 *         description: Question not found
 */
router
  .route("/:id")
  .put(questionCtrl.updateQuestion)
  .delete(questionCtrl.deleteQuestion);

const questionRoutes = router;

export { questionRoutes };
