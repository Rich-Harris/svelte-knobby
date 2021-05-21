export type Knobber<Value, Options = any> = (
	label: string,
	initial: Value,
	options?: Options
) => import('svelte/store').Writable<Value>;
