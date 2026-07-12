export const sendSuccess = (res, statusCode, message, data = {}, pagination = null) => {
  const response = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

export const sendError = (res, statusCode, message, error = null) => {
  const response = {
    success: false,
    message,
    error: error || { code: 'UNKNOWN_ERROR', details: [] },
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(response);
};
