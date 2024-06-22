var express = require("express");
var router = express();
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const permission = require("../middleware/verifyPermission");
const { check } = require("express-validator");

const multer = require("multer");
const path = require("path");

router.use(express.static(path.resolve(__dirname, "public")));

var storageFiles = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

//define images to insert
const MIME_TYPE = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}
const storageImages = multer.diskStorage({
  // destination
  destination: (req, file, cb) => {
    // verify if image is corresponds to mime type
   const isValid = MIME_TYPE[file.mimetype];
    let error = new Error("Mime type is invalid");
    if (isValid) {
      error = null;
    }
    cb(null, './public/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

/* Create New User */
router.post(
  "/add",
  [
    check("firstName", "FirstName must be atleast 3 characters long")
      .not()
      .isEmpty()
      .isLength({ min: 3 }),
    check("lastName", "LastName must be atleast 3 characters long")
      .not()
      .isEmpty()
      .isLength({ min: 3 }),
    check("email", "Please provide a valid email address")
      .isEmail()
      .normalizeEmail()
      .toLowerCase(),
    check("department", "Department is required").not().isEmpty(),
    check("position", "Position is required").not().isEmpty(),
    check("roleId", "Role is required").not().isEmpty(),
  ],
  //auth,
  //permission,
  multer({ storage: storageImages }).single('image'),
  userController.addUser
);

/* Import File  */
router.post("/importFile",userController.importFile)


/* GET All Users */
router.get("/", auth, permission,userController.getAllUsers);

/* GET A User By Id */
router.get("/:id/getOne", userController.getUser);

/* Import User From csv File*/
router.post(
  "/import",
  multer({ storage: storageFiles, limits: { fileSize: 500000000 } }).single(
    "file"
  ),
  [
    check("firstName", "FirstName must be atleast 3 characters long")
      .not()
      .isEmpty()
      .isLength({ min: 3 }),
    check("lastName", "LastName must be atleast 3 characters long")
      .not()
      .isEmpty()
      .isLength({ min: 3 }),
    check("email", "Please provide a valid email address")
      .isEmail()
      .normalizeEmail()
      .toLowerCase(),
    check("departement", "Department is required").not().isEmpty(),
    check("position", "Position is required").not().isEmpty(),
    check("role", "Role is required").not().isEmpty(),
  ],

  userController.importUser
);

/* Update Existing User */
router.put(
  "/:id/edit",
  [
    check("firstName", "FirstName must be atleast 3 characters long")
      .not()
      .isEmpty()
      .isLength({ min: 3 }),
    check("lastName", "LastName must be atleast 3 characters long")
      .not()
      .isEmpty()
      .isLength({ min: 3 }),
    check("email", "Please provide a valid email address")
      .isEmail()
      .normalizeEmail()
      .toLowerCase(),
    check("departement", "Department is required").not().isEmpty(),
    check("position", "Position is required").not().isEmpty(),
    check("roleId", "Role is required").not().isEmpty(),
  ],

  multer({ storage: storageImages }).single("image"),
  userController.updateUser
);

/* Delete Existing User */
router.delete("/:id/delete", auth, userController.deleteUser);

/* GET Project Count By User */
router.get("/countProjects",userController.calculateProjectCountByUser);

/* GET Users Count By Department */
router.get("/countUsersByDept",userController.calculateUserCountByDepartment);

/* GET Users Count By Department */
router.get("/countUsers",userController.calculateUsersCount);

router.get("/searchUsers", userController.searchUsers);
router.get("/search", userController.searchUserByName);

router.put("/:id/editPassword",userController.updatePassword)
router.post("/upload",userController.uploadDocument)

module.exports = router;
