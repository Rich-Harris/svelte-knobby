import { SvelteComponent } from 'svelte/internal';

export type Node = {
	[key: string]: any;
	$folder?: true;
	$component: typeof SvelteComponent | typeof SvelteComponentDev;
	$label?: string;
	$id?: string;
	value: any;
};

export type Config = {
	id?: string;
	label?: string;
};

export type Context<T = any> = {
	run: (values: T) => T;
	set: (values: T) => void;
	observe: (fn: any) => any;
};
