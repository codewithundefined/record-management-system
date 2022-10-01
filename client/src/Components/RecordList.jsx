import React, { useContext } from "react";
import { useEffect } from "react";
import { SocketContext } from "./SocketProvider";

export default function RecordList({ records, setRecords }) {
	const socket = useContext(SocketContext);

	useEffect(() => {
		socket.on("message", (data) => {
			console.log(data);
			setRecords((prev) => {
				// prev?.pop();
				if (prev) {
					const d = [data.data, ...prev];
					if (d.length > 10) {
						d.pop();
					}
					return d;
				} else {
					return [data.data];
				}
			});
		});
	}, []);

	// useEffect(() => {
	// 	console.log("records", records);
	// }, [records]);

	return (
		<div>
			{records &&
				records.map((record, index) => (
					<div key={index}>
						<div>{index}</div>
						<div>{record.title}</div>
						<div>{record.description}</div>
					</div>
				))}
		</div>
	);
}
