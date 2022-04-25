const mongoose = require("mongoose");
const connection = mongoose.connection;
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(connection);
const inventorySchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, required: true, ref: "Profiles" },
  item: { type: Number, required: true, ref: "Items" },
  stock: { type: Number, default: 1 },
});

inventorySchema.plugin(autoIncrement.plugin, {
  model: "Inventory",
  field: "item",
  startAt: 1,
  incrementBy: 1,
});

inventorySchema.index({ item: 1 });
inventorySchema.index({ user: 1 });
inventorySchema.index({ user: 1, item: 1 }, { unique: true });

const model = mongoose.model("Inventory", inventorySchema, "Inventory");

module.exports = model;
