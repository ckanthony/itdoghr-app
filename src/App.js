import React, { Component } from "react";
import { Theme } from "packard-belle";
import cx from "classnames";
import "./App.css";
import TaskBar from "./components/TaskBar";
import WindowManager from "./components/WindowManager";
import ProgramProvider from "./contexts/programs";
import SettingsProvider from "./contexts/settings";
import { SettingsContext } from "./contexts";
import DesktopView from "./components/DesktopView";
import Background from "./components/tools/Background";
import { useGA } from './helpers/useGA';

class Desktop extends Component {
  static contextType = SettingsContext;

  componentDidMount() {
    if (window.innerWidth < 800) {
      this.context.toggleMobile(true);
    }
  }

  render() {
    const { context } = this;
    return (
      <ProgramProvider>
        <Theme
          className={cx("desktop screen", {
            desktopX2: context.scale === 2,
            desktopX1_5: context.scale === 1.5,
            notMobile: !context.isMobile,
            fullScreen: context.fullScreen
          })}
        >
          <Background />
          <DesktopView />
          <TaskBar />
          <WindowManager />
        </Theme>
      </ProgramProvider>
    );
  }
}

const App = () => {
  useGA('G-NGXK34VZQ7', 'itdoghr');
  return <SettingsProvider>
    <Desktop
    />
  </SettingsProvider>
};

// include corner thing if resizable
// body of explorer window needs to fill space

export default App;
