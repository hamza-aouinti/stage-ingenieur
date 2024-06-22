const db = require("../models");
const permissionModel = db.permission;

/* GET All Permissions */
const getAllPermissions = async (req, res) => {
  try {
    const permissionListResponse = await permissionModel.findAll({});
    res.status(200).send(permissionListResponse);
  } catch (error) {
    res.status(404).send({
      type: "Failed",
      message: "Unable to Find Permissions",
      error: error,
    });
  }
};

/* Create New Permission */
const addPermission = async (req, res) => {
  const { name } = req.body;
  const isPermissionExist = await permissionModel.findOne({
    where: { name: name },
  });
  if (isPermissionExist) {
    return res.status(400).send({
      type: "Failed",
      message: "Permission Already Exists",
    });
  }
  const permission = await permissionModel.create(req.body);
  return res.status(201).send({
    type: "Success",
    message: "Permission Added Successfully",
    results: permission,
  });
};

/* Update Existing Permission */
const updatePermission = async (req, res) => {
  const permissionId = req.params.id;

  try {
    const permission = await permissionModel.update(req.body, {
      where: { id: permissionId },
    });
    res.status(200).send({
      type: "Success",
      message: "Permission Updated Successfully !",
      results: permission,
    });
  } catch (error) {
    res.status(400).send({
      type: "Failed",
      message: "Unable to Update the Permission",
      error: error,
    });
  }
};

/* Delete Existing Permission */
const deletePermission = async (req, res) => {
  const permissionId = req.params.id;
  try {
    await permissionModel.destroy({ where: { id: permissionId } });
    res.status(200).send({
      type: "Success",
      message: "Permission Deleted Successfully !",
    });
  } catch (error) {
    res.status(400).send({
      type: "Failed",
      message: "Unable to Delete the Permission",
      error: error,
    });
  }
};

/* GET Permission By Id */
const getPermission = async (req, res) => {
  const permissionId = req.params.id;

  let permission = await permissionModel.findOne({
    where: { id: permissionId },
  });
  if (!permission)
    res
      .status(404)
      .send({ type: "Failed", message: "Unable to Find the Permission" });
  else res.status(200).send(permission);
};

module.exports = {
  getAllPermissions,
  addPermission,
  updatePermission,
  deletePermission,
  getPermission,
};
