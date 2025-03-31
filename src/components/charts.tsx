import React from "react";
import { pie, arc, type PieArcDatum } from "d3";
import { Tooltip } from "@heroui/tooltip";

type DataItem = {
	name: string;
	value: number;
	colorFrom: string;
};

export function Chart({ data }: { data: DataItem[] }) {
	// Chart dimensions
	const radius = Math.PI * 25;

	// Pie layout and arc generator
	const pieLayout = pie<DataItem>()
		.sort(null)
		.value((d) => d.value)
		.padAngle(0.1); // Creates a gap between slices

	const arcGenerator = arc<PieArcDatum<DataItem>>()
		.innerRadius(radius / 3.2)
		.outerRadius(radius)
		.cornerRadius(8);

	const labelRadius = radius * 0.8;
	const arcLabel = arc<PieArcDatum<DataItem>>()
		.innerRadius(labelRadius)
		.outerRadius(labelRadius);

	const arcs = pieLayout(data);
	// Calculate the angle for each slice
	const computeAngle = (d: PieArcDatum<DataItem>) => {
		return ((d.endAngle - d.startAngle) * 180) / Math.PI;
	};

	// Minimum angle to display text
	const MIN_ANGLE = 20;

	return (
		<div className="p-4 aspect-square h-32">
			<div className="relative max-w-[6rem] mx-auto">
				<svg
					aria-label="Pie chart"
					viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
					className="overflow-visible"
				>
					<title>Pie chart</title>
					{/* Slices */}
					{arcs.map((d, i) => {
						const midAngle = (d.startAngle + d.endAngle) / 2;

						return (
							<Tooltip
								key={i.toString()}
								content={
									<>
										<div>{d.data.name}</div>
										<div className="text-gray-500 text-sm">
											{d.data.value.toLocaleString(
												Intl.DateTimeFormat().resolvedOptions().locale,
											)}
										</div>
									</>
								}
							>
								<g key={i.toString()}>
									<path
										fill={`url(#pieColors-${i})`}
										d={arcGenerator(d) ?? ""}
									/>
									<linearGradient
										id={`pieColors-${i}`}
										x1="0"
										y1="0"
										x2="1"
										y2="0"
										gradientTransform={`rotate(${(midAngle * 180) / Math.PI - 90}, 0.5, 0.5)`}
									>
										<stop
											offset="0%"
											stopColor={"currentColor"}
											className={d.data.colorFrom}
										/>
										<stop
											offset="100%"
											stopColor={"currentColor"}
											className={d.data.colorFrom}
										/>
									</linearGradient>
								</g>
							</Tooltip>
						);
					})}
				</svg>

				{/* Labels as absolutely positioned divs */}
				<div className="absolute inset-0 pointer-events-none">
					{arcs.map((d: PieArcDatum<DataItem>, i) => {
						const angle = computeAngle(d);
						if (angle <= MIN_ANGLE) return null;

						// Get pie center position
						const [x, y] = arcLabel.centroid(d);
						const CENTER_PCT = 50;

						// Convert to percentage positions. Adjust magic numbers to move the labels around
						const nameLeft = `${CENTER_PCT + (x / radius) * 40}%`;
						const nameTop = `${CENTER_PCT + (y / radius) * 40}%`;

						const valueLeft = `${CENTER_PCT + (x / radius) * 72}%`;
						const valueTop = `${CENTER_PCT + (y / radius) * 70}%`;

						return (
							<div
								key={i.toString()}
								className="absolute max-w-[80px] text-default-800 truncate text-center text-xs font-bold"
								style={{
									left: nameLeft,
									top: nameTop,
									transform: "translate(-50%, -50%)",
									marginLeft: x > 0 ? "2px" : "-2px",
									marginTop: y > 0 ? "2px" : "-2px",
								}}
							>
								{d.data.value}%
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
