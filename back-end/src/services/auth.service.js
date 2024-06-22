const db = require("../models");
const userModel = db.user;
const roleModel = db.role;
const bcrypt = require("bcrypt");
const tokenService = require("../services/token.service");

module.exports = {
  signin: async (req, res) => {
    try {
      const user = await userModel.findOne({
        where: { email: req.body.email },
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
      if (!user)
        res
          .status(404)
          .send({ type: "Failed", message: "Unable to Find the User" });
      else {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          let accessToken = await tokenService.getAccessToken(user);
          let refreshToken = await tokenService.getRefreshToken(user);
          return res
            .status(200)
            .send({ accessToken, refreshToken, user, expiresIn: 9999999 });
        } else {
          return res.status(401).send("Unauthorized: Wrong Password!!");
        }
      }
    } catch (error) {
      res.status(500).json({message: error.message})
    }
    
  },

  forgot: async (req, res) => {},
};
