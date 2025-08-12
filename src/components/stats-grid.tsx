import { IconArrowUpRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
	title: string;
	value: string;
	icon: React.ReactNode;
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
	return (
		<div className="relative p-4 lg:p-5 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden">
			<div className="relative flex items-center gap-4">
				<IconArrowUpRight
					className="absolute right-0 top-0 opacity-0 group-has-[a:hover]:opacity-100 transition-opacity text-emerald-500"
					size={20}
					aria-hidden="true"
				/>
				{/* Icon */}
				<div className="max-[480px]:hidden size-12 shrink-0 rounded-full bg-slate-300/30 border-4 border-primary/50 flex items-center justify-center text-primary">
					{icon}
				</div>
				{/* Content */}
				<div>
					<span className="font-medium tracking-widest text-xs uppercase text-muted-foreground/70 before:absolute before:inset-0">
						{title}
					</span>
					<div className="text-2xl font-semibold mb-2">{value}</div>
				</div>
			</div>
		</div>
	);
}

interface StatsGridProps {
	stats: StatsCardProps[];
}

export function StatsGrid({ stats }: StatsGridProps) {
	return (
		<div className="grid grid-cols-2 min-[1200px]:grid-cols-4 border border-border rounded-xl bg-gradient-to-br from-sidebar/60 to-sidebar">
			{stats.map((stat) => (
				<StatsCard key={stat.title} {...stat} />
			))}
		</div>
	);
}
