module.exports = errorHandler = (err, req, res, next) => {
  console.log("path:", req.url, req.method,'err:', err.msg);
  res.status(err.code ?? 500).send(err.msg ?? "Internal server error");
};
