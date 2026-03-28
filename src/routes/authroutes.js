import express from "express";
const router = express();

import UserCtrl from "../controllers/authcontroller.js";
import authenticate from "../middleware/authenticate.js";
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (role automatically set to 'user')
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User already exists or validation error
 */
router.post("/register", UserCtrl.register);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password (sets HTTP‑only cookies)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", UserCtrl.login);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout (clears authentication cookies)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/refresh", UserCtrl.refereshToken);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout (clears authentication cookies)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", UserCtrl.logoutUser);
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged‑in user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authenticate, UserCtrl.getMe);

export const authRoutes = router;


