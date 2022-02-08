import * as icons from "../icons";
import son from './textFiles/son';
import itDepartment from './textFiles/itDepartment';
import salesDepartment from './textFiles/salesDepartment';

const programs = [
  // {
  //   title: "IE4",
  //   icon: icons.internetExplorere16,
  //   component: "InternetExplorer",
  //   data: { __html: google1999 }
  // },
  {
    title: '員工能力綜合評分系統',
    icon: icons.rating,
    component: "HRWorkstation",
  },
  {
    title: '員工能力綜合排名',
    icon: icons.ranking,
    component: "HRRanking",
    super: false,
  },
  {
    title: "大台員工能力綜合排名",
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
    title: "Data 狗呈獻：員工排名洞察報告",
    icon: icons.datadog,
    component: "Tableau",
  },
];

export default [
  { title: "README", icon: icons.mailCustom, component: "Readme" },
  { title: "我的電腦", icon: icons.cuomputerCustom, component: "MyComputer" },
  { title: "我的文檔", icon: icons.folder32, component: "MyDocuments" },
  {
    title: "程式",
    icon: icons.appCustom,
    options: programs
  },
  {
    title: "備忘錄",
    icon: icons.notepadCustom,
    options: [
      {
        title: "兒子IG",
        icon: icons.notepadCustom,
        component: "Notepad",
        data: {
          content: son
        }
      },
      {
        title: "IT部",
        icon: icons.notepadCustom,
        component: "Notepad",
        data: {
          content: itDepartment
        }
      },
      {
        title: "銷售部",
        icon: icons.notepadCustom,
        component: "Notepad",
        data: {
          content: salesDepartment
        }
      },
    ]
  }
];
