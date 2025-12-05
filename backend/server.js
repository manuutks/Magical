require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const cartasRoutes = require("./routes/cartas");
const commentsRoutes = require("./routes/comments");

const app = express();
app.use(cors());
app.use(express.json());

// conectar ao MongoDB (somente se MONGO_URI estiver definida)
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log("MongoDB conectado"))
    .catch(err => console.error("MongoDB error:", err));
} else {
  console.warn("MONGO_URI não definida — pulando conexão com MongoDB (modo sem-banco).");
}

// rotas API
app.use("/api/auth", authRoutes);
app.use("/api/cartas", cartasRoutes);
app.use("/api/comments", commentsRoutes);

// servir frontend estático (pasta public)
app.use(express.static(path.join(__dirname, "..", "public")));

// fallback para SPA (opcional)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

const port = process.env.PORT || 3000;
const server = http.createServer(app);

// configurar Socket.io
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("Novo cliente conectado", socket.id);
  socket.on("disconnect", () => console.log("Cliente desconectado", socket.id));
});

// disponibiliza io para rotas (ex: emitir eventos quando comentário criado)
app.set("io", io);

server.listen(port, () => console.log(`Servidor rodando na porta ${port}`));