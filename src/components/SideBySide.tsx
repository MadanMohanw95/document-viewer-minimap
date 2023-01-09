import React, { useState } from "react";
import { Markup } from "interweave";
type MyComponent = {
  diffText: string;
  paragraphIndex: number;
};

const SideBySide:React.FunctionComponent<MyComponent> = (props) => {
  const leftSide = props.diffText.replace(/<ins(.*?)>(.*?)<\/ins>/g, "");
  const rightSide = props.diffText.replace(/<del(.*?)>(.*?)<\/del>/g, "");
  const [isCollapsed, setCollapsed] = useState(leftSide === rightSide);
  return (
    <div id="diff-element-content">
      <span
        id="clickable"
        onClick={() => setCollapsed(!isCollapsed)}
        style={{ backgroundColor: leftSide !== rightSide ? "lightgray" : "" }}
      >
        {props.paragraphIndex.toString().padStart(3, "0")}
        {isCollapsed ? ">" : "\u2304"}
      </span>
      <div id="diff-element-left">
        <Markup
          content={
            isCollapsed
              ? leftSide
                  .split(" ")
                  .slice(0, 5)
                  .join(" ") + "....."
              : leftSide
          }
        />
      </div>
      <div id="diff-element-right">
        <Markup
          content={
            isCollapsed
              ? rightSide
                  .split(" ")
                  .slice(0, 5)
                  .join(" ") + "....."
              : rightSide
          }
        />
      </div>
    </div>
  );
};
export default SideBySide;
