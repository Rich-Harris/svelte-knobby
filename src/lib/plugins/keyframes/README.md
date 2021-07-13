# Keyframe editor

## API

```svelte
<script>
  import { knobby } from 'svelte-knobby';
  import { keyframes, curve } from 'svelte-knobby/plugins/keyframes';

  const controls = knobby({
    t: {
      value: 0,
      min: 0,
      max: 100,
      step: 1
    },
    circle: keyframes({
      // this allows the keyframe editor to show
      // the current value of `t`
      playhead: (values) => values.t,
      value: {
        cx: {
          points: [
            [0, 0],
            [100, 200]
          ],
          curves: [
            [0.333, 0.333, 0.667, 0.667]
          ]
        },
        cy: {
          points: [
            [0, 0],
            [100, 200]
          ],
          curves: [
            [0.333, 0.333, 0.667, 0.667]
          ]
        },
        r: {
          $label: 'radius',
          points: [
            [0, 10],
            [50, 30],
            [100, 10]
          ],
          curves: [
            [0.333, 0.333, 0.667, 0.667],
            [0.333, 0.333, 0.667, 0.667],
            [0.333, 0.333, 0.667, 0.667]
          ]
        }
      }
    })
  });

  $: cx = curve($controls.circle.cx);
  $: cy = curve($controls.circle.cy);
  $: r = curve($controls.circle.r);
</script>

<svg width="200" height="200">
  <circle cx={cx($controls.t)} cy={cy($controls.t)} r={r($controls.t)}/>
</svg>
```

Each keyframe track — `cx`, `cy` and `r` in the above example — consists of _n_ `curves` and _n+1_ `points`. Each point is an `[x, y]` pair; each curve is a `[x1, y1, x2, y2]` [cubic bezier curve](https://github.com/gre/bezier-easing) where `x1` and `x2` must fall in the range `[0, 1]`. If a `$label` is provided, it will be shown in the UI.

The `playhead` option makes it possible for the keyframe editor to show a playhead that matches some other value in the control panel — in this case `t`.

The `curve` function takes a `{ points, curves }` object and returns an `(x) => y` function.

## Usage

TODO document keyboard controls, buttons, etc
