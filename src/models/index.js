import mongoose from 'mongoose';
import serverConfig from '../config';
import logger from '../utilities/logger';

export default () => {
  const connectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  const connectionUri = serverConfig.databaseUri;

  mongoose.connect(connectionUri, connectionOptions)
    .then(() => logger.info('Connection to database has been established'))
    .catch((error) => logger.error('Connection could not be established', error));
};
