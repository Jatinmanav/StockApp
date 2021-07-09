import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import serverConfig from './config/index';
import securityRouter from './routes/security';
import logger from './utilities/logger';

const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Security',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'],
};
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/security', securityRouter);

app.listen(serverConfig.port, () => {
  logger.info(`app is listening on port: ${serverConfig.port}`);
});
