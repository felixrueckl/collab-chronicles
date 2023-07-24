const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("This is the homepage");
});

module.exports = router;
