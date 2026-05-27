require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");

const Document = require("./model/document");

const mongodb_uri = process.env.MONGODB_URI;
// HOSTING VERSION --------------------------
const allowedOrigins = ["https://groupbox.vercel.app"];

const app = express();

// const server = http.createServer(app);
// const io = socketIO(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// HOSTING VERSION --------------------------
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

module.exports.io = io;
// HOSTING VERSION --------------------------
// HOSTING VERSION --------------------------
// HOSTING VERSION --------------------------
// HOSTING VERSION --------------------------
// HOSTING VERSION --------------------------
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// app.use(cors());
app.use(express.json());

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
  .then((connect) => {
    server.listen(process.env.PORT || 8080, () => {
      console.log(`Server running on port ${process.env.PORT || 8080}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

io.on("connection", (socket) => {
  console.log("Socket.IO client connected----");

  socket.on("joinGroup", (groupCode) => {
    socket.join(`group_${groupCode}`);
    console.log(`Socket joined room: group_${groupCode}`);
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
    console.log("Client disconnected....");
  });
});

const findOrCreateDocument = async (groupCode) => {
  if (!groupCode) return null;

  let document = await Document.findById(groupCode);
  if (!document) {
    document = await Document.create({ _id: groupCode, data: "" });
  }

  return document;
};
