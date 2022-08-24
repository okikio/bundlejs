import { Component } from 'solid-js';
import type { JSX } from 'solid-js';
import { genSVGCubicBezier } from '../util';

export const MainCircle: Component<{ fill: string }> = (props) => {
  const publicProps: JSX.AnimateSVGAttributes<SVGAnimateElement> = {
    dur: '0.35s',
    begin: '100ms',
    fill: 'freeze',
    calcMode: 'spline',
    keyTimes: '0; 0.6; 1',
    keySplines: '0.25 0.71 0.4 0.88; .59 .22 .87 .63',
  };
  return (
    <circle fill={props.fill} cx="16" cy="16" r="0">
      <animate attributeName="opacity" values="0; 1; 1" {...publicProps} />
      <animate attributeName="r" values="0; 17.5; 16" {...publicProps} />
    </circle>
  );
};

export const SecondaryCircle: Component<{ fill: string; begin?: string }> = (props) => {
  const publicProps: JSX.AnimateSVGAttributes<SVGAnimateElement> = {
    dur: '1s',
    begin: props.begin || '320ms',
    fill: 'freeze',
    ...genSVGCubicBezier('0.0 0.0 0.2 1'),
  };
  return (
    <circle fill={props.fill} cx="16" cy="16" r="12" opacity="0">
      <animate attributeName="opacity" values="1; 0" {...publicProps} />
      <animate attributeName="r" values="12; 26" {...publicProps} />
    </circle>
  );
};
