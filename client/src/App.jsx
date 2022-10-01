import axios from "axios";
import { useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import RecordList from "./Components/RecordList";
import TopHeader from "./Components/TopHeader";
import SearchAndAddButtonBar from "./Components/SearchAndAddButtonBar";
import "./Styles/App.css";

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
		// <div className="App">
		<Container className="">
			<TopHeader text="Record Management System" />
			<SearchAndAddButtonBar />
			<RecordList records={records} setRecords={setRecords} />
		</Container>
		// </div>
	);
}

export default App;
