import React, { Component } from "react";
import cx from "classnames";
import nanoid from "nanoid";
import * as icons from "../../icons";
import "./_styles.scss";
import { WindowProgram, DetailsSection, ButtonIconLarge, ButtonForm, Button, InputText } from "packard-belle";
import Window from "../tools/Window";


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

class HRWorkstation extends Component {
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
    selectedCandidate: { id: 'siulungling' },
    selectedCandidateCount: 0,
    countdown: 3000,
    currentImageIndex: 0,
  };

  async selectTab(id, tab) {
    await this.context.api.getSnapshot();
    let tabName = '主創與幕後';
    let state = {
      selectedTab: id,
      currentImageIndex: 0,
    };
    if (tab) {
      state['selectedCandidate'] = { id: tab.data[0].id };
      tabName = tab.props;
    }
    this.setState(state);

    event('Voting Page', `${tabName} Tab`, 'Button');
  }

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
    this.context.api.actors.map(a => {
      a.data.map(c => {
        _actors[c.id] = c;
      });
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
    _inputCandidates[candidate] += 1;
    if (_inputCandidates[candidate] % 5 === 0) {
      this.onImageClick(candidate);
    }
    this.setState({
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
            <div className="HRWorkstation__div">
              <div className="wrapper">
                <div className="content">
                  <menu role="tablist">
                    {
                      context.api.actors.map((r, i) =>
                        <button role="tab" id={i} aria-controls={i} aria-selected={this.state.selectedTab === i} onClick={async () => { await this.selectTab(i, r); }} >{r.props}</button>
                      )
                    }
                    <button role="tab" id={5} aria-controls={5} aria-selected={this.state.selectedTab === 5} onClick={async () => { await this.selectTab(5); }} >主創與幕後</button>
                  </menu>
                  {
                    context.api.actors.map((r, i) => {
                      return (
                        <>
                          <article role="tabpanel" id={i} className="article" style={{ display: this.state.selectedTab === i ? 'flex' : 'none' }}>
                            <DetailsSection title="選項" className="menuWrapper">
                              <div className="menu">
                                <div>
                                  {
                                    r.data.map((d, i) => {
                                      return (
                                        <ButtonForm onClick={async () => this.selectCandidate(d.id)} className="options">
                                          <span>{d.char}</span>
                                          <span>
                                            ({context.api.displayvotes[d.id]})
                                          </span>
                                        </ButtonForm>
                                      );
                                    })
                                  }

                                </div>
                              </div>
                            </DetailsSection>

                            <div className="detailWrapper" >
                              <div className="content">
                                {
                                  r.data.map((d, i) => {
                                    return (
                                      <div style={{ display: this.state.selectedCandidate.id === d.id ? 'block' : 'none' }}>
                                        <menu role="tablist">
                                          <button role="tab" aria-controls="tab-A" aria-selected={this.state.selectedSubTab === 0} onClick={async () => await this.selectSubTab(0)}>綜合評分</button>
                                          <button role="tab" aria-controls="tab-B" aria-selected={this.state.selectedSubTab === 1} onClick={async () => await this.selectSubTab(1)}>履歷</button>
                                        </menu>
                                        <article role="tabpanel" id="tab-A" className="article inner-tab-panel" style={{ display: this.state.selectedSubTab === 0 ? 'flex' : 'none' }}>
                                          <div className="detail">
                                            <div className="candidate">
                                              <div>{this.state.actors[d.id] ? this.state.actors[d.id].char : ""}</div>
                                            </div>
                                            {(d.img && d.img.length > 0 && this.state.actors[d.id]) ?
                                              <img src={this.state.actors[d.id].img[this.state.currentImageIndex]} width={'100%'} className="avatar" onClick={() => this.onImageClick(d.id)} />
                                              : <img className="avatar" src={"https://upload.cc/i1/2022/01/31/QJ4p6V.png"} />}
                                            <div className="counter" >
                                              <div><div style={{ padding: (!this.state.inputCandidates[this.state.selectedCandidate.id]) ? '15px 20px 10px 20px' : 0 }}>{context.api.displayvotes[this.state.selectedCandidate.id]}</div>
                                                {(this.state.inputCandidates[this.state.selectedCandidate.id]) ? <div className="plusCounter" >(+{this.state.inputCandidates[this.state.selectedCandidate.id]})</div> : <></>}
                                              </div></div>
                                            <ButtonForm className={"vote"} onClick={() => {
                                              this.updateInput(this.state.selectedCandidate.id);
                                              context.api.vote(this.state.selectedCandidate.id);
                                              event('Voting Page', `${this.state.selectedCandidate.id} Vote`, 'Button');
                                            }}>
                                              <img src={heart} width={100} />
                                            </ButtonForm>
                                          </div>
                                        </article>
                                        <article role="tabpanel" id="tab-B" hidden className="article inner-tab-panel" style={{ display: this.state.selectedSubTab === 1 ? 'flex' : 'none' }}>
                                          <div className="detail cv">
                                            <div className="candidate cv">
                                              <div>{this.state.actors[d.id] ? this.state.actors[d.id].char : ""}</div>
                                            </div>
                                            {(d.img && d.img.length > 0) ? <img src={d.img[0]} width={'100%'} className="avatar cv" /> : <div className="avatar cv">{'404'}</div>}
                                            <div className={"cvDetails"}>
                                              <pre>{`

      ::::::::::: :::::::::::       :::::::::   ::::::::   :::::::: 
         :+:         :+:           :+:    :+: :+:    :+: :+:    :+: 
        +:+         +:+           +:+    +:+ +:+    +:+ +:+         
       +#+         +#+           +#+    +:+ +#+    +:+ :#:          
      +#+         +#+           +#+    +#+ +#+    +#+ +#+   +#+#    
     #+#         #+#           #+#    #+# #+#    #+# #+#    #+#     
###########     ###           #########   ########   ########

HK Television Entertainment Company Limited (c) 2022 非官方，我都無say`}
                                              </pre>
                                              <div>&nbsp;</div>
                                              <div># 基本資料</div>
                                              <div>演員&nbsp;:&nbsp; {d.actor}</div>
                                              <div>ig&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp; <a href={`https://www.instagram.com/${d.ig}/`} target="_blank">@{d.ig}</a></div>
                                              <div>&nbsp;</div>
                                              <div>- - -</div>
                                              <div>&nbsp;</div>
                                              <div># 事蹟</div>
                                              {!!d.history && d.history.map(x => {
                                                return (
                                                  <div>{x}</div>
                                                );
                                              })}
                                              <div>&nbsp;</div>
                                              <div>- - -</div>
                                              <div>- 資料來源:&nbsp;&nbsp; <a target="_blank" href="https://www.instagram.com/p/CZMYkLYPmXQ/">游大東ig</a>, <a target="_blank" href="https://zh.wikipedia.org/wiki/IT%E7%8B%97">Wikipedia</a>, <a target="_blank" href="https://viu.tv/encore/in-geek-we-trust">viuTV</a></div>
                                              <div>- 由於開發時間短促，儘管我們已盡力校對，資料可能還會出錯或缺失。歡迎<a href="https://www.instagram.com/itdoghr/" target="_blank">指正</a>或<a href="https://github.com/ckanthony/itdoghr-app" target="_blank">直接參與開發</a>。</div>
                                            </div>
                                          </div>
                                        </article>
                                      </div>
                                    );
                                  })
                                }
                              </div>
                            </div>
                          </article>
                          <article role="tabpanel" id={5} className="article" style={{ display: this.state.selectedTab === 5 ? 'flex' : 'none' }}>
                            <div className={"backStage"}>
                              <pre>{`#!/bin/sh

#      ::::::::::: :::::::::::       :::::::::   ::::::::   :::::::: 
#         :+:         :+:           :+:    :+: :+:    :+: :+:    :+: 
#        +:+         +:+           +:+    +:+ +:+    +:+ +:+         
#       +#+         +#+           +#+    +:+ +#+    +:+ :#:          
#      +#+         +#+           +#+    +#+ +#+    +#+ +#+   +#+#    
#     #+#         #+#           #+#    #+# #+#    #+# #+#    #+#     
###########     ###           #########   ########   ########

#HK Television Entertainment Company Limited (c) 2022 非官方，我都無say`}
                              </pre>
                              <div></div>
                              <div></div>
                              <div>echo "'主創' :"</div>
                              <div>echo "[\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "001", name: "魯庭暉", pos: "出品人", ig: `}<a href="https://www.instagram.com/lofaig/" target="_blank">@lofaig</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "002", name: "羅耀輝", pos: "監製", ig: `}<a href="https://www.instagram.com/andylofai/" target="_blank">@andylofai</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "003", name: "簡君晉", pos: "導演", ig: `}<a href="https://www.instagram.com/lawrencekan26/" target="_blank">@lawrencekan26</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "004", name: "李卓風", pos: "編審", ig: `}<a href="https://www.instagram.com/fung.li/" target="_blank">@fung.li</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "005", name: "唐翠萍", pos: "編審", ig: `}<a href="https://www.instagram.com/tiiiiris/" target="_blank">@tiiiiris</a>{`}", },`}\</div>
                              <div>];"</div>
                              <div></div>
                              <div></div>
                              <div>echo "'幕後' :"
                              </div>
                              <div>echo "[\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "006", name: "", pos: "劇照", ig: `}<a href="https://www.instagram.com/celinejill/" target="_blank">@celinejill</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "007", name: "", pos: "混音", ig: `}<a href="https://www.instagram.com/wilsonsoundon/" target="_blank">@wilsonsoundon</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "008", name: "", pos: "副導演", ig: `}<a href="https://www.instagram.com/itsgillianmak_89/" target="_blank">@itsgillianmak_89</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "009", name: "", pos: "美術指導", ig: `}<a href="https://www.instagram.com/wilfcho.pdf/" target="_blank">@wilfcho.pdf</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "010", name: "", pos: "美術道具組", ig: `}<a href="https://www.instagram.com/karsonliu/" target="_blank">@karsonliu</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "011", name: "", pos: "", ig: `}<a href="https://www.instagram.com/hogyuen/" target="_blank">@hogyuen</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "012", name: "", pos: "攝影師", ig: `}<a href="https://www.instagram.com/timrichardson_dp/" target="_blank">@timrichardson_dp</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "013", name: "", pos: "", ig: `}<a href="https://www.instagram.com/kenny_kwanhk/" target="_blank">@kenny_kwanhk</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "014", name: "", pos: "化妝", ig: `}<a href="https://www.instagram.com/lindatsemakeup/" target="_blank">@lindatsemakeup</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "015", name: "", pos: "", ig: `}<a href="https://www.instagram.com/hoihoiy/" target="_blank">@hoihoiy</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "016", name: "", pos: "", ig: `}<a href="https://www.instagram.com/chachaiii/" target="_blank">@chachaiii</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "017", name: "", pos: "", ig: `}<a href="https://www.instagram.com/madgodstudio/" target="_blank">@madgodstudio</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "018", name: "", pos: "", ig: `}<a href="https://www.instagram.com/lou_is_lui/" target="_blank">@lou_is_lui</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "019", name: "", pos: "製作組", ig: `}<a href="https://www.instagram.com/christyip/" target="_blank">@christyip</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "020", name: "", pos: "製作組", ig: `}<a href="https://www.instagram.com/kezmanl/" target="_blank">@kezmanl</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "021", name: "", pos: "製作組", ig: `}<a href="https://www.instagram.com/heynawg/" target="_blank">@heynawg</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "022", name: "", pos: "製作組", ig: `}<a href="https://www.instagram.com/suetyannn/" target="_blank">@suetyannn</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "023", name: "", pos: "配樂", ig: `}<a href="https://www.instagram.com/wanpinchu/" target="_blank">@wanpinchu</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "024", name: "", pos: "配樂", ig: `}<a href="https://www.instagram.com/matthewchowmingfai/" target="_blank">@matthewchowmingfai</a>{`}", },`}\</div>
                              <div>&nbsp;&nbsp;&nbsp;&nbsp;{`{ id: "025", name: "", pos: "配樂", ig: `}<a href="https://www.instagram.com/estherccwu/" target="_blank">@estherccwu</a>{`}", },`}\</div>
                              <div>];"</div>
                              <div>echo "資料來源:&nbsp;&nbsp; <a target="_blank" href="https://www.instagram.com/p/CZMYkLYPmXQ/">游大東ig</a>, <a target="_blank" href="https://zh.wikipedia.org/wiki/IT%E7%8B%97">Wikipedia</a>, <a target="_blank" href="https://viu.tv/encore/in-geek-we-trust">viuTV</a>"</div>
                              <div>echo "由於開發時間短促，儘管我們已盡力校對，資料可能還會出錯或缺失。歡迎<a href="https://www.instagram.com/itdoghr/" target="_blank">指正</a>或<a href="https://github.com/ckanthony/itdoghr-app" target="_blank">直接參與開發</a>。"</div>
                            </div>
                          </article>
                        </>

                      );
                    }

                    )};


                </div>
              </div>
            </div >
          </Window >
        )}
      </ProgramContext.Consumer>
    );
  }
}

export default HRWorkstation;

// initialHeight, initialWidth, title, icon, footer, id,
// onClose, onMaximize, isActive, explorerOptions, chidlren, data, customSelect, Component
