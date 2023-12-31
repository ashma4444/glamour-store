const slugify = require("slugify");
const Model = require("./category.model");
const productModel = require("../products/product.model");

const create = async (payload) => {
  // create slug
  payload.slug = slugify(payload.name, { lower: true });
  return await Model.create(payload);
};

const list = async (limit, page, search) => {
  const pageNum = parseInt(page) || 1;
  const size = parseInt(limit) || 5;
  const query = [];
  // Filters
  if (search?.name) {
    query.push({
      $match: { slug: new RegExp(search?.name, "gi") },
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
    }
  );
  const result = await Model.aggregate(query).allowDiskUse(true);
  return {
    result: result[0].data,
    total: result[0].total || 0,
    page: pageNum,
    limit,
  };
};

const getById = async (id) => {
  return await Model.findOne({ _id: id });
};

const updateById = async (id, payload) => {
  if (payload.name) {
    payload.slug = slugify(payload.name);
  }
  return await Model.findOneAndUpdate({ _id: id }, payload, { new: true });
};

const removeById = async (id) => {
  const product = await productModel.findOne({
    category: id,
    isArchived: false,
  });
  if (product)
    throw new Error(
      `Remove category from product named ${product.name} to continue`
    );
  return await Model.deleteOne({ _id: id });
};

module.exports = { create, list, getById, updateById, removeById };
