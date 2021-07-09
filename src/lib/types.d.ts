import { SvelteComponent } from 'svelte/internal';

export type Node = {
	$folder?: true;
	$component: typeof SvelteComponent | typeof SvelteComponentDev;
	$label?: string;
	$id?: string;
	value: any;
};
