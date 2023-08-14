require("../FirebaseConfig");
const firebase = require("firebase/storage");
const uuid = require("uuid");
const config = require("../DbConfig");
const sql = require("mssql");
// import { ref, uploadBytes, getDownloadURL, listAll, list } from "firebase/storage";
// import { storage } from "./firebase";
// import { v4 } from "uuid";

const storage = firebase.getStorage();

class FileController {
	async index(req, res) {}
	// // [GET] /get-image
	// async GetImage(req, res) {
	// 	const imagesListRef = firebase.ref(storage, "Image/");
	// 	var listFiles = await firebase.listAll(imagesListRef);

	// 	var arrUrl = [];

	// 	for (let index = 0; index < listFiles.items.length; index++) {
	// 		const item = listFiles.items[index];
	// 		var GotUrl = await firebase.getDownloadURL(item);
	// 		arrUrl.push(GotUrl);
	// 	}

	// 	if (arrUrl.length === 0) return res.status(400);
	// 	else return res.json(arrUrl);
	// }
	// [POST] /upload-image
	async UploadImage(req, res) {
		try {
			const storageRef = firebase.ref(
				storage,
				`Image/${
					req.files["imageUpload"][0].originalname.slice(
						0,
						req.files["imageUpload"][0].originalname.length - 4
					) + uuid.v4()
				}`
			);
			const metadata = {
				contentType: req.files["imageUpload"][0].mimetype,
				name: req.files["imageUpload"][0].originalname,
			};
			const snapshot = await firebase.uploadBytesResumable(
				storageRef,
				req.files["imageUpload"][0].buffer,
				metadata
			);
			const downloadURL = await firebase.getDownloadURL(snapshot.ref);
			await sql.connect(config, function (err) {
				if (err) console.log(err);

				// create Request object
				var request = new sql.Request();
				request.input("masp", sql.VarChar(10), req.body.masp);
				request.input("stt", sql.Int, req.body.stt);
				request.input("hinhanh", sql.VarChar(5000), downloadURL);
				// query to the database and get the records
				request.execute("dbo.SP_EDIT_DETAIL_PRODUCT_HINHANHSP", function (err, response) {
					if (err) console.log(err);
					if (response.returnValue === 1)
						return res.send({
							message: "File uploaded to firebase storage",
							name: req.files["imageUpload"][0].originalname,
							type: req.files["imageUpload"][0].mimetype,
							downloadURL: downloadURL,
						});
					else return res.status(400).send(error.message);
				});
			});
		} catch (error) {
			return res.status(400).send(error.message);
		}
	}

	// [PUT] /edit-image
	async EditImage(req, res) {
		try {
			const url = req.body.fileNameDelete;
			var result = url.slice(url.indexOf("%2F") + 3, url.indexOf("alt=media") - 1);

			var storageRef = firebase.ref(storage, `Image/${result}`);
			// const storageRef = firebase.ref(storage, `Image/${req.body.url}`);
			await firebase
				.deleteObject(storageRef)
				.then(async () => {
					await sql.connect(config, function (err) {
						if (err) {
							console.log(err);
							return res.status(400).send("error");
						}
					});
				})
				.catch((error) => {
					return res.status(400).send("error");
				});

			storageRef = firebase.ref(
				storage,
				`Image/${
					req.files["imageUpload"][0].originalname.slice(
						0,
						req.files["imageUpload"][0].originalname.length - 4
					) + uuid.v4()
				}`
			);
			const metadata = {
				contentType: req.files["imageUpload"][0].mimetype,
				name: req.files["imageUpload"][0].originalname,
			};
			const snapshot = await firebase.uploadBytesResumable(
				storageRef,
				req.files["imageUpload"][0].buffer,
				metadata
			);
			const downloadURL = await firebase.getDownloadURL(snapshot.ref);
			await sql.connect(config, function (err) {
				if (err) console.log(err);

				// create Request object
				var request = new sql.Request();
				request.input("masp", sql.VarChar(10), req.body.masp);
				request.input("stt", sql.Int, req.body.stt);
				request.input("hinhanh", sql.VarChar(5000), downloadURL);
				// query to the database and get the records
				request.execute("dbo.SP_EDIT_DETAIL_PRODUCT_HINHANHSP", function (err, response) {
					if (err) console.log(err);
					if (response.returnValue === 1)
						return res.send({
							message: "File uploaded to firebase storage",
							name: req.files["imageUpload"][0].originalname,
							type: req.files["imageUpload"][0].mimetype,
							downloadURL: downloadURL,
						});
					else return res.status(400).send(error.message);
				});
			});
		} catch (error) {
			return res.status(400).send(error.message);
		}
	}

	// [DELETE] /delete-image
	async DeleteImage(req, res) {
		try {
			const url = req.body.url;
			var result = url.slice(url.indexOf("%2F") + 3, url.indexOf("alt=media") - 1);

			const storageRef = firebase.ref(storage, `Image/${result}`);
			// const storageRef = firebase.ref(storage, `Image/${req.body.url}`);
			await firebase
				.deleteObject(storageRef)
				.then(async () => {
					await sql.connect(config, function (err) {
						if (err) console.log(err);

						// create Request object
						var request = new sql.Request();
						request.input("masp", sql.VarChar(10), req.body.data.masp);
						request.input("stt", sql.NVarChar(100), req.body.data.stt);
						// query to the database and get the records
						request.execute("dbo.SP_DELETE_IMAGE", function (err, response) {
							if (err) console.log(err);
							if (response.returnValue === 1)
								return res.send({
									message: "File deleted from firebase storage",
								});
							else return res.status(400).send(error.message);
						});
					});
				})
				.catch((error) => {
					return res.status(400).send(error.message);
				});
		} catch (error) {
			return res.status(400).send(error.message);
		}
	}
}

module.exports = new FileController();
