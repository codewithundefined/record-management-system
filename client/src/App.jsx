import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import RecordList from "./Components/RecordList";

function App() {
	const [records, setRecords] = useState(null);

	async function getRecords() {
		const res = await axios.get(
			`${process.env.REACT_APP_BACKEND_URI}/read`
		);
		const data = res.data;
		if (data.ok) {
			setRecords(data.result.length > 0 ? [...data.result] : null);
		}
	}

	useEffect(() => {
		getRecords();
	}, []);

	return (
		<div className="App">
			<Button>Click here</Button>
			<RecordList records={records} setRecords={setRecords} />
		</div>
	);
}

export default App;
