module.exports = routeNotFound = (req, res) =>
  res.status(404).send("Route not found");
