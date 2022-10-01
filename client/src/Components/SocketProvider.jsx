import React from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const SocketContext = React.createContext();

export default function SocketProvider({ children }) {
	const socket = React.useRef(io(process.env.REACT_APP_BACKEND_URI)).current;

	useEffect(() => {
		socket.on("connect", () => {
			console.log("connected");
		});

		socket.on("disconnect", () => {
			console.log("disconnected");
		});

		socket.on("connect_error", (err) => {
			console.log(err.message);
		});
	}, []);

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
}
