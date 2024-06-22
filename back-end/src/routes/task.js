var express = require("express");
var router = express.Router();
const taskTrail = require("../middleware/taskTrail");
const auth = require("../middleware/auth");
const taskController = require("../controllers/task.controller");

/* Search Tasks */
router.get("/search", taskController.getTasksByAttribute);

/* Create New Task */
router.post("/add", auth, taskController.addTask, taskTrail);


/* Get Tasks By Phase */
router.get("/:id", auth, taskController.getTasksByPhase);

/* Get Children Tasks */
router.get("/getChildren/:id", auth, taskController.getChildrenTasks);

/* Get Task By Id */
router.get("/:id/getOne", auth, taskController.getTask);

/* Delete Task By Id */
router.delete("/:id/delete", auth, taskController.deleteTask,taskTrail);

/* Update Task By Id */
router.put("/:id/edit", auth,taskTrail, taskController.editTask);

/* Create child task */
router.post("/addChild/:parentId", auth, taskController.addChild, taskTrail);

module.exports = router;
