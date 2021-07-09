import express from 'express';
import security from '../controllers/security';

const router = express.Router();

/**
 * @openapi
 * /security/test:
 *   get:
 *     description: Check if the API is running.
 *     responses:
 *       200:
 *         description: Returns a success message.
 */
router.get('/test', security.test);

export default router;
