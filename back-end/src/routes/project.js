var express = require("express");
var router = express.Router();
const projectTrail = require("../middleware/projectTrail");
const auth = require("../middleware/auth");
const projectController = require("../controllers/project.controller");

/* Search Projects */
router.get("/search", projectController.getProjectByAttribute);

/* GET Projects Classification By Type */
router.get("/statisticsByType", projectController.getProjectsByType);

/* GET Projects Classification By Status */
router.get("/statisticsByStatus", projectController.getProjectsByStatus);

/* GET Projects Statistics */
router.get("/statistics", projectController.getProjectsStatistics);

/* Calculate Project Progress */
router.get("/:id/calculateProgress", projectController.calculateProjectProgress);

/* Calculate users Progress */
router.get("/:id/calculateUsersProgress", projectController.calculateUsersProgress);

/* GET Tasks By Projects */
router.get("/:id/tasks", projectController.getTasksProject);

/* GET All Projects */
router.get("/", auth, projectController.getAllProject);

/* GET Projects By User */
router.get("/:id", auth, projectController.getProjectsByUser);

/* GET Project By Id */
router.get("/:id/getOne", projectController.getProject);

/* Create New Project */
router.post("/add", auth, projectController.addProject, projectTrail);

/* Update Existing Project */
router.put("/:id/edit", auth, projectTrail, projectController.updateProject);

/* Delete Existing Project */
router.delete(
  "/:id/delete",
  auth,
  projectController.deleteProject,
  projectTrail
);

/* Update Existing Project By Adding Users */
router.put(
  "/:id/affectUsersProject",
  auth,
  projectController.affectUsersProject
);

module.exports = router;
