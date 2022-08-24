import type { JSX } from 'solid-js';

export const toastBarBase: JSX.CSSProperties = {
  display: 'flex',
  'align-items': 'center',
  color: '#363636',
  background: 'white',
  'box-shadow': '0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)',
  'max-width': '350px',
  'pointer-events': 'auto',
  padding: '8px 10px',
  'border-radius': '4px',
  'line-height': '1.3',
  'will-change': 'transform',
};

export const messageContainer: JSX.CSSProperties = {
  display: 'flex',
  'align-items': 'center',
  flex: '1 1 auto',
  margin: '4px 10px',
  'white-space': 'pre-line',
};

export const iconContainer: JSX.CSSProperties = {
  'flex-shrink': 0,
  'min-width': '20px',
  'min-height': '20px',
  display: 'flex',
  'align-items': 'center',
  'justify-content': 'center',
  'text-align': 'center',
};

export const genSVGCubicBezier: (
  keySplines: string
) => Pick<JSX.AnimateSVGAttributes<SVGAnimateElement>, 'calcMode' | 'keyTimes' | 'keySplines'> = (keySplines) => ({
  calcMode: 'spline',
  keyTimes: '0; 1',
  keySplines: keySplines,
});
