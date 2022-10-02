const router = require("express").Router();
const Record = require("../models/Record");
const { body, validationResult, param } = require("express-validator");
const io = require("../index");
const multer = require("multer");
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
	"/:objectID",
	imageUpload.array("image", 10),
	body("title").isString().trim(),
	body("description").isString().trim(),
	// param("objectID").isString().trim(),
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

				data.objectID = req.params.objectID;

				const files = req.files;
				const images = files.map((file) => file.filename);
				console.log(data, images);
				if (data.priorImages) {
					data.priorImages = JSON.parse(data.priorImages);
					console.log([...images, ...data.priorImages]);
				}
				let result = await Record.updateOne(
					{ _id: data.objectID },
					{
						// ...data,
						title: data.title,
						description: data.description,
						images: data.priorImages
							? [...images, ...data.priorImages]
							: images,
					}
				);

				let record = await Record.findOne({ _id: data.objectID });

				io.io.emit("message", {
					message: "A record has been updated",
					action: "update",
					data: {
						// ...data,
						title: data.title,
						description: data.description,
						_id: data.objectID,
						images: data.priorImages
							? [...images, ...data.priorImages]
							: images,
						date: record.date,
					},
					_id: data.objectID,
				});

				return res.status(200).json({ ok: true, result });
			}
		} catch (error) {
			console.log(error);
			res.json({ ok: false, message: error });
		}
	}
);

module.exports = router;
