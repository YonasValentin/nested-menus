/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useRef } from "react";
import type { Node } from "@react-types/shared";
import type { AriaMenuProps, MenuTriggerProps } from "@react-types/menu";
import { TreeState, useMenuTriggerState, useTreeState } from "react-stately";
import {
  useMenu,
  useMenuItem,
  useMenuSection,
  useMenuTrigger,
  useSeparator
} from "react-aria";
import { Button } from "./Button";
import { Popover } from "./Popover";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { AriaButtonProps } from "@react-types/button";
import { useButton, useFocusRing, mergeProps } from "react-aria";

interface MenuButtonProps<T extends object>
  extends AriaMenuProps<T>,
    MenuTriggerProps {
  label: string;
}

interface ButtonProps extends AriaButtonProps {
  isPressed: boolean;
}

export const NestedMenuButton = React.forwardRef(
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
        className={`${focus} text-sm font-semibold rounded cursor-default focus:outline-none transition flex w-[200px] `}
      >
        {props.children}
      </button>
    );
  }
);

export function NestedMenu<T extends object>(props: MenuButtonProps<T>) {
  // Create state based on the incoming props
  let state = useMenuTriggerState(props);

  // Get props for the menu trigger and menu elements
  let ref = React.useRef();
  let { menuTriggerProps, menuProps } = useMenuTrigger<T>({}, state, ref);

  useEffect(() => {}, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <NestedMenuButton
        {...menuTriggerProps}
        isPressed={state.isOpen}
        ref={ref}
      >
        {props.label}
        {/* <ChevronRightIcon className="inline ml-1 -mr-2 h-5 w-5" /> */}
      </NestedMenuButton>
      {state.isOpen && (
        <Popover state={state} triggerRef={ref} placement="right top">
          <Menu
            {...menuProps}
            {...props}
            autoFocus={state.focusStrategy || true}
            onClose={() => state.close()}
          />
        </Popover>
      )}
    </div>
  );
}
export function MenuButton<T extends object>(props: MenuButtonProps<T>) {
  // Create state based on the incoming props
  let state = useMenuTriggerState(props);

  // Get props for the menu trigger and menu elements
  let ref = React.useRef();
  let { menuTriggerProps, menuProps } = useMenuTrigger<T>({}, state, ref);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <Button {...menuTriggerProps} isPressed={state.isOpen} ref={ref}>
        {props.label}
      </Button>
      {state.isOpen && (
        <Popover state={state} triggerRef={ref} placement="bottom">
          <Menu
            {...menuProps}
            {...props}
            autoFocus={state.focusStrategy || true}
            onClose={() => {}}
          />
        </Popover>
      )}
    </div>
  );
}

interface MenuProps<T extends object> extends AriaMenuProps<T> {
  onClose: () => void;
}

function Menu<T extends object>(props: MenuProps<T>) {
  // Create state based on the incoming props
  let state = useTreeState(props);

  // Get props for the menu element
  let ref = useRef();
  let { menuProps } = useMenu(props, state, ref);

  return (
    <ul
      {...menuProps}
      ref={ref}
      className="pt-1 pb-1 shadow-xs rounded-md min-w-[200px] focus:outline-none"
    >
      {[...state.collection].map((item) => (
        <MenuSection
          key={item.key}
          section={item}
          state={state}
          onAction={props.onAction}
          onClose={props.onClose}
        />
      ))}
    </ul>
  );
}

interface MenuSectionProps<T> {
  section: Node<T>;
  state: TreeState<T>;
  onAction: (key: React.Key) => void;
  onClose: () => void;
}

function MenuSection<T>({
  section,
  state,
  onAction,
  onClose
}: MenuSectionProps<T>) {
  let { itemProps, groupProps } = useMenuSection({
    heading: section.rendered,
    "aria-label": section["aria-label"]
  });

  let { separatorProps } = useSeparator({
    elementType: "li"
  });

  return (
    <>
      {section.key !== state.collection.getFirstKey() && (
        <li
          {...separatorProps}
          className="border-t border-gray-300 mx-2 mt-1 mb-1"
        />
      )}
      <li {...itemProps}>
        <ul {...groupProps}>
          {[...section.childNodes].map((node) => (
            <MenuItem
              key={node.key}
              item={node}
              state={state}
              onAction={onAction}
              onClose={onClose}
            />
          ))}
        </ul>
      </li>
    </>
  );
}

interface MenuItemProps<T> {
  item: Node<T>;
  state: TreeState<T>;
  onAction: (key: React.Key) => void;
  onClose: () => void;
}

function MenuItem<T>({ item, state, onAction, onClose }: MenuItemProps<T>) {
  // Get props for the menu item element
  let ref = React.useRef();
  let { menuItemProps } = useMenuItem(
    {
      key: item.key,
      onAction,
      onClose
    },
    state,
    ref
  );

  // Handle focus events so we can apply highlighted
  // style to the focused menu item
  let isFocused = state.selectionManager.focusedKey === item.key;
  let focusBg = item.key === "delete" ? "bg-red-500" : "bg-blue-500";
  let focus = isFocused ? `${focusBg} text-white` : "text-gray-900";

  return (
    <li
      {...menuItemProps}
      ref={ref}
      className={`${focus} text-sm cursor-default select-none relative mx-1 rounded py-2 pl-3 focus:outline-none `}
    >
      {item.rendered}
    </li>
  );
}
