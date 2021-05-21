# svelte-knobby

Add knobs to your Svelte apps. [Demo](https://svelte.dev/repl/85c0f69007524dd9a45a8bf72d2401ba)

```svelte
<script>
  import * as knobby from 'svelte-knobby';

  const message = knobby.text('message', 'Hello world!');
</script>

<h1>{$message}</h1>
```

## Knobs

The following functions add a control to the control panel and return a [store](https://svelte.dev/tutorial/writable-stores):

```js
const text = knobby.text('my text control', 'text');
const checked = knobby.checkbox('my checkbox control', true);
const color = knobby.color('my color control', '#ff3e00');
const number = knobby.range('my range control', 50, { min: 0, max: 100, step: 1 });
```

You can also add an _action_, which adds a button to the control panel but does not create a store:

```js
knobby.action('say hello', () => alert('hello!'));
```

All controls are associated with a component, and must be created when the component is first initialised.

## Groups

You can group controls together, even across components. For example your root component might _create_ a group...

```svelte
<!-- App.svelte -->
<script>
  import * as knobby from 'svelte-knobby';
  import Widget from './Widget.svelte';

  knobby.group('widget'); // create new group
  const show_widget = knobby.checkbox('show widget', false);
</script>

{#if $show_widget}
  <Widget/>
{/if}
```

...then another component might _select_ the same group and add controls to it:

```svelte
<!-- Widget.svelte -->
<script>
  import * as knobby from 'svelte-knobby';

  knobby.group('widget'); // select existing group
  const message = knobby.text('message', 'This will appear inside the widget group');
</script>

<h1>{$message}</h1>
```

To exit a group, either create/select a new group (groups cannot be nested) or call `knobby.ungroup()`.

## License

MIT
