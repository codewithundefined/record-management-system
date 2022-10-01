const router = require("express").Router();
const Record = require("../models/Record");
const io = require("../index");
const { body, validationResult } = require("express-validator");

router.post(
	"/",
	body("title").isString().trim(),
	body("description").optional().isString().trim(),
	async (req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res
					.status(400)
					.json({ ok: false, errors: errors.array() });
			} else {
				const data = req.body;

				let result = await Record.create({
					...data,
					images: ["a.png", "b.png"],
				});

				// console.log(io);
				io.io.local.emit("message", {
					message: "A new record has been created",
					action: "create",
					data: result,
					_id: result._id,
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
