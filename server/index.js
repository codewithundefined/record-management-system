const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const socketIo = require("socket.io");
const http = require("http");

// Importing Routes
const createRecord = require("./routes/create");
const updateRecord = require("./routes/update");
const deleteRecord = require("./routes/delete");
const readRecord = require("./routes/read");
// dotenv to use environment variables
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

// Connecting to MongoDB atlas cluster
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB cluster"))
	.catch((err) =>
		console.log("An error occured while connecting to MongoDB cluster", err)
	);

// Creating socket.io instance
const io = new socketIo.Server(server, {
	cors: {
		// origin: "http://localhost:3000",
		origin: "*",
	},
});

// Listening for new connections
io.on("connection", (socket) => {
	console.log("Client connected", socket.id);
});

app.use(cors());
app.use(express.json());
app.use(express.static(process.cwd() + "/public"));

// app.get("/", (req, res) => {
// 	res.send("API is running");
// });

// Using Routes
app.use("/create", createRecord);
app.use("/update", updateRecord);
app.use("/delete", deleteRecord);
app.use("/read", readRecord);
// Starting the express server
server.listen(PORT, (err) => {
	if (err) console.log(err);
	console.log("Server running on port : ", PORT);
});

exports.io = io;
// module.exports = { io };
