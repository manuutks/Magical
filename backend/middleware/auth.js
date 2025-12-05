const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "segredoTarot";

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ error: "Token ausente" });

  const token = auth.split(" ")[1];
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = { id: data.id, nome: data.nome };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

module.exports = authMiddleware;
