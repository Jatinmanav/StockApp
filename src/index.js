import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import cors from 'cors';

import initDbConnection from './models';
import serverConfig from './config/index';
import securityRouter from './routes/security';
import logger from './utilities/logger';

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

const app = express();

initDbConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/security', securityRouter);

app.listen(serverConfig.port, () => {
  logger.info(`app is listening on port: ${serverConfig.port}`);
});
