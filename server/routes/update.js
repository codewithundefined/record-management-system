const router = require("express").Router();
const Record = require("../models/Record");
const { body, validationResult } = require("express-validator");
const io = require("../index");

router.post(
	"/",
	body("title").isString().trim(),
	body("description").isString().trim(),
	body("objectID").isString().trim(),
	async (req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res
					.status(400)
					.json({ ok: false, errors: errors.array() });
			} else {
				const data = req.body;

				let result = await Record.updateOne({
					...data,
					_id: data.objectID,
				});

				io.io.emit("message", {
					message: "A record has been updated",
					action: "update",
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
