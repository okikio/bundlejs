export default `
:root {
    --black: #222;
    --highlight: #ffcf00;
    --red: #e54245;
    --green: #608b00;
    --blue: #0089b0;
    --cyan: #008c98;
    --magenta: #776eeb;
    --yellow: #ffcf00;
    --dim: #777;
    --white: #fff;
    --mono: "Noto Sans Mono", monospace;
    color-scheme: dark light;
}

.color-red {
    color: var(--red);
}
.color-green {
    color: var(--green);
}
.color-blue {
    color: var(--blue);
}
.color-cyan {
    color: var(--cyan);
}
.color-magenta {
    color: var(--magenta);
}
.color-yellow {
    color: var(--yellow);
}
.color-dim {
    color: var(--dim);
}
.color-red-bg-red {
    color: var(--red);
    background-color: var(--red);
}
.color-red-bg-white {
    color: var(--white);
    background-color: var(--red);
}
.color-green-bg-green {
    color: var(--green);
    background-color: var(--green);
}
.color-green-bg-white {
    color: var(--white);
    background-color: var(--green);
}
.color-blue-bg-blue {
    color: var(--blue);
    background-color: var(--blue);
}
.color-blue-bg-white {
    color: var(--white);
    background-color: var(--blue);
}
.color-cyan-bg-cyan {
    color: var(--cyan);
    background-color: var(--cyan);
}
.color-cyan-bg-black {
    color: var(--black);
    background-color: var(--cyan);
}
.color-magenta-bg-magenta {
    color: var(--magenta);
    background-color: var(--magenta);
}
.color-magenta-bg-black {
    color: var(--black);
    background-color: var(--magenta);
}
.color-yellow-bg-yellow {
    color: var(--yellow);
    background-color: var(--yellow);
}
.color-yellow-bg-black {
    color: var(--black);
    background-color: var(--yellow);
}`