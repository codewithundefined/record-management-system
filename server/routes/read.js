const router = require("express").Router();
const { query, validationResult } = require("express-validator");
const Record = require("../models/Record");

router.get(
	"/",

	query("pageNo").optional().isInt().trim(),
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res
					.status(400)
					.json({ ok: false, errors: errors.array() });
			} else {
				const data = req.query;
				const pageNo = data.pageNo || 1;
				const pageSize = 10;
				const skip = (pageNo - 1) * pageSize;

				let result = await Record.find()
					.skip(skip)
					.limit(pageSize)
					.sort({ date: -1 });

				return res.status(200).json({ ok: true, result });
			}
		} catch (error) {
			console.log(error);
			res.json({ ok: false, message: error });
		}
	}
);

module.exports = router;
