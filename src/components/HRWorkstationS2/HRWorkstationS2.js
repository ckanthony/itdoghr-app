import React, { Component } from "react";
import cx from "classnames";
import nanoid from "nanoid";
import * as icons from "../../icons";
import "./_styles.scss";
import { WindowProgram, DetailsSection, ButtonIconLarge, ButtonForm, Button, InputText } from "packard-belle";
import Window from "../tools/Window";
import { formatNumber } from "../../helpers/numberFormatter";


import heart from '../../data/images/heart.png';
import { ProgramContext } from "../../contexts";
import { event } from "../../helpers/useGA";


const canAccessIframe = id => {
  const iframe = document && document.querySelector(`.${id}`);
  const canAccess =
    iframe &&
    iframe.contentDocument &&
    iframe.contentDocument.body &&
    iframe.contentDocument.body.scrollHeight;
  if (canAccess) {
    return {
      height: iframe.contentDocument.body.scrollHeight,
      width: iframe.contentDocument.body.scrollWidth
    };
  }
};

class HRWorkstationS2 extends Component {
  static contextType = ProgramContext;
  timeoutID;
  id = "b".concat(nanoid()).replace("-", "");
  state = {
    dimensions: { width: '100vw', height: '100vh' },
    selectedTab: 0,
    selectedSubTab: 0,
    actors: {},
    inputCandidates: {
    },
    selectedCandidate: { id: 's2' },
    selectedCandidateCount: 0,
    countdown: 3000,
    totalSessionClick: 0,
    currentImageIndex: 0,
    maybebot: false,
    switch: true,
  };

  async selectSubTab(id) {
    await this.context.api.getSnapshot();
    this.setState({
      selectedSubTab: id,
    });
    event('Voting Page', `${id} Sub Tab`, 'Button');
  }

  selectCandidate(id) {
    event('Voting Page', `${id} Tab`, 'Button');
    this.setState({
      selectedCandidate: {
        id: id,
      },
      currentImageIndex: 0,
    });
  }

  onImageClick(id) {
    event('Voting Page', `${id} Image`, 'Image');
    const imgList = this.state.actors[id].img;
    let cIndex = this.state.currentImageIndex;
    let nIndex;
    nIndex = (cIndex === imgList.length - 1) ? 0 : cIndex + 1;
    this.setState({
      currentImageIndex: nIndex,
    });

  }

  async componentDidMount() {
    setTimeout(this.getIframeDimension, 3000);
    const _actors = {};
    this.context.api.s2.map(a => {
      _actors[a.id] = a;
    });
    const candidates = (await this.context.api.getSnapshot()).data;
    let _inputCandidates = {};
    Object.keys(candidates).map(c => {
      _inputCandidates[c] = 0;
    });

    this.setState({ inputCandidates: _inputCandidates, actors: _actors });
  }
  getIframeDimension = () => {
    const iframeDimensions = canAccessIframe(this.id);
    if (iframeDimensions && iframeDimensions !== this.state.dimensions) {
      this.setState({ dimensions: iframeDimensions });
    }
  };

  async updateInput(candidate) {
    // clearTimeout(this.timeoutID);
    let _inputCandidates = this.state.inputCandidates;
    let _totalSessionClick = this.state.totalSessionClick;
    _inputCandidates[candidate] += 1;
    _totalSessionClick += 1;
    if (_totalSessionClick % 5000 === 0) {
      this.setState({ switch: !this.state.switch });
    }
    if (_totalSessionClick > 1000) {
      this.setState({ maybebot: true });
    }
    if (_inputCandidates[candidate] % 10 === 0) {
      this.onImageClick(candidate);
    }
    this.setState({
      totalSessionClick: _totalSessionClick,
      inputCandidates: _inputCandidates,
      // countdown: 2000,
    });
    // await new Promise(resolve => this.timeoutID = setTimeout(() => {
    //   this.setState({ countdown: 2000, inputCount: 0 });
    //   return resolve;
    // }, this.state.countdown));

  }

  render() {
    const { props } = this;
    return (
      <ProgramContext.Consumer>
        {context => (
          <Window
            {...props}
            Component={WindowProgram}
            className={cx("boksystem", props.className)}
            title={`員工能力綜合評分系統 - Bank of Kowloon`}
            // menuOptions={buildMenu(props)}
            minHeight={300}
            minWidth={300}
            maximizeOnOpen
          >
            <div className="HRWorkstationS2__div">
              <div className="wrapper">
                <div className="content">
                  {
                    context.api.s2.map((r, i) => {
                      return (
                        <>
                          <div className="detailWrapper" >
                            <div className="content">
                              <div style={{ display: 'block', height: '100%' }}>
                                <div className="detail">
                                  <div className="candidate">
                                    <div>{r.actor}</div>
                                  </div>
                                  {(r.img && r.img.length > 0) ?
                                    <img src={r.img} width={'100%'} className="avatar" />
                                    : <a href="https://www.instagram.com/p/CZm30_qv_lQ/" target="_blank"><img className="avatar" src={"https://upload.cc/i1/2022/01/31/QJ4p6V.png"} /></a>}
                                  <div className={`counter {this.state.switch ? "" : "switch"}`} >
                                    <div>
                                      <div style={{ padding: (!this.state.inputCandidates[this.state.selectedCandidate.id]) ? '15px 20px 10px 20px' : 0 }}>{context.api.displayvotes[this.state.selectedCandidate.id] ? formatNumber(context.api.displayvotes[this.state.selectedCandidate.id]) : ''}</div>
                                      {(this.state.inputCandidates[this.state.selectedCandidate.id]) ? <div className="plusCounter" >(+{this.state.inputCandidates[this.state.selectedCandidate.id]})</div> : <></>}
                                    </div>
                                  </div>
                                  <ButtonForm className={`vote {this.state.switch ? "" : "switch"}`} onClick={() => {
                                    this.updateInput(this.state.selectedCandidate.id);
                                    context.api.vote(this.state.selectedCandidate.id);
                                    event('Voting Page', `${this.state.selectedCandidate.id} Vote`, 'Button');
                                  }}>
                                    <img src={heart} width={100} />
                                  </ButtonForm>
                                </div>
                              </div>
                            </div>
                          </div>

                        </>
                      );
                    })}
                </div>
              </div>
            </div>
          </Window >
        )}
      </ProgramContext.Consumer>
    );
  }
}

export default HRWorkstationS2;

// initialHeight, initialWidth, title, icon, footer, id,
// onClose, onMaximize, isActive, explorerOptions, chidlren, data, customSelect, Component
