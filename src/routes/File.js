const express = require("express");
const router = express.Router();

const FileController = require("../controllers/FileController");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// router.get('/get-image', FileController.GetImage);

router.post(
	"/upload-image",
	upload.fields([
		{ name: "imageUpload", maxCount: 1 },
	]),
	FileController.UploadImage
);
// router.post("/upload-image", upload.single("imageUpload"), FileController.UploadImage);
router.put("/edit-image", FileController.EditImage);
router.delete("/delete-image", FileController.DeleteImage);

module.exports = router;
