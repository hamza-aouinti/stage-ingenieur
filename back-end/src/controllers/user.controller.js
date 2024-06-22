const db = require("../models");

const userModel = db.user;
const roleModel = db.role;
const userProjectModel = db.userproject;

var bcrypt = require("bcrypt");
var createPassword = require("../helpers/createPassword");
const emailNotifications = require("../helpers/emailNotifications");
var csv = require("csvtojson");

const { validationResult } = require("express-validator");
const { Op, Sequelize } = require("sequelize");

var xlsx = require("xlsx");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("file");

const uploadDocument = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      res.status(500).json({ error: err });
    }
    const path = req.file.path;
    console.log(req.file.filename);
    console.log("path", req.file.originalname);
    return res.json({
      originalname: req.file.originalname,
      uploadname: req.file.filename,
    });
  });
};
/* Create New User */
const addUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      department,
      position,
      roleId,
    } = req.body;
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    }
    const isUserExist = await userModel.findOne({ where: { email: email } });
    if (isUserExist) {
      return res.status(422).send({
        type: "Failed",
        message: "Un utilisateur existe déjà avec cette adresse e-mail",
      });
    }
    const role = await roleModel.findByPk(roleId);
    if (!role) {
      return res
        .status(404)
        .send({ type: "Failed", message: "Role not found" });
    }

    const genertedPassword = createPassword(8, true, true);
    const hash = await bcrypt.hash(genertedPassword, 10);

    let userObj = {
      firstName,
      lastName,
      email,
      password: hash,
      phoneNumber,
      department,
      position,
      roleId,
    };

    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      userObj = {
        ...userObj,
        image: url + "/images/" + req.file.filename,
      };
    }
    const user = await userModel.create(userObj);
    emailNotifications.sendUserAuth(userObj.email, genertedPassword);
    return res.status(201).send({
      type: "Success",
      message: "User Added Successfully",
      results: user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET All Users */
const getAllUsers = async (req, res) => {
  const userListResponse = await userModel.findAll({
    include: [
      {
        model: roleModel,
        as: "role",
        include: [
          {
            model: db.permission,
            as: "permissions",
            attributes: ["id", "name", "path"],
            through: {
              attributes: [],
            },
          },
        ],
      },
    ],
  });
  res.status(200).send(userListResponse);
};

const importUser = async (req, res) => {
  let usersNotAddedCount = 0;
  const response = await csv().fromFile(req.file.path);
  const promises = response.reduce(async (prevPromise, row) => {
    await prevPromise;
    if (
      !row.firstName ||
      !row.lastName ||
      !row.email ||
      !row.department ||
      !row.position ||
      !row.role
    ) {
      usersNotAddedCount++;
    } else {
      const roleResponse = row.role;
      const isRoleExist = await roleModel.findOne({
        where: { name: roleResponse },
      });
      if (isRoleExist) {
        row.role = isRoleExist.id;
        const emailResponse = row.email;
        const isUserExist = await userModel.findOne({
          where: { email: emailResponse },
        });
        if (!isUserExist) {
          const genertedPassword = createPassword(8, true, true);
          const hash = await bcrypt.hash(genertedPassword, 10);
          let userData = {
            firstName: row.firstName,
            lastName: row.lastName,
            email: row.email,
            password: hash,
            phoneNumber: row.phoneNumber,
            department: row.department,
            position: row.position,
            role: row.role,
          };
          const user = await userModel.create(userData);
          emailNotifications.sendUserAuth(userData.email, genertedPassword);
        } else usersNotAddedCount++;
      } else usersNotAddedCount++;
    }
    return Promise.resolve();
  }, Promise.resolve());

  await promises;

  return res.status(200).send({
    type: "Success",
    message: " File Imported Successfully",
    file: req.file,
    usersNotAddedCount: usersNotAddedCount,
    totalUsers: response.length,
  });
};

const importFile = async (req, res) => {
  const { file } = req.body;
  // Lire le fichier Excel
  const workbook = xlsx.readFile(file);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet);
  let usersNotAddedCount = 0;
  try {
    await Promise.all(
      data.map(async (row) => {
        if (
          !row.firstName ||
          !row.lastName ||
          !row.email ||
          !row.department ||
          !row.position ||
          !row.role
        ) {
          usersNotAddedCount++;
        } else {
          const roleResponse = row.role;
          const isRoleExist = await roleModel.findOne({
            where: { name: roleResponse },
          });
          if (isRoleExist) {
            row.role = isRoleExist.id;
            const emailResponse = row.email;
            const isUserExist = await userModel.findOne({
              where: { email: emailResponse },
            });
            if (!isUserExist) {
              const genertedPassword = createPassword(8, true, true);
              const hash = await bcrypt.hash(genertedPassword, 10);
              let user = {
                firstName: row.firstName,
                lastName: row.lastName,
                email: row.email,
                password: hash,
                phoneNumber: row.phoneNumber,
                department: row.department,
                position: row.position,
                role: row.role,
              };
              await userModel.create(user);
              emailNotifications.sendUserAuth(userData.email, genertedPassword);
            } else usersNotAddedCount++;
          } else usersNotAddedCount++;
        }
      })
    );
    res.status(201).json(usersNotAddedCount);
  } catch (error) {
    res.status(500).send("Erreur lors de l'importation des articles");
  }
};

/* Update Existing User */
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    department,
    position,
    roleId,
  } = req.body;

  let userObj = {
    firstName,
    lastName,
    email,
    phoneNumber,
    department,
    position,
    roleId,
  };
  const role = await roleModel.findByPk(roleId);
  if (!role) {
    return res.status(404).send({ type: "Failed", message: "Role not found" });
  }

  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    userObj = {
      ...userObj,
      image: url + "/images/" + req.file.filename,
    };
  }

  userModel
    .update(userObj, {
      where: { id: userId },
    })
    .then((response) => {
      if (!response) {
        res.status(400).send({
          type: "Failed",
          message: "Unable to Update the User",
        });
      }
      res.status(200).send({
        type: "Success",
        message: "User Updated Successfully !",
        results: userObj,
      });
    });
};

