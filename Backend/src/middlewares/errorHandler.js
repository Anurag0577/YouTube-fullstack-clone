const errorHandler = (error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: error.stack })
      });
};

export default errorHandler;