import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Divider, Modal, Image, Input, Icon } from "semantic-ui-react";
import { SocketContext } from "./SocketProvider";

export default function RecordList({ records, setRecords }) {
	const [modalOpen, setModalOpen] = useState(false);
	const socket = useContext(SocketContext);
	const [recordIndex, setRecordIndex] = useState(null);

	useEffect(() => {
		socket.on("message", (data) => {
			console.log(data);

			switch (data.action) {
				case "create":
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

					break;
				case "delete":
					setRecords((prev) => {
						if (prev) {
							const res = prev.filter((r) => r._id !== data._id);

							return res;
						}
					});
					break;
				case "update":
					setRecords((prev) => {
						if (prev) {
							const res = prev.map((r) => {
								if (r._id === data._id) {
									return data.data;
								}
								return r;
							});

							return res;
						}
					});
					break;
				default:
					break;
			}
		});
	}, []);

	return (
		<div>
			{records &&
				records.map((record, index) => (
					<div
						key={index}
						onClick={() => {
							setModalOpen(true);
							setRecordIndex(index);
						}}
						style={{
							cursor: "pointer",
						}}
					>
						<div>{index}</div>
						<div>{record.title}</div>
						<div>{record.description}</div>

						<Divider />
					</div>
				))}

			<ViewAndUpdateModal
				modalOpen={modalOpen}
				setModalOpen={setModalOpen}
				record={
					records && records[recordIndex]
						? records[recordIndex]
						: null
				}
			/>
		</div>
	);
}

function ViewAndUpdateModal({ modalOpen, setModalOpen, record }) {
	const [title, setTitle] = useState(record?.title);
	const [description, setDescription] = useState(record?.description);
	const [files, setFiles] = useState([]);
	const [priorImages, setPriorImages] = useState(record?.images || []);
	const [editMode, setEditMode] = useState(false);

	useEffect(() => {
		if (!modalOpen) {
			setEditMode(false);
		}
	}, [modalOpen]);

	useEffect(() => {
		if (record) {
			setTitle(record.title);
			setDescription(record.description);
			setPriorImages(record.images);
		}
	}, [record]);

	async function handleUpdateRecord() {
		if (editMode) {
			console.log(title, description, files);

			const formData = new FormData();
			formData.append("title", title);
			formData.append("description", description);
			formData.append("priorImages", JSON.stringify(priorImages));
			for (let i = 0; i < files.length; i++) {
				formData.append("image", files[i]);
			}

			console.log(priorImages);

			const result = await axios.post(
				`${process.env.REACT_APP_BACKEND_URI}/update/${record._id}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			// console.log(result.data);
			setModalOpen(false);
			setEditMode(false);
			setFiles([]);
			setPriorImages([]);
		} else {
			setEditMode(true);
		}
	}

	function isOpen() {
		if (modalOpen && record) {
			return true;
		}

		return false;
	}

	return (
		<Modal
			onClose={() => setModalOpen(false)}
			onOpen={() => setModalOpen(true)}
			open={isOpen()}
		>
			<Modal.Header>
				{editMode ? (
					<Input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				) : (
					record?.title
				)}
			</Modal.Header>
			<Modal.Content>
				<div>
					{editMode ? (
						<Input
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					) : (
						<div
							style={{
								fontSize: "1.5rem",
							}}
						>
							{record?.description}
						</div>
					)}
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						gap: "10px",
					}}
				>
					{
						// record?.images &&
						// record?.images.map((file, index) => (
						priorImages &&
							priorImages.map((file, index) => (
								<div
									style={{
										border: "1px solid black",
									}}
									key={index}
								>
									{editMode && (
										<div
											onClick={() => {
												const newFiles =
													priorImages.filter(
														(f, i) => i !== index
													);
												setPriorImages(newFiles);
											}}
										>
											<Icon name="close" />
										</div>
									)}

									<a
										href={`${process.env.REACT_APP_BACKEND_URI}/images/${file}`}
										target="_blank"
										rel="noreferrer"
									>
										<div
											style={{
												width: "100px ",
												minWidth: "100px ",
												height: "100px ",
												minHeight: "100px ",
												// display: "block",
											}}
										>
											<img
												src={`${process.env.REACT_APP_BACKEND_URI}/images/${file}`}
												alt="Attachment"
											/>
										</div>
									</a>
								</div>
							))
					}
				</div>

				{editMode && (
					<div>
						<Input
							onChange={(ev) => {
								ev.target.files.length > 0 &&
									setFiles((prev) => [
										...prev,
										...ev.target.files,
									]);
							}}
							type="file"
						></Input>
						<Input
							onChange={(ev) => {
								ev.target.files.length > 0 &&
									setFiles((prev) => [
										...prev,
										...ev.target.files,
									]);
							}}
							type="file"
						></Input>
					</div>
				)}
			</Modal.Content>
			<Modal.Actions>
				{editMode && (
					<Button
						onClick={() => {
							// setModalOpen(false);
							setTitle(record?.title);
							setDescription(record?.description);
							setEditMode(false);
							setFiles([]);
							setPriorImages(record?.images);
						}}
					>
						Cancel
					</Button>
				)}

				<Button onClick={handleUpdateRecord} positive>
					{editMode ? "Save" : "Edit"}
				</Button>
			</Modal.Actions>
		</Modal>
	);
}
