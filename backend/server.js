require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");

const Document = require("./model/document");

const mongodb_uri = process.env.MONGODB_URI;

const app = express();

const allowedOrigins = ["https://groupbox.vercel.app", "http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // mobile apps / postman

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

const server = http.createServer(app);

const io = socketIO(server, {
  cors: corsOptions,
});

module.exports.io = io;

const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const documentRoutes = require("./routes/documentRoutes");

app.use("/user", userRoutes);
app.use("/group", groupRoutes);
app.use("/notifications", notificationRoutes);
app.use("/documents", documentRoutes);

mongoose
  .connect(mongodb_uri)
  .then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

io.on("connection", (socket) => {
  console.log("Socket connected");

  socket.on("joinGroup", (groupCode) => {
    socket.join(`group_${groupCode}`);
  });

  socket.on("get-document", async (groupDocumentId) => {
    const document = await findOrCreateDocument(groupDocumentId);

    socket.join(groupDocumentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(groupDocumentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(groupDocumentId, { data });
    });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
});

const findOrCreateDocument = async (groupCode) => {
  if (!groupCode) return null;

  let document = await Document.findById(groupCode);

  if (!document) {
    document = await Document.create({
      _id: groupCode,
      data: "",
    });
  }

  return document;
};
