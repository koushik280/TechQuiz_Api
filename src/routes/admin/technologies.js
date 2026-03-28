import express from "express";
const router = express.Router();

import { TechnologyCtrl } from "../../controllers/admin/technologController.js";

import authenticate from "../../middleware/authenticate.js";

import authorize from "../../middleware/authorize.js";

router.use(authenticate);
router.use(authorize("admin"));
/**
 * @swagger
 * tags:
 *   name: Admin Technologies
 *   description: Admin only – manage technologies
 */
/**
 * @swagger
 * /admin/technologies:
 *   get:
 *     summary: Get all technologies (sorted by name)
 *     tags: [Admin Technologies]
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
 *       403:
 *         description: Forbidden – admin only
 *   post:
 *     summary: Create a new technology
 *     tags: [Admin Technologies]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Technology created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Technology'
 *       400:
 *         description: Duplicate name or validation error
 */
router
  .route("/")
  .get(TechnologyCtrl.getTechonologies)
  .post(TechnologyCtrl.createTechnology);

/**
 * @swagger
 * /admin/technologies/{id}:
 *   put:
 *     summary: Update a technology by ID
 *     tags: [Admin Technologies]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       200:
 *         description: Technology updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Technology'
 *       404:
 *         description: Technology not found
 *       400:
 *         description: Duplicate name or validation error
 *   delete:
 *     summary: Delete a technology by ID
 *     tags: [Admin Technologies]
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
 *         description: Technology deleted
 *       400:
 *         description: Cannot delete because it's referenced by level configs or questions
 *       404:
 *         description: Technology not found
 */
router
  .route("/:id")
  .put(TechnologyCtrl.updateTechnology)
  .delete(TechnologyCtrl.deleteTechnology);

const technoloyRoutes = router;
export { technoloyRoutes };

