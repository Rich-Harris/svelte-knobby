import { SvelteComponent } from 'svelte/internal';

export type Node = {
	__folder?: true;
	$component: typeof SvelteComponent | typeof SvelteComponentDev;
	$label?: string;
	$id?: string;
	value: any;
};
