const inventoryModel = require("../models/inventorySchema");
module.exports = {
  addItem: async (body) => {
    try {
      const { user, item } = body;
      const messages = [];
      await inventoryModel.create(body);

      if (messages.length > 0) {
        return { success: false, messages };
      } else {
        return { success: true };
      }
    } catch (error) {
      console.log(error);
      return { success: false, messages: error.message };
    }
  },

  edit: async (userId, itemId, body) => {
    const { stock } = body;
    const messages = [];
    if (!stock) {
      messages.push("Vui long nhap so luong");
    }
    await inventoryModel.findOneAndUpdate(
      { user: userId, item: itemId },
      { stock: { $inc: stock } }
    );

    if (messages.length > 0) {
      return { success: false, messages };
    } else {
      return { success: true };
    }
  },

  getItems: ({ userId, itemId }) => {
    const query = {};

    if (userId) {
      query.user = userId;
    }

    if (itemId) {
      query.item = itemId;
    }
    return inventoryModel.find(query).populate("item", { name: 1 });
  },

  getItem: ({ userId, itemId }) => {
    const query = {};

    if (userId) {
      query.user = userId;
    }

    if (itemId) {
      query.item = itemId;
    }
    return inventoryModel.findOne(query).populate("item", { name: 1 });
  },
};
