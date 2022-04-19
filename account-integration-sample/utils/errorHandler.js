export const errorHandler = (err, req, res, next) => {
  let { message } = err;
  const response = {
    code: 500,
    message,
    data: err.response && err.response.data,
    stack: (!err.response || !err.response.data) && err.stack,
  };
  res.status(500).json(response);
};
