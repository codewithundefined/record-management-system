import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "semantic-ui-css/semantic.min.css";
import SocketProvider from "./Components/SocketProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<SocketProvider>
			<App />
		</SocketProvider>
	</React.StrictMode>
);
