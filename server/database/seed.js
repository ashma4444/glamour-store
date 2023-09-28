require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const userController = require("../modules/users/user.controller");

mongoose.connect(process.env.DB_URL);

const setup = {
  initialize: async () => {
    await mongoose.connection.dropDatabase();
    console.log("DB reset");

    // creating admin
    const payload = {
      name: "Ashma Admin",
      email: "admin@gmail.com",
      password: "12345",
      isEmailVerified: true,
      roles: ["admin"],
    };
    await userController.create(payload);

    // creating normal user
    const userPayload = {
      name: "Ashma User",
      email: "ashma@gmail.com",
      password: "12345",
      isEmailVerified: true,
    };
    await userController.create(userPayload);
  },
};
setup.initialize();
