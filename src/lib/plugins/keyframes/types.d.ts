export type Point = readonly [number, number];
export type Curve = readonly [number, number, number, number];

export type KeyframeTrack = {
	readonly $label?: string;
	readonly $color?: string;
	readonly points: readonly Point[];
	readonly curves: readonly Curve[];
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
