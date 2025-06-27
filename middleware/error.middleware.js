const errorHandler = (err, req, res, next) => {
  console.error('❌ Lỗi:', err.stack);

  const statusCode = err.statusCode || 500;

  let message = 'Lỗi hệ thống, vui lòng thử lại sau';

  if (statusCode >= 400 && statusCode < 500 && err.message) {
    message = err.message;
  }

  res.status(statusCode).json({
    message,
    error: process.env.NODE_ENV === 'development' ? err : undefined,
  });
};

export default errorHandler;
