import * as React from "react";
import { Section, Item } from "react-stately";
import { MenuButton, NestedMenu } from "./Menu";

export default function App() {
  return (
    <div className="flex flex-col max-w-xl mx-auto p-4">
      {/* prettier-ignore */}
      <MenuButton label="Actions" onAction={() => {}}>
        <Section>
      <Item key="copy">Copy application</Item>
      <Item key="rename">Rename application</Item>
          <Item key="Move to" >
            <NestedMenu label="Move to" onAction={() => {}}>
              <Section>
              <Item key="move-to-shared">Shared</Item>
        <Item key="move-to-desktop">Desktop</Item>
        <Item key="move-to-favorite">Favorite</Item>
              </Section>
            </NestedMenu>
          </Item>
          <Item key="delete">Delete application</Item>

        </Section>
      </MenuButton>
    </div>
  );
}
