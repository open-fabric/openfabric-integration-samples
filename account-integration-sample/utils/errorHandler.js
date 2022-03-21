export const errorHandler = (err, req, res, next) => {
  let { message } = err;
  const response = {
    code: 500,
    message,
    stack: err.stack,
  };
  res.status(500).json(response);
};
