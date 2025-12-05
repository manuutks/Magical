const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Carta = require("../models/Carta");
const User = require("../models/User");
const auth = require("../middleware/auth");

// pegar comentários de uma carta
router.get("/cartas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await Comment.find({ carta: id }).populate("user", "nome email").sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// adicionar comentário (autenticado)
router.post("/cartas/:id", auth, async (req, res) => {
  try {
    const { id } = req.params; // carta id
    const { texto } = req.body;
    if (!texto) return res.status(400).json({ error: "Texto ausente" });

    const carta = await Carta.findById(id);
    if (!carta) return res.status(404).json({ error: "Carta não encontrada" });

    const comment = await Comment.create({ carta: id, user: req.user.id, texto });
    const populated = await comment.populate("user", "nome email");

    // emitir via socket.io
    const io = req.app.get("io");
    if (io) {
      io.emit("newComment", { cartaId: id, comment: populated });
    }

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

module.exports = router;
