
const express        = require("express");
const siteRoutes = express.Router();

siteRoutes.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

module.exports = siteRoutes;