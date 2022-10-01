import React from "react";
import { Header } from "semantic-ui-react";

export default function TopHeader({ text }) {
	return (
		<Header as={"h1"} block textAlign="center">
			{text}
		</Header>
	);
}
