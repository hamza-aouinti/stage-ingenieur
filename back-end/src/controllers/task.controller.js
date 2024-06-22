const db = require("../models/index");
const taskModel = db.task;
const phaseModel = db.phase;
const userModel = db.user;
const projectModel = db.project;

// Définir l'ordre des types de tâches
const order = ["Depannage", "Realisation", "Retouche", "Remplacement"];

const { Op } = require("sequelize");

/* Create New Task */
const addTask = async (req, res, next) => {
  const {
    name,
    status,
    priority,
    type,
    startDate,
    endDate,
    estimatedTime,
    realisation,
    comment,
    phaseId,
    userId,
    parentId,
  } = req.body;
  try {
    const isTaskExist = await taskModel.findOne({
      where: { name: name },
    });
    if (isTaskExist) {
      return res.status(422).send({
        type: "Failed",
        message: "Le ticket existe déjà",
      });
    }
    const phase = await phaseModel.findByPk(phaseId);
    if (!phase) {
      return res
        .status(404)
        .send({ type: "Failed", message: "phase not found" });
    }

    let taskobj = {
      name,
      status,
      priority,
      type,
      startDate,
      endDate,
      estimatedTime,
      realisation,
      comment,
      phaseId,
    };

    if (parentId) {
      const task = await taskModel.findByPk(parentId);
      if (!task) {
        return res
          .status(404)
          .send({ type: "Failed", message: "parent task not found" });
      }
      taskobj = {
        ...taskobj,
        parentId: parentId,
      };
    }
    if (userId) {
      const user = await userModel.findByPk(userId);
      if (!user) {
        return res
          .status(404)
          .send({ type: "Failed", message: "user not found" });
      }
      taskobj = {
        ...taskobj,
        userId: userId,
      };
    }
    const taskResponse = await taskModel.create(taskobj);

    res.status(201).send({
      type: "Success",
      message: "Task Added Successfully",
      results: taskResponse,
    });
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Create child task */
const addChild = async (req, res) => {
  const {
    name,
    status,
    priority,
    type,
    startDate,
    endDate,
    estimatedTime,
    realisation,
    comment,
    phaseId,
    userId,
  } = req.body;

  const parentId = req.params.parentId;

  try {
    const isTaskExist = await taskModel.findOne({
      where: { name: name },
    });
    if (isTaskExist) {
      return res.status(400).send({
        type: "Failed",
        message: "Task Already Exists",
      });
    }
    const parent = await taskModel.findByPk(parentId);
    if (!parent) {
      return res.status(404).json({ message: "Parent task not found" });
    }
    const phase = await phaseModel.findByPk(phaseId);
    if (!phase) {
      return res.status(404).json({ message: "Phase not found" });
    }
    let childTaskObj = {
      name,
      status,
      priority,
      type,
      startDate,
      endDate,
      estimatedTime,
      realisation,
      comment,
      phaseId,
    };

    if (userId) {
      const user = await userModel.findByPk(userId);
      if (!user) {
        return res
          .status(404)
          .send({ type: "Failed", message: "user not found" });
      }
      childTaskObj = {
        ...childTaskObj,
        userId: userId,
      };
    }

    const child = await parent.createChild(childTaskObj);

    // Calculate realization for parent task
    await calculateTaskRealization(parentId);

    res.status(201).json(child);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* Get Tasks By Phase */
const getTasksByPhase = async (req, res) => {
  const phaseId = req.params.id;
  try {
    const phase = await phaseModel.findByPk(phaseId);
    if (!phase) {
      return res
        .status(404)
        .send({ type: "Failed", message: "Phase not found" });
    }
    const taskList = await taskModel.findAll({
      where: { phaseId: phaseId },
      include: [
        {
          model: phaseModel,
          as: "phase",
          include: [
            {
              model: projectModel,
              as: "project",
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
              ],
            },
          ],
        },
        {
          model: userModel,
          paranoid: false,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "department",
            "position",
            "image",
          ],
        },
      ],
    });
    // Trier les tâches en fonction du type
    taskList.sort((a, b) => {
      const typeA = a.type;
      const typeB = b.type;
      return order.indexOf(typeA) - order.indexOf(typeB);
    });
    res.status(200).send(taskList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Get Children Tasks */
const getChildrenTasks = async (req, res) => {
  const parentId = req.params.id;
  try {
    const parent = await taskModel.findByPk(parentId);
    if (!parent) {
      return res.status(404).json({ message: "Parent task not found" });
    }
    const taskList = await taskModel.findAll({
      where: { parentId: parentId },
      include: [
        {
          model: phaseModel,
          as: "phase",
          include: [
            {
              model: projectModel,
              as: "project",
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
              ],
            },
          ],
        },
        {
          model: userModel,
          paranoid: false,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "department",
            "position",
            "image",
          ],
        },
      ],
    });
    // Trier les tâches en fonction du type
    taskList.sort((a, b) => {
      const typeA = a.type;
      const typeB = b.type;
      return order.indexOf(typeA) - order.indexOf(typeB);
    });
    res.status(200).send(taskList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Get Task By Id */
const getTask = async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await taskModel.findOne({
      where: { id: taskId },
      include: [
        {
          model: phaseModel,
          as: "phase",
          include: [
            {
              model: projectModel,
              as: "project",
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
              ],
            },
          ],
        },
      ],
    });
    if (!task) {
      return res
        .status(404)
        .send({ type: "Failed", message: "Unable to Find the Task" });
    }
    return res.status(200).send(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Delete Task By Id */
const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await taskModel.findByPk(taskId);
    if (!task) {
      return res
        .status(404)
        .send({ type: "Failed", message: "Unable to Find the Task" });
    }

    await taskModel.update({ parentId: null }, { where: { parentId: taskId } });
    const parentIdToUpdate = task.parentId;

    taskModel.destroy({ where: { id: taskId } }).then(async (response) => {
      if (!response) {
        res.status(400).send({
          type: "Failed",
          message: "Unable to Delete the Task",
        });
      }

      if (parentIdToUpdate) {
        // Calculate realization for parent task
        await calculateTaskRealization(parentIdToUpdate);
      }

      res.status(200).send({
        type: "Success",
        message: "Task Deleted Successfully !",
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Update Task By Id */
const editTask = async (req, res) => {
  const taskId = req.params.id;
  const {
    name,
    status,
    priority,
    type,
    startDate,
    endDate,
    estimatedTime,
    realisation,
    comment,
    phaseId,
    userId,
    parentId,
    passedTime,
    url,
  } = req.body;

  try {
    const task = await taskModel.findByPk(taskId);
    if (!task) {
      return res
        .status(404)
        .send({ type: "Failed", message: "Task not found" });
    }

    const phase = await phaseModel.findByPk(phaseId);
    if (!phase) {
      return res
        .status(404)
        .send({ type: "Failed", message: "Phase not found" });
    }

    let taskobj = {
      name,
      status,
      priority,
      type,
      startDate,
      endDate,
      estimatedTime,
      realisation,
      comment,
      phaseId,
      userId,
      passedTime,
      url,
    };
    if (parentId) {
      const parentTask = await taskModel.findByPk(parentId);
      if (!parentTask) {
        return res
          .status(404)
          .send({ type: "Failed", message: "parent task not found" });
      }
      taskobj = {
        ...taskobj,
        parentId: parentId,
      };
      /*Update parent task status */
      if (taskobj.status == "In Progress") {
        if (parentTask.status == "New") {
          taskModel
            .update(
              { status: "In Progress" },
              {
                where: { id: parentId },
              }
            )
            .then(async (response) => {
              if (!response) {
                return res.status(400).send({
                  type: "Failed",
                  message: "Unable to Update the Status of Parent Task",
                });
              }
              res.status(200).send({
                type: "Success",
                message: "Parent Task status Updated Successfully !",
                results: taskobj,
              });
            });
        }
      }
    }
    if (userId) {
      const user = await userModel.findByPk(userId);
      if (!user) {
        return res
          .status(404)
          .send({ type: "Failed", message: "user not found" });
      }
      taskobj = {
        ...taskobj,
        userId: userId,
      };
    }

    /*Update task realisation */
    if (taskobj.status == "Completed") taskobj.realisation = 100;

    taskModel
      .update(taskobj, {
        where: { id: taskId },
      })
      .then(async (response) => {
        if (!response) {
          res.status(400).send({
            type: "Failed",
            message: "Unable to Update the Task",
          });
        }

        // Calculate realization for parent task
        if (parentId) {
          await calculateTaskRealization(parentId);
        }
        res.status(200).send({
          type: "Success",
          message: "Task Updated Successfully !",
          results: taskobj,
        });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Search Tasks */
const getTasksByAttribute = async (req, res) => {
  try {
    const { type, status, priority, startDate, endDate, phaseId } = req.query;

    const whereClause = {};
    whereClause.phaseId = phaseId;
    if (type && type !== "All") {
      whereClause.type = type;
    }

    if (status && status !== "All") {
      whereClause.status = status;
    }

    if (priority && priority !== "All") {
      whereClause.priority = priority;
    }

    if (startDate !== "null" && endDate !== "null") {
      whereClause.startDate = { [Op.gte]: startDate };
      whereClause.endDate = { [Op.lte]: endDate };
    } else if (startDate !== "null") {
      whereClause.startDate = { [Op.gte]: startDate };
    } else if (endDate !== "null") {
      whereClause.endDate = { [Op.lte]: endDate };
    }
    const tasks = await taskModel.findAll({
      where: whereClause,
      include: [
        {
          model: phaseModel,
          as: "phase",
          include: [
            {
              model: projectModel,
              as: "project",
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
              ],
            },
          ],
        },
        {
          model: userModel,
          paranoid: false,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "department",
            "position",
            "image",
          ],
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    // Trier les tâches en fonction du type
    tasks.sort((a, b) => {
      const typeA = a.type;
      const typeB = b.type;
      return order.indexOf(typeA) - order.indexOf(typeB);
    });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Calculate Parent Task Realisation */
const calculateTaskRealization = async (taskId) => {
  const childrenTasks = await taskModel.findAll({
    where: { parentId: taskId },
    attributes: ["realisation"],
  });

  const numChildrenTasks = childrenTasks.length;
  let totalRealization = 0;

  childrenTasks.forEach((task) => {
    totalRealization += task.realisation;
  });

  const parentTask = await taskModel.findByPk(taskId);
  if (numChildrenTasks > 0) {
    const parentRealization = (totalRealization / numChildrenTasks).toFixed(2); // format the value with two decimal places.
    await parentTask.update({ realisation: parentRealization });
  }

  // Recursively calculate realization for parent tasks
  if (parentTask.parentId) {
    await calculateTaskRealization(parentTask.parentId);
  }
};

module.exports = {
  addTask,
  getTask,
  deleteTask,
  editTask,
  addChild,
  getTasksByPhase,
  getTasksByAttribute,
  getChildrenTasks,
};
