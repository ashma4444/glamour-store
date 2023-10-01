const Model = require("./product.model");

const create = async (payload) => {
  return await Model.create(payload);
};

const list = async (limit, page, search) => {
  const pageNum = parseInt(page) || 1;
  const size = parseInt(limit) || 5;
  const query = [];
  // Filters
  if (search?.name) {
    query.push({
      $match: { name: new RegExp(search?.name, "gi") },
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

const getById = async (id) => {
  return await Model.findOne({ _id: id });
};

const updateById = async (id, payload) => {
  return await Model.findOneAndUpdate({ _id: id }, payload, { new: true });
};

const removeById = async (id, payload) => {
  return await Model.findOneAndUpdate({ _id: id }, payload, { new: true });
};

module.exports = { create, list, getById, updateById, removeById };
