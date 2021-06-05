**Note: in this fork of svelte-knobby, I added a select, radio button and the ability to drag your window around** 

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

The following functions create a [readable store](https://svelte.dev/tutorial/readable-stores):

```js
const text = knobby.text('my text control', 'text');
const checked = knobby.checkbox('my checkbox control', true);
const color = knobby.color('my color control', '#ff3e00');
const number = knobby.range('my range control', 50, { min: 0, max: 100, step: 1 });
const radio = knobby.radio('my radio control', 'one', { options: ['one','two','three'] });
const select = knobby.select('my select control', 'a', { options: ['a','b','c'] });
```

Controls are added to the control panel when their stores are subscribed to, and removed when there are no more subscribers.

You can also add an _action_, which adds a button to the control panel but does not create a store. If created inside a component's initialisation block it will be destroyed along with the component, otherwise you must manually call the returned `destroy` function:

```js
const destroy = knobby.action('say hello', () => alert('hello!'));
```

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
