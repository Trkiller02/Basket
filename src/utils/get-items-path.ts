interface Params {
	entidad?: string | null;
	prefix?: string;
	etapa?: string | null;
}

export const getItems = (pathname: string, params?: Params) => {
	const pathList = pathname.split("/");

	if (pathList[1] === "") pathList.pop();

	const listItems = pathList.map((item, i) => {
		let urlString = "";

		for (let j = 0; j <= i; ++j) {
			urlString = urlString.concat(
				pathList[j] === "" ? "/" : pathList[j],
				j !== 0 && j !== pathList.length - 1 ? "/" : "",
			);
		}

		return {
			href: urlString,
			label:
				item === "" ? "Inicio" : item.charAt(0).toUpperCase() + item.slice(1),
		};
	});

	if (params?.entidad) {
		listItems.push({
			href: listItems[listItems.length - 1].href.concat(
				params.prefix ?? "?ent=",
				params.entidad,
			),
			label: params.entidad.charAt(0).toUpperCase() + params.entidad.slice(1),
		});
	}

	return listItems;
};
