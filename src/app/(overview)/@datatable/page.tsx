import { auth } from "@/auth";
import ContactsTable from "@/components/new_table";

const Datatable = async (
	/* {
	searchParams,
}: {
	searchParams: Promise<Record<string, string | undefined>>;
} */
) => {
	const session = await auth();

	/* const data = await getDataTable({
		searchParams: await searchParams,
		...(session.user?.role === "representante" && {
			id: session?.user?.id,
		}),
	}); */

	return <ContactsTable session={session} />;
};

export default Datatable;
