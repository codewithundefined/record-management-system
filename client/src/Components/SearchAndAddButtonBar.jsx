import axios from "axios";
import React from "react";
import { useState } from "react";
import {
	Container,
	Search,
	Button,
	Modal,
	Form,
	Message,
	Icon,
} from "semantic-ui-react";

export default function SearchAndAddButtonBar() {
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<Container className="search-row">
			<Button
				icon="plus"
				onClick={() => setModalOpen((prev) => !prev)}
				className="new-record-btn"
				positive
				size="tiny"
			>
				<Icon fitted size="large" name="plus" />
			</Button>

			<AddRecordModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
		</Container>
	);
}

function AddRecordModal({ modalOpen, setModalOpen }) {
	const [hidden, setHidden] = useState(true);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [files, setFiles] = useState([]);

	async function handleAddRecord() {
		console.log(title, description, files);

		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		for (let i = 0; i < files.length; i++) {
			formData.append("image", files[i]);
		}

		const result = await axios.post(
			`${process.env.REACT_APP_BACKEND_URI}/create`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		setModalOpen(false);
		setTitle("");
		setDescription("");
		setFiles([]);
	}

	return (
		<Modal
			onClose={() => setModalOpen(false)}
			onOpen={() => setModalOpen(true)}
			open={modalOpen}
		>
			<Modal.Header>Add New Record</Modal.Header>
			<Modal.Content scrolling>
				<Message hidden={hidden} color="red">
					Please fill out all the required fields
				</Message>

				<Form error={true} success={true} warning={true}>
					<Form.Field>
						<label>Title</label>
						<Form.Input
							onChange={(ev) => {
								setTitle(ev.target.value);
							}}
							type={"text"}
							required={true}
						></Form.Input>
					</Form.Field>

					<Form.Field>
						<label>Description</label>
						<Form.TextArea
							onChange={(ev) => setDescription(ev.target.value)}
						></Form.TextArea>
					</Form.Field>

					<Form.Field>
						<label>Attachments</label>
						<Form.Input
							onChange={(ev) => {
								ev.target.files.length > 0 &&
									setFiles((prev) => [
										...prev,
										...ev.target.files,
									]);
							}}
							type="file"
						></Form.Input>
						<Form.Input
							onChange={(ev) => {
								ev.target.files.length > 0 &&
									setFiles((prev) => [
										...prev,
										...ev.target.files,
									]);
							}}
							type="file"
						></Form.Input>
					</Form.Field>
				</Form>
			</Modal.Content>

			<Modal.Actions>
				<Button onClick={() => setModalOpen(false)}>Cancel</Button>
				<Button onClick={handleAddRecord} type="submit" positive>
					Add
				</Button>
			</Modal.Actions>
		</Modal>
	);
}
