const Document = require("../model/document");
const User = require("../model/user");
const Group = require("../model/group");
const cloudinary = require("../config/cloudinary");

exports.getGroupFiles = async (req, res) => {
  try {
    const { groupCode } = req.query;

    if (!groupCode) {
      return res.status(400).json({
        message: "Group code is required to fetch files.",
      });
    }

    const group = await Group.findOne({ groupCode });

    if (!group) {
      return res.status(404).json({
        message: `No group found with code "${groupCode}".`,
      });
    }

    const groupDocuments = await Document.findOne({ _id: groupCode });

    if (!groupDocuments) {
      return res.status(404).json({
        message: `No documents found for group with code "${groupCode}".`,
      });
    }

    res.status(200).json({
      message: "Files fetched successfully.",
      documents: groupDocuments.files || [],
    });
  } catch (error) {
    console.error("Error fetching group files:", error);
    res.status(500).json({
      message: "Server error while fetching files. Please try again later.",
      error: error.message,
    });
  }
};

exports.uploadSelectFiles = async (req, res) => {
  try {
    const file = req.file;
    const { schoolEmail, groupDocumentId } = req.body;

    if (!file) {
      return res.status(400).json({ message: "No file selected" });
    }

    const user = await User.findOne({ schoolEmail: schoolEmail });

    if (!user) {
      return res.status(400).json({
        message: "user does not exits",
      });
    }

    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "GroupBox/files", resource_type: "auto" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        uploadStream.end(file.buffer);
      });
    };

    const result = await uploadToCloudinary();

    const groupDocument = await Document.findById(groupDocumentId);

    if (!groupDocument) {
      return res.status(400).json({
        message: "Group document not found try again later",
      });
    }

    groupDocument.files.push({
      url: result.secure_url,
      publicId: result.public_id,
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
      uploadedBy: user._id,
    });

    await groupDocument.save();

    return res.status(200).json({
      message: "Files uploaded successfully",
      document: groupDocument.files,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred during file upload, try again later.",
    });
  }
};

exports.recordDocumentsContribution = async (req, res) => {
  try {
    const { documentId, schoolEmail, addedChars } = req.body;

    const user = await User.findOne({ schoolEmail: schoolEmail });
    if (!user) {
      return res.status(404).json({
        message: "User not found!.",
      });
    }

    const groupDocument = await Document.findOne({ _id: documentId });
    if (!groupDocument) {
      return res.status(404).json({
        message: "Group document not found!",
      });
    }

    if (!groupDocument.contributions) {
      groupDocument.contributions = [];
    }

    let existingContribution = groupDocument.contributions.find(
      (c) => c.user && c.user.toString() === user._id.toString()
    );

    if (existingContribution) {
      existingContribution.chars += addedChars;
      existingContribution.lastUpdated = new Date();
    } else {
      groupDocument.contributions.push({
        user: user._id,
        userName: user.fullName,
        userEmail: user.schoolEmail,
        chars: addedChars,
        lastUpdated: new Date(),
      });
    }

    const totalChars = groupDocument.contributions.reduce(
      (sum, c) => sum + c.chars,
      0
    );
    groupDocument.totalChars = totalChars;

    groupDocument.contributions.forEach((c) => {
      c.percentage =
        totalChars > 0 ? ((c.chars / totalChars) * 100).toFixed(2) : 0;
    });

    await groupDocument.save();

    // res.status(200).json({
    //   message: "Contribution recorded successfully.",
    //   contributions: groupDocument.contributions,
    // });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "An error occurred while recording document contributions, try again later.",
    });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { schoolEmail, fileId, groupDocumentId } = req.body;

    const user = await User.findOne({ schoolEmail: schoolEmail });

    if (!user) {
      return res.status(400).json({
        message: "user not found!",
      });
    }

    const groupDocument = await Document.findById(groupDocumentId);

    if (!groupDocument) {
      return res.status(400).json({
        message: "Group Documents not found! try again later",
      });
    }

    const fileToDelete = groupDocument.files.id(fileId);
    if (!fileToDelete) {
      return res.status(404).json({
        message: "File not found in this document",
      });
    }

    if (fileToDelete.publicId) {
      let resourceType = "raw";
      if (fileToDelete.type.startsWith("image/")) {
        resourceType = "image";
      } else if (fileToDelete.type.startsWith("video/")) {
        resourceType = "video";
      }

      await cloudinary.uploader.destroy(fileToDelete.publicId, {
        resource_type: resourceType,
      });
    }

    fileToDelete.deleteOne();
    await groupDocument.save();

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
      document: groupDocument.files,
    });
  } catch (error) {
    console.error("Delete file error:", error);
    return res.status(500).json({
      message:
        "An error occurred while trying to remove file!. Try again later",
    });
  }
};
