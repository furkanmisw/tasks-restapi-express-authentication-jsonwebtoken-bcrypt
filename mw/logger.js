module.exports = logger = (req, res, next) => {
  console.log(`Logger: ${req.method} ${req.url}`);
  next();
};
