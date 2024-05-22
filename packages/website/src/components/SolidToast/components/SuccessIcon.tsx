import type { IconProps } from '../types';
import { genSVGCubicBezier } from '../util';
import { MainCircle, SecondaryCircle } from './IconCircle';

export const Success = (props: IconProps) => {
  const fill = props.primary || '#34C759';
  return (
    <svg style={{ overflow: 'visible' }} viewBox="0 0 32 32" width="1.25rem" height="1.25rem">
      <MainCircle fill={fill} />
      <SecondaryCircle fill={fill} begin="350ms" />
      <path
        fill="none"
        stroke={props.secondary || '#FCFCFC'}
        stroke-width="4"
        stroke-dasharray="22"
        stroke-dashoffset="22"
        stroke-linecap="round"
        stroke-miterlimit="10"
        d="M9.8,17.2l3.8,3.6c0.1,0.1,0.3,0.1,0.4,0l9.6-9.7"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="22;0"
          dur="0.25s"
          begin="250ms"
          fill="freeze"
          // ease-out
          {...genSVGCubicBezier('0.0, 0.0, 0.58, 1.0')}
        />
      </path>
    </svg>
  );
};
