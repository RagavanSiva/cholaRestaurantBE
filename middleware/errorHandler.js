const { logEvents } = require("./logger");

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t ${req.method}\t${req.url}\t${req.headers.origin}\n`,
    "errLog.log"
  );

  console.log(err.stack);
  const status = res.statusCode ? res.statusCode : 500; //server Error

  res.status(status);
  res.json({
    message: err.message,
  });

  next();
};

module.exports = errorHandler;