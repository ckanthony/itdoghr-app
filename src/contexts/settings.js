import React, { Component } from "react";
import bgImg from "../data/images/BOK.png";
import { SettingsContext } from ".";

const toggle = (dis, key) => () => {
  dis.setState(state => ({ [key]: !state[key] }));
};

const setKeyValue = (dis, key) => val => {
  dis.setState(state => ({ [key]: val }));
};

class SettingsProvider extends Component {
  timeoutID;
  state = {
    scale: 1,
    crt: false,
    fullScreen: true,
    isMobile: false,
    bgImg:
      (window && window.localStorage.getItem("bgImg")) ||
      (window && !window.localStorage.getItem("loggedIn") && bgImg),
    bgColor: "#6363A0",
    backgroundRepeat: 'repeat',
    countDown: 28800000,
    isActive: true,
    mousePositionX: null,
    mousePositionY: null,
  };

  toggleCrt = toggle(this, "crt");
  toggleFullScreen = toggle(this, "fullScreen");
  toggleMobile = toggle(this, "isMobile");
  changeScale = setKeyValue(this, "scale");

  updateLocalStorage = (key, val) => {
    if (window && window.localStorage) {
      window.localStorage.setItem(key, val);
      if (val) {
        this.setState({ [key]: val });
      }
    }
  };
  removeLocalStorage = key => {
    let keys = key;
    if (!Array.isArray(key)) {
      keys = [key];
    }
    if (keys.length < 1) {
      return;
    }
    if (window && window.localStorage) {
      keys.map(k => window.localStorage.removeItem(k));

      this.setState(
        keys.reduce(
          (acc, val) => ({
            ...acc,
            [val]: null
          }),
          {}
        )
      );
    }
  };

  handleMouseEvent = async x => {
    clearTimeout(this.timeoutID);
    this.setState({
      mousePositionX: x.pageX,
      mousePositionY: x.pageY,
      isActive: true,
      countDown: 28800000,
    });
    await new Promise(resolve => this.timeoutID = setTimeout(() => {
      this.setState({
        isActive: false,
      });
      return resolve;
    }, this.state.countDown));
  };

  render() {
    const {
      changeScale,
      toggleCrt,
      toggleFullScreen,
      toggleMobile,
      updateLocalStorage,
      removeLocalStorage,
      handleMouseEvent
    } = this;
    const context = {
      ...this.state,
      changeScale,
      toggleCrt,
      toggleFullScreen,
      toggleMobile,
      updateLocalStorage,
      removeLocalStorage,
      handleMouseEvent
    };
    return (
      <SettingsContext.Provider value={context}>
        {this.props.children}
      </SettingsContext.Provider>
    );
  }
}

export default SettingsProvider;
