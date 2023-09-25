const Model = require("./user.model");

const create = async (payload) => {
  const { password, ...rest } = payload;
  rest.password = await bcrypt.hash(password, +process.env.SALTS_ROUND);
  return Model.create(payload);
};

const getById = (id) => {
  return Model.findOne({ _id: id });
};

const list = () => {
  return Model.find();
};

const updateById = (id, payload) => {
  return Model.findByIdAndUpdate(id, payload, { new: true });
};

const changeActive = (id, payload) => {
  const { isActive } = payload;
  if (isActive)
    return Model.findByIdAndUpdate(id, { isActive: false }, { new: true });
  else return Model.findByIdAndUpdate(id, { isActive: true }, { new: true });
};

module.exports = { create, getById, list, updateById, changeActive };
