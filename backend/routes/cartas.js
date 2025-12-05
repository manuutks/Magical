const express = require("express");
const router = express.Router();
const Carta = require("../models/Carta");

// retorna todos os Arcanos Maiores ordenados por número
router.get("/maiores", async (req, res) => {
  try {
    const cartas = await Carta.find({ arcano: "maior" }).sort({ numero: 1 });
    res.json(cartas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// carta aleatória (maiores)
router.get("/aleatoria", async (req, res) => {
  try {
    const cartas = await Carta.find({ arcano: "maior" });
    if (!cartas.length) return res.status(404).json({ error: "Nenhuma carta cadastrada" });
    const random = cartas[Math.floor(Math.random() * cartas.length)];
    res.json(random);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

module.exports = router;