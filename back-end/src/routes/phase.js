var express = require("express");
var router = express.Router();
const auth = require('../middleware/auth')
const phaseController = require("../controllers/phase.controller");

/* Create New Phase */
router.post("/add",auth, phaseController.addPhase);

/* Get All Phases */
router.get("/:id", phaseController.getPhasesByProject);

/* Get Phase By Id */
router.get("/:id/getOne", phaseController.getPhase);

/* Update Existing Phase */
router.put("/:id/edit",phaseController.updatePhase)

/* Delete Existing Phase */
router.delete("/:id/delete", phaseController.deletePhase);

module.exports = router;
