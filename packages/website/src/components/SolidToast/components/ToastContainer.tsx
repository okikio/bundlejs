import { createMemo, onMount } from 'solid-js';
import { ToastContainerProps } from '..';
import { defaultToastOptions, dispatch } from '../core';
import { ActionType, resolveValue } from '../types';
import { getToastWrapperStyles, getWrapperYAxisOffset, updateToastHeight } from '../util';
import { ToastBar } from './ToastBar';

export const ToastContainer = (props: ToastContainerProps) => {
  const calculatePosition = () => {
    const position = props.toast.position || defaultToastOptions.position;
    const offset = getWrapperYAxisOffset(props.toast, position);
    const positionStyle = getToastWrapperStyles(position, offset);

    return positionStyle;
  };

  const positionStyle = createMemo(() => calculatePosition());

  let el: HTMLDivElement | undefined = undefined;
  onMount(() => {
    if (el) {
      updateToastHeight(el, props.toast);
    }
  });

  return (
    <div
      ref={el}
      style={positionStyle()}
      class={props.toast.visible ? 'sldt-active' : ''}
      onMouseEnter={() =>
        dispatch({
          type: ActionType.START_PAUSE,
          time: Date.now(),
        })
      }
      onMouseLeave={() =>
        dispatch({
          type: ActionType.END_PAUSE,
          time: Date.now(),
        })
      }
    >
      {props.toast.type === 'custom' ? (
        resolveValue(props.toast.message, props.toast)
      ) : (
        <ToastBar toast={props.toast} position={props.toast.position || defaultToastOptions.position} />
      )}
    </div>
  );
};
