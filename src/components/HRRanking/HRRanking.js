import React, { Component } from "react";
import cx from "classnames";
import "./_styles.scss";
import { WindowProgram } from "packard-belle";
import Window from "../tools/Window";
import { formatNumber } from '../../helpers/numberFormatter';


import { ProgramContext } from "../../contexts";

class HRRanking extends Component {
  static contextType = ProgramContext;
  state = {
    actors: {},
  }

  async componentDidMount() {
    const _actors = {};
    this.context.api.actors.map(a => {
      a.data.map(c => {
        _actors[c.id] = c;
      });
    });
    this.setState({ actors: _actors });
  }

  render() {
    const { props } = this;
    return (
      <ProgramContext.Consumer>
        {context => (
          <Window
            {...props}
            Component={WindowProgram}
            className={cx("InternetExplorer", props.className)}
            title={`員工能力綜合排行榜 - Bank of Kowloon`}
            // menuOptions={buildMenu(props)}
            minHeight={300}
            minWidth={300}
            maximizeOnOpen
          >
            <div className="HRRanking__div" >
              <div className="wrapper">
                <div className="logo-wrapper">
                  <div>
                    <img src={"https://upload.cc/i1/2022/01/29/QSWyRT.png"} />
                  </div>
                  <div className="title">
                    <p>員工能力</p>
                    <p>綜合評分系統</p>
                  </div>
                  <div className="subtitle">
                    <span>出席率</span>
                    <span>'</span>
                    <span>溝通能力</span>
                    <span>'</span>
                    <span>team work指數</span>
                    <span>'</span>
                    <span>社交能力</span>
                    <span>'</span>
                    <span>年資</span>
                  </div>
                </div>
                <div className="content-wrapper">
                  <div className="rank-list-wrapper">
                    {
                      Object.entries(this.context.api.cachedvotes).sort((a, b) => { return b[1] - a[1]; }).slice(0, 5).map(([k, v], i) => {
                        return (
                          <div className="rank-wrapper">
                            <div className="rank">
                              <div className="counter">{formatNumber(v)}</div>
                              <div className="avatar">
                                {(this.state.actors[k] && this.state.actors[k]['img']) ? <img src={this.state.actors[k]['img'][0]} /> : <img src={"https://upload.cc/i1/2022/01/31/QJ4p6V.png"} />}
                              </div>
                              <div className="name-box-wrapper"><div className="name-box">{this.state.actors[k] ? this.state.actors[k]['char'] : "員工"}</div></div>

                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </div>

            </div>
          </Window>
        )}
      </ProgramContext.Consumer>
    );
  }
}

export default HRRanking;

// initialHeight, initialWidth, title, icon, footer, id,
// onClose, onMaximize, isActive, explorerOptions, chidlren, data, customSelect, Component
