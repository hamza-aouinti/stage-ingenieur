var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");

const trailController = require("../controllers/trail.controller");

/* GET All Trails Projects */
router.get("/project/:id", auth, trailController.getAllTrailsProject);

/* GET All Trails Tasks */
router.get("/task/:id", auth, trailController.getAllTrailsTask);

module.exports = router;
