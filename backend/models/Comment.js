const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  carta: { type: mongoose.Schema.Types.ObjectId, ref: "Carta", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  texto: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);
