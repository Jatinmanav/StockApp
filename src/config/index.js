import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  databaseUri: process.env.DATABASE_URI,
};
