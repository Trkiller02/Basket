import React from "react";

export default function EmailTemplate({
	username,
	url,
}: { username: string; url: string }) {
	return (
		<div>
			¡Hola {username}, si estás intentando recuperar tu contaseña visita este
			link: {url}
		</div>
	);
}
