const router = require("express").Router();
const Record = require("../models/Record");
const io = require("../index");
const { body, validationResult } = require("express-validator");

router.post("/", body("objectID").isString().trim(), async (req, res) => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ ok: false, errors: errors.array() });
		} else {
			const data = req.body;

			let result = await Record.deleteOne({
				_id: data.objectID,
			});

			io.io.local.emit("message", {
				message: "A records has been deleted",
				action: "delete",
				data: result,
				_id: data.objectID,
			});
			return res.status(200).json({ ok: true, result });
		}
	} catch (error) {
		console.log(error);
		res.json({ ok: false, message: error });
	}
});

module.exports = router;
