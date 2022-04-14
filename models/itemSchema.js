const mongoose = require("mongoose");
const connection = mongoose.connection;
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(connection);
const itemSchema = new mongoose.Schema({
  itemId: { type: Number, unique: true },
  name: { type: String, unique: true, required: true },
  price: { type: Number, default: 0 },
  description: { type: String },
  reply: { type: String },
  role_given: { type: String },
  role_required: { type: String },
  duration: { type: Date },
  stock: { type: Number },
});

itemSchema.plugin(autoIncrement.plugin, {
  model: "Items",
  field: "itemId",
  startAt: 1,
  incrementBy: 1,
});

itemSchema.index({ name: 1 });
itemSchema.index({ itemId: 1 });

const model = mongoose.model("Items", itemSchema, "Items");

module.exports = model;
