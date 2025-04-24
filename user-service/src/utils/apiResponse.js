export class ApiResponse {
    static success(res, { message, data = null, statusCode = 200 }) {
      return res.status(statusCode).json({
        success: true,
        message,
        data
      });
    }
  
    static error(res, { message, statusCode = 400 }) {
      return res.status(statusCode).json({
        success: false,
        message
      });
    }
  }