# svelte-knobby

Add knobs to your Svelte apps. [Demo](https://svelte.dev/repl/85c0f69007524dd9a45a8bf72d2401ba)

```svelte
<script>
  import * as knobby from 'svelte-knobby';

  const controls = knobby.panel({
    // primitive values are handled automatically
    message: 'Hello World!',
    color: '#ff3e00',
    clicks: 0,
    checked: false,

    // functions become buttons. if state is returned, it will
    // update the store
    increment: value => ({
      ...value,
      clicks: value.clicks + 1
    }),

    // specify options by using a { value } object
    constrained: {
      // any object can be given a $label which will
      // appear in place of the property name
      $label: 'labelled input',
      value: 50,
      min: 0,
      max: 100,
      step: 1
    },

    // objects that can't be 'interpreted' (see below)
    // are treated as folders
    folder: {
      $label: 'labelled folder',
      a: 1, // accessed as $controls.folder.a
      b: 2,
      nested: {
        c: 3, // accessed as $controls.folder.nested.c
        d: 4
      }
    }
  });

  // the returned store is writable
  $controls.message = 'Hello Knobby!';
</script>

<h1>{$controls.message}</h1>
```

## Interpreting values

TODO

## Plugins

- [Keyframe editor](src/lib/plugins/keyframes/README.md)

## License

MIT
