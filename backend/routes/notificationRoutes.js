const express = require("express");

const router = express.Router();

const notificationController = require("../controllers/notificationController");

router.post("/notification", notificationController.sendMessage);

router.post("/replyNotification", notificationController.replyNotification);

router.get("/groupNotification", notificationController.getGroupNotifications);

module.exports = router;
