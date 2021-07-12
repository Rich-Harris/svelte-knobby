export type Point = [number, number];
export type Curve = [number, number, number, number];

export type KeyframeTrack = {
	label: string;
	points: Point[];
	curves: Curve[];
};
