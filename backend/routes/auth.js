const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "segredoTarot";

// registro
router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ error: "Campos ausentes" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email já cadastrado" });

    const hashed = await bcrypt.hash(senha, 10);
    const user = await User.create({ nome, email, senha: hashed });
    const token = jwt.sign({ id: user._id, nome: user.nome }, JWT_SECRET, { expiresIn: "8h" });

    res.json({ message: "Usuário criado", token, user: { id: user._id, nome: user.nome, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: "Campos ausentes" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const ok = await bcrypt.compare(senha, user.senha);
    if (!ok) return res.status(401).json({ error: "Senha incorreta" });

    const token = jwt.sign({ id: user._id, nome: user.nome }, JWT_SECRET, { expiresIn: "8h" });
    res.json({ message: "Login ok", token, user: { id: user._id, nome: user.nome, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

module.exports = router;

