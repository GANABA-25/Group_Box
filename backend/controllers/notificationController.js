const Group = require("../model/group");
const LecturerGroup = require("../model/lecturerGroups");
const User = require("../model/user");

const { io } = require("../server");

exports.sendMessage = async (req, res) => {
  try {
    const { message, studentGroupCode, schoolEmail } = req.body;

    const studentGroup = await Group.findOne({ groupCode: studentGroupCode });

    const user = await User.findOne({ schoolEmail: schoolEmail });

    if (!studentGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const lecturerGroups = await LecturerGroup.find({
      createdBy: user._id,
    }).populate("studentGroups");

    let senderLecturerGroup = null;

    for (const lecturerGroup of lecturerGroups) {
      const containsStudentGroup = lecturerGroup.studentGroups.some(
        (studentGroupObj) => studentGroupObj.groupCode === studentGroupCode
      );

      if (containsStudentGroup) {
        senderLecturerGroup = lecturerGroup;
        break;
      }
    }

    if (!senderLecturerGroup) {
      return res.status(403).json({
        error:
          "You don't have a lecturer group that contains this student group",
      });
    }

    const notification = {
      message,
      date: new Date(),
      userId: user._id,
      senderName: user.fullName,
      senderGroupCode: senderLecturerGroup.groupCode,
      receiverGroupName: studentGroup.groupName,
    };

    io.to(`group_${studentGroupCode}`).emit("GroupNotification", {
      notification,
    });

    studentGroup.notifications.push(notification);
    await studentGroup.save();

    res.status(201).json({
      message: "Notification sent to group successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.replyNotification = async (req, res) => {
  try {
    const { message, senderGroup, receiverCode, schoolEmail } = req.body;

    const user = await User.findOne({ schoolEmail: schoolEmail });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    let groupName = "";

    const group = await Group.findOne({ groupCode: receiverCode });
    let lecturerGroup = null;
    let senderGroupCode;

    if (group) {
      groupName = group.groupName;
      senderGroupCode = group.groupCode;
    } else {
      lecturerGroup = await LecturerGroup.findOne({
        groupCode: receiverCode,
      });
      if (lecturerGroup) {
        groupName = lecturerGroup.groupName;
        senderGroupCode = lecturerGroup.groupCode;
      } else {
        return res.status(404).json({ error: "Group not found" });
      }
    }

    const notification = {
      message,
      date: new Date(),
      userId: user._id,
      senderName: user.fullName,
      senderGroupCode,
      receiverGroupName: senderGroup,
    };

    io.to(`group_${receiverCode}`).emit("replyNotification", {
      notification,
    });

    if (group) {
      group.notifications.push(notification);
      await group.save();
    } else if (lecturerGroup) {
      lecturerGroup.notifications.push(notification);
      await lecturerGroup.save();
    }

    res.status(201).json({
      message: "Notification sent to group successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getGroupNotifications = async (req, res) => {
  try {
    const { schoolEmail } = req.query;

    const user = await User.findOne({ schoolEmail: schoolEmail });

    if (!user) {
      return res.status(400).json({
        message: "user not found!",
      });
    }

    const userGroups = user.userGroups;

    let groups;

    if (user.role === "student") {
      groups = await Group.find({ _id: { $in: userGroups } }).select(
        "notifications groupName groupCode"
      );
    }

    if (user.role === "lecturer") {
      groups = await LecturerGroup.find({
        _id: { $in: userGroups },
      }).select("notifications groupName groupCode");
    }

    let allGroupNotifications = [];

    groups.forEach((group) => {
      if (group.notifications && group.notifications.length > 0) {
        const groupNotificationsWithContext = group.notifications.map(
          (notification) => ({
            ...notification.toObject(),
          })
        );

        allGroupNotifications.push(...groupNotificationsWithContext);
      }
    });

    allGroupNotifications.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({
      message: "Group notifications fetched successfully",
      groupNotifications: allGroupNotifications,
      totalNotifications: allGroupNotifications.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error! Please try again later.",
    });
  }
};
