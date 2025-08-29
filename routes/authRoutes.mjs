import express from 'express';
import { createAccessToken, refreshAccessToken } from '../controllers/authController.mjs';

const router = express.Router();

router.post('/token', createAccessToken);
router.post('/refresh', refreshAccessToken);

export default router;
