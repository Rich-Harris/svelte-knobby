# svelte-knobby

Add knobs to your Svelte apps. [Demo](https://svelte.dev/repl/85c0f69007524dd9a45a8bf72d2401ba)

```svelte
<script>
  import { knobby } from 'svelte-knobby';

  const values = knobby({
    // primitive values are handled automatically
    message: 'Hello World!',
    checked: false,
    color: '#ff3e00',
    clicks: 0,

    // functions become buttons. if state is returned, it will
    // update the store
    increment: value => ({
      ...value,
      clicks: value.clicks + 1
    }),

    // specify options by using a { value } object
    constrained: {
      value: 50,
      min: 0,
      max: 100,
      step: 1
    },

    // objects that can't be 'interpreted' (see below)
    // are treated as folders
    group: {
      a: 1, // accessed as $values.group.a
      b: 2,
      nested: {
        c: 3, // accessed as $values.group.nested.c
        4: 4
      }
    }
  });

  // the returned store is writable
  $values.message = 'Hello Knobby!';
</script>

<h1>{$values.message}</h1>
```

## Interpreting values

TODO

## License

MIT
