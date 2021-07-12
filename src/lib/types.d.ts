import { SvelteComponent } from 'svelte/internal';

export type Node = {
	$folder?: true;
	$component: typeof SvelteComponent | typeof SvelteComponentDev;
	$label?: string;
	$id?: string;
	value: any;
};

export type Context<T = any> = {
	run: (values: T) => T;
	set: (values: T) => void;
	observe: (fn: any) => any;
};
