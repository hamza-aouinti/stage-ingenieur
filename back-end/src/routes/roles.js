var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");

const roleController = require("../controllers/role.controller");

/* GET All Roles */
router.get("/", roleController.getAllRoles);

/* GET Role By Id */
router.get("/:id/getOne", roleController.getRole);

/* Create New Role */
router.post("/add", roleController.addRole);

/* Update Existing Role */
router.put("/:id/edit", roleController.updateRole);

/* Delete Existing Role */
router.delete("/:id/delete", roleController.deleteRole);

module.exports = router;
