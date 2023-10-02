const { v4: uuidv4 } = require("uuid");

const Model = require("./order.model");
const productModel = require("../products/product.model");

const create = async (payload) => {
  // creating unique id
  payload.id = uuidv4();

  // decrease the product stock
  const products = payload?.products;
  products.map(async (product) => {
    const { product: id, quantity } = product;
    // find the product

    const productInfo = await productModel.findOne({ _id: id });
    if (!productInfo) throw new Error("Product not found");

    // update the stock
    const newQuantity = productInfo?.quantity - quantity;
    if (newQuantity < 0)
      throw new Error(`${productInfo?.name} Product stock is depleted`);

    // write new quantity to product stock
    await productModel.findOneAndUpdate(
      { _id: id },
      { quantity: newQuantity },
      { new: true }
    );
  });

  // create the order
  return await Model.create(payload);
};

const list = async (limit, page, search) => {
  const pageNum = parseInt(page) || 1;
  const size = parseInt(limit) || 5;
  const query = [];
  // Filters
  if (search?.id) {
    query.push({
      $match: { id: new RegExp(search?.id, "gi") },
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
  return await Model.findOne({ id }); // order ko afnai id bata get by id gareko
};

const updateById = async (id, payload) => {
  const { products, ...rest } = payload;
  return await Model.findOneAndUpdate({ id }, rest, { new: true });
};

const removeById = async (id, payload) => {
  // decrease the product stock
  const order = await Model.findOne({ id });

  const products = order?.products;
  products.map(async (product) => {
    const { product: id, quantity } = product;
    // find the product

    const productInfo = await productModel.findOne({ _id: id });
    if (!productInfo) throw new Error("Product not found");

    // update the stock
    const newQuantity = productInfo?.quantity + quantity;

    // write new quantity to product stock
    await productModel.findOneAndUpdate(
      { _id: id },
      {
        quantity: newQuantity,
        updated_by: payload?.updated_by,
        updated_at: payload?.updated_at,
      },
      { new: true }
    );
  });

  // create the order
  return await Model.deleteOne({ id });
};

const approve = async (id, payload) => {
  // const { status } = payload;
  return Model.findOneAndUpdate(
    { id },
    {
      status: payload?.status,
      updated_at: payload?.updated_at,
      updated_by: payload?.updated_by,
    },
    { new: true }
  );
};

module.exports = { approve, create, list, getById, updateById, removeById };
