import express from "express";
const router = express.Router();

import { LevelConfigCtrl } from "../../controllers/admin/levelConfigController.js";

import authenticate from "../../middleware/authenticate.js";

import authorize from "../../middleware/authorize.js";

router.use(authenticate);
router.use(authorize("admin"));
/**
 * @swagger
 * tags:
 *   name: Admin Level Configs
 *   description: Admin only – manage level configurations per technology
 */
/**
 * @swagger
 * /admin/level-configs:
 *   get:
 *     summary: Get all level configs (optionally filter by technology)
 *     tags: [Admin Level Configs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: technology
 *         schema:
 *           type: string
 *         description: Technology ID to filter by
 *     responses:
 *       200:
 *         description: List of level configs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LevelConfig'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – admin only
 *   post:
 *     summary: Create or update a level config (upsert)
 *     tags: [Admin Level Configs]
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
 *               - totalQuestions
 *               - timeLimit
 *             properties:
 *               technologyId:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [Basic, Intermediate, Advanced]  // note: capitalized
 *               totalQuestions:
 *                 type: number
 *               timeLimit:
 *                 type: number
 *     responses:
 *       200:
 *         description: Existing config updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LevelConfig'
 *       201:
 *         description: New config created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LevelConfig'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Technology not found
 */
router
  .route("/")
  .get(LevelConfigCtrl.getLevelConfig)
  .post(LevelConfigCtrl.upsertLvelConfig);

/**
 * @swagger
 * /admin/level-configs/{id}:
 *   delete:
 *     summary: Delete a level config by ID
 *     tags: [Admin Level Configs]
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
 *         description: Level config deleted
 *       404:
 *         description: Not found
 */
router.route("/:id").delete(LevelConfigCtrl.deleteLevelConfig);

export const  lvelConfigRoutes  = router;



