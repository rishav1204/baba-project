import mongoose from 'mongoose';
import { logError } from '../utils/errorLogger.js';

const DB_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  maxPoolSize: 50,
  connectTimeoutMS: 10000
};

let connection = null;

const connectDB = async () => {
  try {
    if (connection) {
      return connection;
    }

    mongoose.connection.on('connected', () => {
      console.log('🌟 MongoDB connected successfully');
    });

    mongoose.connection.on('error', async (err) => {
      await logError(err, { 
        method: 'MongoDB_Connection',
        path: 'database/connection',
        error: {
          severity: 'ERROR',
          code: 'DB_CONNECTION_ERROR'
        }
      });
    });

    mongoose.connection.on('disconnected', async () => {
      const disconnectError = new Error('MongoDB disconnected');
      await logError(disconnectError, {
        method: 'MongoDB_Connection',
        path: 'database/connection',
        error: {
          severity: 'WARNING',
          code: 'DB_DISCONNECTED'
        }
      });
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

    connection = await mongoose.connect(process.env.MONGODB_URI, DB_OPTIONS);
    return connection;
  } catch (error) {
    await logError(error, {
      method: 'MongoDB_Connection',
      path: 'database/connection',
      error: {
        severity: 'ERROR',
        code: 'DB_INITIAL_CONNECTION_ERROR'
      }
    });
    process.exit(1);
  }
};

export const getConnection = async () => {
  try {
    if (!connection) {
      connection = await connectDB();
    }
    return connection;
  } catch (error) {
    await logError(error, {
      method: 'getConnection',
      path: 'database/connection',
      error: {
        severity: 'ERROR',
        code: 'DB_GET_CONNECTION_ERROR'
      }
    });
    throw error;
  }
};

export const closeConnection = async () => {
  try {
    if (connection) {
      await mongoose.connection.close();
      connection = null;
      console.log('MongoDB connection closed');
    }
  } catch (error) {
    await logError(error, {
      method: 'closeConnection',
      path: 'database/connection',
      error: {
        severity: 'WARNING',
        code: 'DB_CLOSE_CONNECTION_ERROR'
      }
    });
    throw error;
  }
};

export default connectDB;