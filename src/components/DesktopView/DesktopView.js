import React from "react";
import { ExplorerView, ExplorerIcon } from "packard-belle";
import { ProgramContext } from "../../contexts";

const DesktopView = () => (
  <ProgramContext.Consumer>
    {context => {
      return <ExplorerView>
        <div style={{ margin: '10px' }}>
          {context.desktop.map(option => (
            <ExplorerIcon key={option.title} {...option} />
          ))}
        </div>
      </ExplorerView>;
    }}
  </ProgramContext.Consumer>
);

export default DesktopView;
