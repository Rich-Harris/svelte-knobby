import { SvelteComponent } from 'svelte/internal';

export type State = {
	component: SvelteComponent;
	value: any;
}

export type Knobber<Value, Options = any> = (
	label: string,
	initial: Value,
	options?: Options
) => import('svelte/store').Writable<Value>;
