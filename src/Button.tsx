import { AriaButtonProps } from "@react-types/button";
import React from "react";
import { useButton, useFocusRing, mergeProps } from "react-aria";

interface ButtonProps extends AriaButtonProps {
  isPressed: boolean;
}

export const Button = React.forwardRef(
  (props: ButtonProps, ref: React.RefObject<HTMLButtonElement>) => {
    let { buttonProps, isPressed } = useButton(props, ref);
    let { focusProps, isFocusVisible } = useFocusRing();

    let bg = "bg-blue-500";
    if (props.isDisabled) {
      bg = "bg-gray-400";
    } else if (isPressed || props.isPressed) {
      bg = "bg-blue-600";
    }

    let focus = isFocusVisible ? "ring ring-offset-2 ring-blue-400" : "";

    return (
      <button
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        className={`${focus} text-white text-sm font-semibold py-2 px-4 rounded cursor-default focus:outline-none transition ${bg}`}
      >
        {props.children}
      </button>
    );
  }
);
