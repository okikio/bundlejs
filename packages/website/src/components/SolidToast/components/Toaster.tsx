import { defaultContainerStyle } from '../core';
import { ToasterProps } from '..';
import { mergeContainerOptions } from '../util';
import { createEffect, For, onCleanup } from 'solid-js';
import { store, createTimers } from '../core';
import { ToastContainer } from '.';
import { Toast } from '../types';

export const Toaster = (props: ToasterProps) => {
  createEffect(() => {
    mergeContainerOptions(props);
  });

  createEffect(() => {
    const timers = createTimers();
    onCleanup(() => {
      if (!timers) return;
      timers.forEach((timer) => timer && clearTimeout(timer));
    });
  });

  return (
    <div
      style={{
        ...defaultContainerStyle,
        ...props.containerStyle,
      }}
      class={props.containerClassName}
    >
      <style>{`.sldt-active{z-index:9999;}.sldt-active>*{pointer-events:auto;}`}</style>
      <For each={store.toasts}>{(toast) => <ToastContainer toast={toast as Toast} />}</For>
    </div>
  );
};
