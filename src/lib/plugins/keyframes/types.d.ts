export type Point = [number, number];
export type Curve = [number, number, number, number];

export type KeyframeTrack = {
	$label?: string;
	$color?: string;
	points: Point[];
	curves: Curve[];
};

export type Keyframes = Record<string, KeyframeTrack>;

export type Scales = {
	x: (n: number) => number;
	y: (n: number) => number;
};

export type Selection = {
	key: string;
	index: number;
};

export type Handle = {
	a: Point;
	b: Point;
	index: number;
	offset: number;
};

export type Snap = {
	x: number;
	y: number;
};
