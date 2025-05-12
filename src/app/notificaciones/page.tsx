import { fetchData } from "@/utils/fetchHandler";
import type { notifications } from "@drizzle/schema";
import { Chip } from "@heroui/chip";

export default async function Page() {
	const promiseNotification = await fetchData<{
		result: (typeof notifications.$inferSelect)[];
	}>("/api/notifications");

	const notification = promiseNotification?.result;

	return (
		<section className="flex flex-col items-center justify-center">
			<div className="flex w-1/3">
				<h1 className="text-4xl font-bold">Notificaciones</h1>
				{notification?.map((item) => (
					<article key={item.id} className="flex flex-row">
						<div className="flex flex-col gap-2">
							<p className="text-lg">Usuario: {item.user_id}</p>
							<p className="text-sm font-bold">{item.description}</p>
						</div>
						<div className="flex flex-col gap-2">
							<Chip className="text-lg font-bold" size="lg" variant="solid">
								{item.type}
							</Chip>
							<p>Fecha: {item.created_at?.toLocaleDateString()}</p>
						</div>
					</article>
				))}
			</div>
		</section>
	);
}
