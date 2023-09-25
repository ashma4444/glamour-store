const { verifyToken } = require("./jwtGenerator");
const UserModel = require("../modules/users/user.model");

const compareRoles = (requiredRoles, userRoles) => {
  console.log(requiredRoles, userRoles);
  if (requiredRoles.length === 0) return true;

  // check and compare the role
  return userRoles.some((v) => requiredRoles.indexOf(v) !== -1); // -1 means element cannot be found in array
};

const secureAPI = (roles) => {
  return async (req, res, next) => {
    try {
      console.log({ roles });
      const token = req?.headers?.authorization;
      if (!token) throw new Error("Access token is required");
      const accessToken = token.split("Bearer ")[1];

      const data = verifyToken(accessToken);
      const { email } = data;

      //user exist check
      const user = await UserModel.findOne({ email });
      if (!user) throw new Error("User not found");

      const { roles: userRoles, _id } = user;
      req.currentUser = _id;

      // user role check
      const isAllowed = compareRoles(roles ?? [], userRoles);
      if (!isAllowed) throw new Error("User not authorized");

      next();
    } catch (e) {
      next(e);
    }
  };
};

module.exports = secureAPI;
