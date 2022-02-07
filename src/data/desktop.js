import * as icons from "../icons";

export default [
  // {
  //   title: "README",
  //   icon: icons.htmlFile32,
  //   component: "InternetExplorer",
  //   data: {
  //     __html: readme
  //   }
  // },
  // {
  //   title: "Resume draft 31 final last 2019 may final 1",
  //   icon: icons.notepadFile32,
  //   component: "Notepad",
  //   data: {
  //     content: resume,
  //     readOnly: true
  //   }
  // }
  {
    title: "我的電腦",
    icon: icons.cuomputerCustom,
    component: "MyComputer",
  },
  {
    title: "我的文檔",
    icon: icons.folderCustom,
    component: "MyDocuments",
  },
  {
    title: "評分系統",
    icon: icons.rating,
    component: "HRWorkstation",
  },
  {
    title: "排行榜",
    icon: icons.ranking,
    component: "HRRanking",
    super: false,
  },
  {
    title: "大台理論",
    icon: icons.super,
    component: "HRRanking",
    super: true,
  },
  {
    title: "第二季!",
    icon: icons.itdog,
    component: "HRWorkstationS2",
  },
  {
    title: "Data狗",
    icon: icons.mailCustom,
    component: "Tableau",
  },
  {
    title: "README",
    icon: icons.mailCustom,
    component: "Readme",
  },
];
