import mongoose from 'mongoose';

const DB_OPTIONS = {
  autoIndex: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  maxPoolSize: 50,
  connectTimeoutMS: 10000
};

class DatabaseConnection {
  static instance = null;
  static connection = null;

  static async connect() {
    try {
      if (this.connection) {
        console.log('Using existing database connection');
        return this.connection;
      }

      // Setup connection event handlers
      mongoose.connection.on('connected', () => {
        console.log('🌟 MongoDB connected successfully');
      });

      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', {
          timestamp: new Date().toISOString(),
          error: err.message,
          code: 'DB_CONNECTION_ERROR'
        });
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected:', {
          timestamp: new Date().toISOString(),
          code: 'DB_DISCONNECTED'
        });
      });

      // Handle graceful shutdown
      process.on('SIGINT', async () => {
        try {
          await mongoose.connection.close();
          console.log('MongoDB connection closed through app termination');
          process.exit(0);
        } catch (error) {
          console.error('Error during connection closure:', error);
          process.exit(1);
        }
      });

      // Connect to MongoDB
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in environment variables');
      }

      this.connection = await mongoose.connect(process.env.MONGODB_URI, DB_OPTIONS);
      console.log('New database connection established');
      
      return this.connection;
    } catch (error) {
      console.error('Database connection failed:', {
        timestamp: new Date().toISOString(),
        error: error.message,
        code: 'DB_INITIAL_CONNECTION_ERROR'
      });
      throw error;
    }
  }

  static async getConnection() {
    if (!this.instance) {
      this.instance = new DatabaseConnection();
      await this.connect();
    }
    return this.connection;
  }

  static async closeConnection() {
    try {
      if (this.connection) {
        await mongoose.connection.close();
        this.connection = null;
        this.instance = null;
        console.log('Database connection closed successfully');
      }
    } catch (error) {
      console.error('Error closing database connection:', {
        timestamp: new Date().toISOString(),
        error: error.message,
        code: 'DB_CLOSE_CONNECTION_ERROR'
      });
      throw error;
    }
  }
}

export const connectDB = () => DatabaseConnection.connect();
export const getConnection = () => DatabaseConnection.getConnection();
export const closeConnection = () => DatabaseConnection.closeConnection();

export default connectDB;