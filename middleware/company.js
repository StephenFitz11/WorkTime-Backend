// Determines if user is a Company (admin)

function company(req, res, next) {
  if (req.user.userType !== "Company")
    return res.status(403).send("Access denied.");
  next();
}

module.exports = company;
