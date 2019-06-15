module.exports = function(err, req, res, next) {
  // TODO: Create a logger function, winston?

  res.status(500).send(err.message);
};
