const itemModle = require("../models/itemSchema");
module.exports = {
  createItem: async (body) => {
    try {
      const { name } = body;
      const messages = [];
      await itemModle.create(body);

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

  editItem: async (itemId, body) => {
    try {
      return await itemModle.findByIdAndUpdate(itemId, body);
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  getItems: (name) => {
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: "gim" };
    }

    return itemModle.find(query);
  },
};
