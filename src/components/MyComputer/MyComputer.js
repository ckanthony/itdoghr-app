import React, { Component } from "react";
import { WindowExplorer } from "packard-belle";
import * as icons from "../../icons";
import Window from "../tools/Window";
import buildMenu from "../../helpers/menuBuilder";
import "./_styles.scss";
import "../../icons/icons.scss";
import { ProgramContext } from '../../contexts';


class MyComputer extends Component {
  state = {
  };
  handleClick = (href) => {
    window.open(href, '_blank');
  };


  render() {
    const { props } = this;
    return (
      <ProgramContext.Consumer>
        {context => (
          <Window
            {...props}
            title={"https://itdoghr.com/about"}
            Component={WindowExplorer}
            className="MyComputer__div"
            resizable={false}
            menuOptions={buildMenu(props)}
          >
            <iframe src="https://itdoghr.com/about" className="wrapper" />
          </Window>
        )}
      </ProgramContext.Consumer>
    );
  }
}

export default MyComputer;
