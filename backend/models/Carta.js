const mongoose = require("mongoose");

const cartaSchema = new mongoose.Schema({
  nome: String,
  numero: Number,
  imagem: String,     // path relativo ou URL
  significado: String,
  arcano: { type: String, default: "maior" }
});

module.exports = mongoose.model("Carta", cartaSchema);