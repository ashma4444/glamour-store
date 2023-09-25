const roleModel = require("./role.model");

const create = async (payload) => {
  const role = await roleModel.create(payload);
  return role;
};

const list = async () => {
  return await roleModel.find();
};

const getById = async (id) => {
  return await roleModel.findById({ _id: id });
};

const remove = async (id) => {
  return await roleModel.deleteOne({ _id: id });
};

module.exports = { create, list, getById, remove };