/* Delete Existing User */
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    userModel.destroy({ where: { id: userId } }).then((response) => {
      if (!response) {
        res.status(400).send({
          type: "Failed",
          message: "Unable to Delete the User",
        });
      }
      res.status(200).send({
        type: "Success",
        message: "User Deleted Successfully !",
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET User By Id */
const getUser = async (req, res) => {
  const userId = req.params.id;
  const userResponse = await userModel.findOne({
    where: { id: userId },
    include: [
      {
        model: roleModel,
        as: "role",
        include: [
          {
            model: db.permission,
            as: "permissions",
            attributes: ["id", "name", "path"],
            through: {
              attributes: [],
            },
          },
        ],
      },
    ],
  });
  if (!userResponse)
    res
      .status(404)
      .send({ type: "Failed", message: "Unable to Find the User" });
  return res.status(200).send(userResponse);
};

const searchUserByName = async (req, res) => {
  const data = req.query.data;
  const userResponse = await userModel.findOne({
    where: {
      firstName: {
        [Op.like]: `${data.slice(0, 3)}%`,
      },
      lastName: {
        [Op.like]: `%${data.slice(-3)}`,
      },
    },
    attributes: ["id"],
  });

  if (!userResponse) {
    res
      .status(404)
      .send({ type: "Failed", message: "Unable to Find the User" });
  } else {
    res.status(200).send(userResponse);
  }
};

const updatePassword = async (req, res) => {
  const id = req.params.id;
  const { password, oldPassword } = req.body;
  const user = await userModel.findByPk(id);

  if (!user)
    return res
      .status(404)
      .send({ type: "Failed", message: "Unable to Find the User" });

  if (bcrypt.compareSync(oldPassword, user.password)) {
    const hash = await bcrypt.hash(password, 10);
    userModel
      .update(
        { password: hash },
        {
          where: { id: id },
        }
      )
      .then((response) => {
        if (!response) {
          res.status(400).send({
            type: "Failed",
            message: "Unable to Update the User's password",
          });
        }
        res.status(200).send({
          type: "Success",
          message: "User's password Updated Successfully !",
        });
      });
  } else
    res.status(400).send({
      type: "Failed",
      message: "wrong password",
    });
};

const searchUsers = async (req, res) => {
  const searchKey = req.query.search;
  try {
    const users = await userModel.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${searchKey}%` } },
          { lastName: { [Op.iLike]: `%${searchKey}%` } },
          { email: { [Op.iLike]: `%${searchKey}%` } },
          { phoneNumber: { [Op.iLike]: `%${searchKey}%` } },
          { department: { [Op.iLike]: `%${searchKey}%` } },
          { position: { [Op.iLike]: `%${searchKey}%` } },
          { "$role.name$": { [Op.iLike]: `%${searchKey}%` } },
        ],
      },
      include: "role",
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const calculateProjectCountByUser = async (req, res) => {
  try {
    const projectCounts = await userProjectModel.findAll({
      attributes: [
        "userId",
        [Sequelize.fn("COUNT", Sequelize.col("projectId")), "projectCount"],
      ],
      include: [
        {
          model: userModel,
          as: "user",
          attributes: [],
        },
      ],
      group: ["userId"],
      raw: true,
    });
    if (!projectCounts) {
      res.status(404).send({ type: "Failed", message: "Unable to Find Data" });
    }
    const populatedProjects = await Promise.all(
      projectCounts.map(async (project) => {
        const user = await userModel.findOne({
          where: { id: project.userId },
          paranoid: false,
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "department",
            "position",
            "image",
          ],
        });

        return {
          ...project,
          user,
        };
      })
    );

    res.status(200).send(populatedProjects);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
const calculateUserCountByDepartment = async (req, res) => {
  try {
    const userCounts = await userModel.findAll({
      attributes: [
        "department",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "userCount"],
      ],
      group: ["department"],
      raw: true,
    });
    if (!userCounts) {
      res.status(404).send({ type: "Failed", message: "Unable to Find Data" });
    }
    const result = userCounts.map((elt) => ({
      name: elt.department,
      value: elt.userCount,
    }));
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

/* GET Count Users */
const calculateUsersCount = async (req, res) => {
  try {
    let countUsers = await userModel.count({});

    if (!countUsers) {
      res.status(404).send({ type: "Failed", message: "Unable to Find Users" });
    }

    const result = {
      countUsers: countUsers,
    };

    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  addUser,
  importUser,
  importFile,
  updateUser,
  deleteUser,
  getUser,
  searchUserByName,
  updatePassword,
  uploadDocument,
  searchUsers,
  calculateProjectCountByUser,
  calculateUserCountByDepartment,
  calculateUsersCount,
};
