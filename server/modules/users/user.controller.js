const bcrypt = require("bcrypt");
const Model = require("./user.model");

const create = async (payload) => {
  const { password, ...rest } = payload;
  rest.password = await bcrypt.hash(password, +process.env.SALTS_ROUND);
  return Model.create(rest);
};

const getById = (id) => {
  return Model.findOne({ _id: id });
};

const list = async (limit, offset, search) => {
  const pageNum = parseInt(offset) || 1;
  const size = parseInt(limit) || 5;
  const query = [];
  // return Model.find(query).skip((pageNum-1)*limit).limit(limit);
  // Filters
  if (search?.name) {
    query.push({
      $match: { name: new RegExp(search?.name, "gi") },
    });
  }
  if (search?.role) {
    query.push({
      $match: { roles: [search?.role] },
    });
  }

  query.push(
    {
      $sort: {
        created_at: -1,
      },
    },
    {
      $facet: {
        metadata: [
          {
            $count: "total",
          },
        ],
        data: [
          {
            $skip: (pageNum - 1) * size,
          },
          {
            $limit: size,
          },
        ],
      },
    },
    {
      $addFields: {
        total: {
          $arrayElemAt: ["$metadata.total", 0],
        },
      },
    },
    {
      $project: {
        data: 1,
        total: 1,
      },
    },
    {
      $project: {
        "data.password": 0,
      },
    }
  );
  const result = await Model.aggregate(query).allowDiskUse(true);
  return { result: result[0].data, total: result[0].total, pageNum, limit };
};

const updateById = (id, payload) => {
  return Model.findOneAndUpdate({ _id: id }, payload, { new: true });
};

const changePassword = async (id, oldPass, newPass) => {
  // user exist
  const user = await Model.findOne({ _id: id }).select("+password");
  if (!user) throw new Error("User not found");

  // old password compare with existing stored hashed password
  const result = await bcrypt.compare(oldPass, user?.password);
  if (!result) throw new Error("Password not matched");

  // new password hash
  // update the password
  return Model.findOneAndUpdate(
    { _id: user?._id },
    { password: await bcrypt.hash(newPass, +process.env.SALTS_ROUND) },
    { new: true }
  );
};

const resetPassword = async (id, newPass) => {
  // user exist
  const user = await Model.findOne({ _id: id });
  if (!user) throw new Error("User not found");

  return Model.findOneAndUpdate(
    { _id: user?._id },
    { password: await bcrypt.hash(newPass, +process.env.SALTS_ROUND) },
    { new: true }
  );
};

const block = async (id, payload) => {
  // user exist
  const user = await Model.findOne({ _id: id });
  if (!user) throw new Error("User not found");

  return Model.findOneAndUpdate({ _id: user?._id }, payload, { new: true });
};

const archive = async (id, payload) => {
  // user exist
  const user = await Model.findOne({ _id: id });
  if (!user) throw new Error("User not found");

  return Model.findOneAndUpdate({ _id: user?._id }, payload, { new: true });
};

const changeActive = (id, payload) => {
  const { isActive } = payload;
  if (isActive)
    return Model.findByIdAndUpdate(id, { isActive: false }, { new: true });
  else return Model.findByIdAndUpdate(id, { isActive: true }, { new: true });
};

module.exports = {
  archive,
  block,
  changeActive,
  changePassword,
  create,
  getById,
  list,
  resetPassword,
  updateById,
};
