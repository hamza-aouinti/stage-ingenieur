const db = require("../models/index");
const projectModel = db.project;
const phaseModel = db.phase;
const userModel = db.user;
const taskModel = db.task;
const userProjectModel = db.userproject;

const { Op, Sequelize } = require("sequelize");
const type = "Système Electronique";
const status = "In Progress";

const addProject = async (req, res, next) => {
  const { name, description, startDate, endDate, type, users } = req.body;
  try {
    const isProjectExist = await projectModel.findOne({
      where: { name: name },
    });
    if (isProjectExist) {
      return res
        .status(422)
        .send({ type: "Failed", message: "Le nom du projet existe déjà" });
    }
    const projectObj = {
      name,
      description,
      startDate,
      endDate,
      type,
    };

    const project = await projectModel.create(projectObj);

    if (users && users.length > 0) {
      await project.addUser(users);
    }
    const backlogObj = {
      title: "Liste des taches",
      startDate: startDate,
      endDate: endDate,
      projectId: project.id,
    };

    await phaseModel.create(backlogObj);
    res.status(201).send({
      type: "Success",
      message: "Project Added Successfully",
      results: project,
    });
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET All Projects */
const getAllProject = async (req, res) => {
  try {
    let projectList = await projectModel.findAll({
      include: [
        {
          model: userModel,
          attributes: ["id"],
          through: {
            attributes: [],
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    console.log(projectList)
    res.status(200).send(projectList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET Projects Classification By Type */
const getProjectsByType = async (req, res) => {
  try {
    let projectList = await projectModel.findAll({
      attributes: [
        "type",
        "status",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "value"],
      ],
      group: ["type", "status"],
      raw: true,
    });

    const formattedData = {};
    projectList.forEach((data) => {
      const { type, status, value } = data;
      if (!formattedData[type]) {
        formattedData[type] = {
          name: type,
          series: [],
        };
      }
      formattedData[type].series.push({ name: status, value });
    });

    const result = Object.values(formattedData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET Projects By User */
const getProjectsByUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .send({ type: "Failed", message: "user not found" });
    }
    let projectList = await userProjectModel.findAll({
      where: { userId: userId },
      include: [
        {
          model: projectModel,
          as: "project",
          include: [
            {
              model: phaseModel,
              as: "phases",
              include: [
                {
                  model: taskModel,
                  as: "tasks",
                },
              ],
            },
            {
              model: userModel,
              attributes: ["id"],
              through: {
                attributes: [],
              },
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send(projectList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET Project By Id */
const getProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await projectModel.findOne({
      where: { id: projectId },
      include: [
        {
          model: userModel,
          paranoid: false,
          as: "users",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "department",
            "position",
            "image",
          ],
          through: {
            attributes: [],
          },
        },
        {
          model: phaseModel,
          as: "phases",
          include: [
            {
              model: taskModel,
            },
          ],
        },
      ],
    });
    if (!project)
      res
        .status(404)
        .send({ type: "Failed", message: "Unable to Find the Project" });
    else res.status(200).send(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Search Projects */
const getProjectByAttribute = async (req, res) => {
  try {
    const { type, status, startDate, endDate } = req.query;
    const whereClause = {};

    if (type && type !== "All") {
      whereClause.type = type;
    }

    if (status && status !== "All") {
      whereClause.status = status;
    }

    if (startDate !== "null" && endDate !== "null") {
      whereClause.startDate = { [Op.gte]: startDate };
      whereClause.endDate = { [Op.lte]: endDate };
    } else if (startDate !== "null") {
      whereClause.startDate = { [Op.gte]: startDate };
    } else if (endDate !== "null") {
      whereClause.endDate = { [Op.lte]: endDate };
    }

    const projects = await projectModel.findAll({
      where: whereClause,
      include: [
        {
          model: userModel,
          paranoid: false,
          attributes: ["id"],
          through: {
            attributes: [],
          },
        },
      ],
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE Project By Id */
const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name, description, startDate, endDate, status, type, users } =
      req.body;
    const project = await projectModel.findByPk(projectId, {
      include: [
        {
          model: userModel,
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
            "department",
            "position",
          ],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!project) {
      return res.status(404).send({
        type: "Failed",
        message: "Unable to Find the Project",
      });
    }

    project.name = name;
    project.description = description;
    project.startDate = startDate;
    project.endDate = endDate;
    project.status = status;
    project.type = type;

    if (users) {
      const existingUsers = project.users.map((p) => p.id);
      const newUsers = users.map((p) => p);

      const UsersToDelete = existingUsers.filter((p) => !newUsers.includes(p));
      await project.removeUser(UsersToDelete);

      const UsersToAdd = users.filter((p) => !existingUsers.includes(p.id));
      await project.addUser(UsersToAdd);
    }

    await project.save();

    return res.status(200).send({
      type: "Success",
      message: "Project Updated Successfully !",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res, next) => {
  const projectId = req.params.id;
  try {
    const project = await projectModel.findOne({
      where: { id: projectId },
      include: "phases",
      include: [
        {
          model: userModel,
        },
      ],
    });
    const usersToDelete = project.users.map((p) => p.id);
    await project.removeUser(usersToDelete);
    if (!project) {
      return res.status(404).send("Project not found");
    }

    await db.userproject.destroy({
      where: { id: projectId },
    });

    await project.destroy();

    res.status(200).json({ message: "project deleted successfully" });
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const affectUsersProject = async (req, res) => {
  const projectId = req.params.id;
  const { user } = req.body;
  try {
    const project = await projectModel.findByPk(projectId);
    if (!project) {
      return res.status(404).send({
        type: "Failed",
        message: "Unable to Find the Project",
      });
    }
    if (user) {
      await project.addUsers(user);
    }
    return res.status(200).send({
      type: "Success",
      message: "Users Added Successfully !",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET Project By Id */
const getTasksProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await projectModel.findOne({
      where: { id: projectId },
      include: [
        {
          model: phaseModel,
          as: "phases",
          include: [
            {
              model: taskModel,
            },
          ],
        },
      ],
    });

    if (!project)
      res
        .status(404)
        .send({ type: "Failed", message: "Unable to Find the Project" });
    else {
      const taskCounts = {};

      // Count tasks for each status
      project.phases.forEach((phase) => {
        phase.tasks.forEach((task) => {
          const status = task.status;
          if (taskCounts[status]) {
            taskCounts[status]++;
          } else {
            taskCounts[status] = 1;
          }
        });
      });

      // Format the result as an array of objects
      const result = Object.keys(taskCounts).map((status) => ({
        name: status,
        value: taskCounts[status],
      }));

      res.status(200).send(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*Calculate Project Progress */
const calculateProjectProgress = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await projectModel.findOne({
      where: { id: projectId },
      include: [
        {
          model: phaseModel,
          as: "phases",
          include: [
            {
              model: taskModel,
            },
          ],
        },
      ],
    });

    if (!project)
      res
        .status(404)
        .send({ type: "Failed", message: "Unable to Find the Project" });
    else {
      let taskCounts = 0;
      let tasksRealisation = 0;
      let projectRealisation = 0;
      let projectPassedTime = 0;

      // Count project realisation and passedTime
      project.phases.forEach((phase) => {
        phase.tasks.forEach((task) => {
          taskCounts++;
          tasksRealisation += task.realisation;
          projectPassedTime += task.passedTime;
        });
      });
      if (taskCounts > 0)
        projectRealisation = (tasksRealisation / taskCounts).toFixed(2);
      const result = {
        realisation: projectRealisation,
        passedTime: projectPassedTime,
      };
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const calculateUsersProgress = async (req, res) => {
  const phaseId = req.params.id;
  try {
    const phase = await phaseModel.findByPk(phaseId);
    if (!phase) {
      return res
        .status(404)
        .send({ type: "Failed", message: "Phase not found" });
    }

    const tasks = await taskModel.findAll({
      where: { phaseId: phaseId },
      attributes: [
        "userId",
        [Sequelize.fn("SUM", Sequelize.col("passedTime")), "totalPassedTime"],
        [
          Sequelize.fn("SUM", Sequelize.col("estimatedTime")),
          "totalEstimatedTime",
        ],
      ],
      group: ["userId"],
      raw: true,
      include: [
        {
          model: userModel,
          as: "user",
          attributes: [],
        },
      ],
    });

    if (!tasks) {
      res.status(404).send({ type: "Failed", message: "Unable to Find Tasks" });
    }

    const populatedTasks = await Promise.all(
      tasks.map(async (task) => {
        const user = await userModel.findOne({
          where: { id: task.userId },
          attributes: ["id", "firstName", "lastName"],
        });

        return {
          ...task,
          user,
        };
      })
    );

    const result = populatedTasks.map((task) => ({
      name: task.user
        ? `${task.user.firstName} ${task.user.lastName}`
        : "Unknown User",
      series: [
        {
          name: "estimatedTime",
          value: task.totalEstimatedTime || 0,
        },
        {
          name: "passedTime",
          value: task.totalPassedTime || 0,
        },
      ],
    }));

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ type: "Failed", message: "Internal Server Error" });
  }
};

/* GET Projects Classification By Status */
const getProjectsByStatus = async (req, res) => {
  try {
    let projectList = await projectModel.findAll({
      attributes: [
        "status",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "value"],
      ],
      group: ["status"],
      raw: true,
    });

    if (!projectList) {
      res.status(404).send({ type: "Failed", message: "Unable to Find Data" });
    }
    const result = projectList.map((project) => ({
      name: project.status,
      value: project.value,
    }));

    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET Projects Statistics */
const getProjectsStatistics = async (req, res) => {
  try {
    let countHardwareProjects = await projectModel.count({
      where: { type: type },
    });

    const countSoftwareProjects = await projectModel.count({
      where: {
        type: {
          [Sequelize.Op.ne]: type,
        },
      },
    });

    let countInProgressProjects = await projectModel.count({
      where: {
        status: status,
      },
    });

    if (
      !countHardwareProjects ||
      !countSoftwareProjects ||
      !countInProgressProjects
    ) {
      res.status(404).send({ type: "Failed", message: "Unable to Find Data" });
    }

    const result = {
      softwareProjects: countSoftwareProjects,
      hardwareProjects: countHardwareProjects,
      inProgressProjects: countInProgressProjects,
    };

    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addProject,
  getAllProject,
  updateProject,
  getProject,
  deleteProject,
  getProjectByAttribute,
  getProjectsByUser,
  affectUsersProject,
  getProjectsByType,
  getTasksProject,
  calculateProjectProgress,
  calculateUsersProgress,
  getProjectsByStatus,
  getProjectsStatistics,
};
