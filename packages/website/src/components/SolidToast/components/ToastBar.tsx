import { createEffect, Match, Switch, Show } from 'solid-js';
import { ActionType, resolveValue, ToastBarProps } from '../types';
import { getToastYDirection as d, iconContainer, messageContainer, toastBarBase } from '../util';
import { Error, Loader, Success } from '.';

import { Button } from "../../Button";
import { dispatch } from '../core';

import { ToolTip, SingletonToolTip } from "../../../hooks/tooltip";

import IconCancel from "~icons/fluent/dismiss-24-regular";
import IconArrowClockwise from "~icons/fluent/arrow-clockwise-24-filled";

export const ToastBar = (props: ToastBarProps) => {
  let el: HTMLDivElement | undefined;

  createEffect(() => {
    if (!el) return;
    const direction = d(props.toast, props.position);
    if (props.toast.visible) {
      el.animate(
        [
          { transform: `translate3d(0,${direction * -200}%,0) scale(.6)`, opacity: 0.5 },
          { transform: 'translate3d(0,0,0) scale(1)', opacity: 1 },
        ],
        {
          duration: 350,
          fill: 'forwards',
          easing: 'cubic-bezier(.21,1.02,.73,1)'
        }
      );
    } else {
      el.animate(
        [
          { transform: 'translate3d(0,0,-1px) scale(1)', opacity: 1 },
          { transform: `translate3d(0,${direction * -150}%,-1px) scale(.4)`, opacity: 0 },
        ],
        {
          duration: 400,
          fill: 'forwards',
          easing: 'cubic-bezier(.06,.71,.55,1)'
        }
      );
    }
  });

  return (
    <div
      ref={el}
      class={props.toast.className}
      style={{
        ...toastBarBase,
        // animation: animation(),
        ...props.toast.style,
      }}
      data-type={props.toast.type}
    >
      <Switch>
        <Match when={props.toast.icon}>
          <div style={iconContainer} class="icon-container">{props.toast.icon}</div>
        </Match>
        <Match when={props.toast.type === 'loading'}>
          <div style={iconContainer} class="icon-container">
            <Loader {...props.toast.iconTheme} />
          </div>
        </Match>
        <Match when={props.toast.type === 'success'}>
          <div style={iconContainer} class="icon-container">
            <Success {...props.toast.iconTheme} />
          </div>
        </Match>
        <Match when={props.toast.type === 'error'}>
          <div style={iconContainer}>
            <Error {...props.toast.iconTheme} />
          </div>
        </Match>
      </Switch>

      <div style={messageContainer} {...props.toast.ariaProps} onClick={() => { }}>
        {resolveValue(props.toast.message, props.toast)}
      </div>

      <div class="flex gap-1.5">
        <Show when={props.toast.type === 'update'}>
          <ToolTip
            content={"Reload"}
            tooltip={{
              followCursor: false,
              delay: [1000, 200],
            }}
          >
            <Button 
              class="reload-button"
              aria-label="Reload"
              onClick={props?.toast?.updateClick}
            >
              <IconArrowClockwise astro-icon rehype-icon />
            </Button>
          </ToolTip>
        </Show>

        <ToolTip
          content={"Dismiss"}
          tooltip={{
            followCursor: false,
            delay: [1000, 200],
          }}
        >
          <Button 
            class="cancel-button"
            aria-label="Dismiss"
            onClick={(e) => {
              if (typeof props?.toast?.dismissClick == "function")
                props?.toast?.dismissClick?.(e);

              dispatch({
                type: ActionType.DISMISS_TOAST,
                toastId: props.toast.id,
              });
            }}
          >
            <IconCancel astro-icon rehype-icon />
          </Button>
        </ToolTip>
      </div>
    </div>
  );
};
