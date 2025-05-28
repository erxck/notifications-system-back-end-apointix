const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // ajuste para seu domínio
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🔌 Cliente conectado:", socket.id);

  socket.on("disconnect", () => console.log("❌ Cliente saiu:", socket.id));
});

app.get("/", (req, res) => {
  res.send("Servidor ativo");
});

// Rota REST → cria agendamento e emite evento
app.post("/appointments", (req, res) => {
  const appt = req.body;
  io.emit("appointment:new", appt);
  res.status(200).send({ ok: true });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Socket server ON :${PORT}`));
