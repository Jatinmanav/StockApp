import express from 'express';

import security from '../controllers/security';
import securityValidator from '../middlewares/securityValidator';

const router = express.Router();

/**
 * @openapi
 * /security/test:
 *   get:
 *     description: Check if the API is running.
 *     responses:
 *       200:
 *         description: Returns a success message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                  type: string
 *                  example: success
 */
router.get('/test', security.test);

/**
 * @openapi
 * /security/create:
 *   post:
 *     description: Create a new order.
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - type
 *                - tickerSymbol
 *                - quantity
 *                - price
 *              properties:
 *                type:
 *                  type: string
 *                  example: BUY
 *                tickerSymbol:
 *                  type: string
 *                  example: AXIS
 *                quantity:
 *                  type: number
 *                  example: 100
 *                price:
 *                  type: number
 *                  example: 129.3
 *     responses:
 *       200:
 *         description: Returns the created order.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60ef22852f63dfe89f6886e7
 *                     type:
 *                       type: string
 *                       example: BUY
 *                     tickerSymbol:
 *                       type: string
 *                       example: AXIS
 *                     quantity:
 *                       type: number
 *                       example: 100
 *                     price:
 *                       type: number
 *                       example: 129.3
 */
router.post('/create', securityValidator.createValidationRules(), securityValidator.validate, security.createOrder);

/**
 * @openapi
 * /security/update/{id}:
 *   patch:
 *     description: Update an existing order.
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id of the order to update.
 *         schema:
 *           type: string
 *     requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                type:
 *                  type: string
 *                  example: BUY
 *                tickerSymbol:
 *                  type: string
 *                  example: AXIS
 *                quantity:
 *                  type: number
 *                  example: 100
 *                price:
 *                  type: number
 *                  example: 129.3
 *     responses:
 *       200:
 *         description: Returns the updated order.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60ef22852f63dfe89f6886e7
 *                     type:
 *                       type: string
 *                       example: BUY
 *                     tickerSymbol:
 *                       type: string
 *                       example: AXIS
 *                     quantity:
 *                       type: number
 *                       example: 100
 *                     price:
 *                       type: number
 *                       example: 129.3
 */
router.patch('/update/:id', securityValidator.updateValidationRules(), securityValidator.validate, security.updateOrder);

/**
 * @openapi
 * /security/delete/{id}:
 *   delete:
 *     description: Delete an existing order.
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id of the order to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the deleted order.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60ef22852f63dfe89f6886e7
 *                     type:
 *                       type: string
 *                       example: BUY
 *                     tickerSymbol:
 *                       type: string
 *                       example: AXIS
 *                     quantity:
 *                       type: number
 *                       example: 100
 *                     price:
 *                       type: number
 *                       example: 129.3
 */
router.delete('/delete/:id', securityValidator.deleteValidationRules(), securityValidator.validate, security.deleteOrder);

/**
 * @openapi
 * /security/getTrades:
 *   get:
 *     description: Get all trades corresponding to each security.
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns all securities and their corresponding orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: TCS
 *                       orders:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: 60ef22852f63dfe89f6886e7
 *                             type:
 *                               type: string
 *                               example: BUY
 *                             quantity:
 *                               type: number
 *                               example: 30
 *                             price:
 *                               type: number
 *                               example: 304.2
 */
router.get('/getTrades', security.getTrades);

/**
 * @openapi
 * /security/getPortfolio:
 *   get:
 *     description: Get information regarding all securities in the portfolio.
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns all securities currently held in the portfolio.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: TCS
 *                       quantity:
 *                         type: number
 *                         example: 30
 *                       averagePrice:
 *                         type: number
 *                         example: 232
 */
router.get('/getPortfolio', security.getPortfolio);

/**
 * @openapi
 * /security/getReturns:
 *   get:
 *     description: Get total returns of the portfolio.
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Returns the expected returns of all securities currently in the portfolio.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                  type: number
 *                  example: 200
 */
router.get('/getReturns', security.getReturns);

export default router;
