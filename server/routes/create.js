const router = require("express").Router();
const Record = require("../models/Record");
const io = require("../index");
const multer = require("multer");
const { body, validationResult, check } = require("express-validator");
const path = require("path");

const imageStorage = multer.diskStorage({
	// Destination to store image
	destination: (req, file, cb) => {
		cb(null, "public/images/");
	},
	filename: (req, file, cb) => {
		console.log(file);
		cb(
			null,
			file.fieldname + "_" + Date.now() + path.extname(file.originalname)
		);
		// file.fieldname is name of the field (image)
		// path.extname get the uploaded file extension
	},
});

const imageUpload = multer({
	storage: imageStorage,
	limits: {
		fileSize: 3000000, // 1000000 Bytes = 1 MB
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(png|jpg)$/)) {
			// upload only png and jpg format
			return cb(new Error("Please upload a Image"));
		}
		cb(undefined, true);
	},
});

router.post(
	"/",
	imageUpload.array("image", 10),
	body("title").isString().trim(),
	body("description").optional().isString().trim(),
	async (req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				console.log(errors);
				return res
					.status(400)
					.json({ ok: false, errors: errors.array() });
			} else {
				const data = req.body;
				const files = req.files;
				const images = files.map((file) => file.filename);

				let result = await Record.create({
					...data,
					images: images,
				});

				io.io.local.emit("message", {
					message: "A new record has been created",
					action: "create",
					data: result,
					_id: result._id,
				});

				// return res.status(200).json({ ok: true, result });
				return res.status(200).json({ ok: true });
			}
		} catch (error) {
			console.log(error);
			res.json({ ok: false, message: error });
		}
	}
);

module.exports = router;
