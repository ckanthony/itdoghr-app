import React, { Component } from "react";
import nanoid from "nanoid";
import * as icons from "../icons";
import * as Applications from "../components/Applications";
import startMenuData from "../data/start";
import desktopData from "../data/desktop";
import { ProgramContext, SettingsContext } from ".";
import axios from 'axios';
import { io } from "socket.io-client";
import { event } from "../helpers/useGA";

var ready = false;
var currentlySendingTo = '';
var currentlyVoteCount = 0;
var timeout;

const otherProjects = [
  {
    title: "改名易",
    icon: 'nameeasy',
    href: 'https://nameeasy.app'
  },
  {
    title: "PayPay Duck",
    icon: 'paypayduck',
    href: 'https://paypayduckapp.com'
  },
  {
    title: "Touchwood",
    icon: 'touchwood',
    href: 'https://apps.apple.com/hk/app/touchwood/id1606874856'
  },
];

// const backstageStaff = [{
//   props: "主創", data: [{ id: "lofaig", name: "魯庭暉", pos: "出品人", ig: "lofaig", },
//   { id: "andylofai", name: "羅耀輝", pos: "監製", ig: "andylofai", },
//   { id: "lawrencekan26", name: "簡君晉", pos: "導演", ig: "lawrencekan26", },
//   { id: "fungli", name: "李卓風", pos: "編審", ig: "fung.li", },
//   { id: "tiiiiris", name: "唐翠萍", pos: "編審", ig: "tiiiiris", },]
// },
// {
//   props: "幕後", data: [{ id: "celinejill", name: "", pos: "劇照", ig: "celinejill", },
//   { id: "wilsonsoundon", name: "", pos: "混音", ig: "wilsonsoundon", },
//   { id: "itsgillianmak", name: "", pos: "副導演", ig: "itsgillianmak_89", },
//   { id: "wilfcho.pdf", name: "", pos: "美術指導", ig: "wilfcho.pdf", },
//   { id: "karsonliu", name: "", pos: "美術道具組", ig: "karsonliu", },
//   { id: "hogyuen", name: "", pos: "", ig: "hogyuen", },
//   { id: "timrichardson", name: "", pos: "攝影師", ig: "timrichardson_dp", },
//   { id: "kennykwanhk", name: "", pos: "", ig: "kenny_kwanhk", },
//   { id: "lindatsemakeup", name: "", pos: "化妝", ig: "lindatsemakeup", },
//   { id: "hoihoiy", name: "", pos: "", ig: "hoihoiy", },
//   { id: "chachaiii", name: "", pos: "", ig: "chachaiii", },
//   { id: "madgodstudio", name: "", pos: "", ig: "madgodstudio", },
//   { id: "louislui", name: "", pos: "", ig: "lou_is_lui", },
//   { id: "christyip", name: "", pos: "製作組", ig: "christyip", },
//   { id: "kezmanl", name: "", pos: "製作組", ig: "kezmanl", },
//   { id: "heynawg", name: "", pos: "製作組", ig: "heynawg", },
//   { id: "suetyannn", name: "", pos: "製作組", ig: "suetyannn", },
//   { id: "wanpinchu", name: "", pos: "配樂", ig: "wanpinchu", },
//   { id: "matthewchowmingfai", name: "", pos: "配樂", ig: "matthewchowmingfai", },
//   { id: "estherccwu", name: "", pos: "配樂", ig: "estherccwu", },]
// },];

const s2 = [{
  id: 's2',
  actor: '第二季!',
  char: '第二季!',
  ig: 's2',
  img: ["https://upload.cc/i1/2022/02/07/i9rk2f.jpeg"]
}]

const actors = [{
  props: "PayPayDuck & Born Hub", data: [{
    history: ["阿信",
      "PayPayDuck行政總裁",
      "蒙玲、Billy及Billie之上司",
      "蒙玲的大學同學，並被蒙玲暗戀",
      "Shirley之前男友，Lou的好友，和上述二人是大學同學",
      "原九龍銀行IT部主管，於第1集被裁員，同時亦和Shirley分手",
      "於第1集賣掉房子創業，計劃開發電子婚宴人情應用程式",
      "於第3集將應用程式命名為PayPayDuck並報名參加初創有明天比賽",
      "於第6集受Shirley啟發將PayPayDuck改作人情預繳模式",
      "於第7集發現Ryan出軌，導致Shirley婚禮告吹，加上PayPayDuck意外導致她陷入公關災難，和Shirley反目",
      "於第11集邀請Lou為PayPayDuck眾人「Loutivate」，但誤中其圈套把PayPayDuck的機密洩漏，導致PayPayDuck被抄襲",
      "於第12集因抄襲PayPayDuck一事和Lou決裂",
      "於第12集採納Tony建議打算裸跑為PayPayDuck作惡俗行銷而被拘留",], id: "siulungling", actor: "凌文龍", char: "葉念信", ig: "siulungling", img: [
        "https://upload.cc/i1/2022/01/29/Axq6CT.jpeg",
        "https://upload.cc/i1/2022/01/30/6kbxhq.png",
        "https://upload.cc/i1/2022/01/30/GQ0KaN.png",
        "https://upload.cc/i1/2022/01/30/2pci3g.png",
        "https://upload.cc/i1/2022/01/30/P57WUn.png",
        "https://upload.cc/i1/2022/01/30/CelAvr.png",
      "https://upload.cc/i1/2022/01/30/YdicCA.png",
      "https://upload.cc/i1/2022/02/02/liOr31.png"
    ]
  },
    {
      history: ["霞姨、Lemon、Ling（通訊程式稱謂）",
        "原名蒙嘉玲",
        "葉念信之下屬，並暗戀他。曾經是大學同學",
        "被黃金開暗戀",
        "自稱是來自矽谷的程式編寫員，實際是一名設計師",
        "PayPayDuck程式編寫員，於第3集改任創意程式編寫員",
        "於第7集被前男友企圖挖角到其德國廣告公司「Lemon」，但拒絕其。",
        "於第10集為免黃金開繼續為PayPayDuck眾人添亂自願跟進黃金開的實習",
        "於第11集及時察覺阿米巴打算抄襲PayPayDuck的構思和內容，和Kenneth趕走阿米巴等人",
        "於第12集以葉念信在大學向Shirley表白的影片取代原本Tony提議，成功為PayPayDuck宣傳",], id: "hannachanx", actor: "陳漢娜", char: "蒙嘉玲", ig: "hannachanx", img: [
          "https://upload.cc/i1/2022/01/29/JBXGEU.jpeg",
          "https://upload.cc/i1/2022/01/30/tzx3XZ.png",
          "https://upload.cc/i1/2022/01/30/Cr6Wp3.png",
          "https://upload.cc/i1/2022/01/30/IAUNsJ.png",
          "https://upload.cc/i1/2022/01/30/BuHdEQ.png",
          "https://upload.cc/i1/2022/01/30/9lt1NH.png",
          "https://upload.cc/i1/2022/01/30/NkD2V0.png",
        "https://upload.cc/i1/2022/01/31/KSfyHG.png"
      ]
    },
    {
      history: ["Kenneth",
        "Born Hub創辦人、PayPayDuck創業導師及Science University講師",
        "Joesep之孿生弟弟",
        "早年因「智能果汁機」和「磁能線」項目涉嫌欺騙投資者，和Joesep在初創界臭名遠播",
        "容美娟之前男友",
        "擁有餘香酒樓一半股權及PayPayDuck一成股權",
        "數月前把餘香酒樓改裝成Born Hub，於第1集招攬創業人士",
        "於第11集安排阿米巴參觀PayPayDuck，在蒙玲提示下察覺阿米巴打算抄襲PayPayDuck，和蒙玲趕走阿米巴",
        "人物原型：趙公亮",], id: "kakisham", actor: "岑珈其", char: "趙家俊 Kenneth", ig: "kakisham", img: [
          "https://upload.cc/i1/2022/01/29/h2duV6.jpeg",
          "https://upload.cc/i1/2022/01/30/e0vPNT.png",
          "https://upload.cc/i1/2022/01/30/0Rla2M.png",
          "https://upload.cc/i1/2022/01/30/xvV2ez.png",
        ]
    },
    {
      history: ["女B",
        "女權分子",
        "葉念信之下屬",
        "Billy之鬥氣冤家",
        "於第2集加入PayPayDuck",
        "於第5集被Billy爆出在新加坡工作時的醜聞，被指控在新加坡工作時誣衊上司性騷擾Greta，但實情是被上司性騷擾的Greta在上庭時改變口供，誣衊她教唆其誣衊上司",
        "於第9集重遇Greta，受其啟發創立SheIT及成功研發ITouchU應用程式",
        "於第10集允許Shirley加入SheIT，但在第15集被其背叛並成為網上挑戰的替罪羔羊逐出SheIT",], id: "yoshi", actor: "余逸思", char: "女B", ig: "yoshi.1c", img: [
          "https://upload.cc/i1/2022/01/29/BsIaUD.jpeg",
        "https://upload.cc/i1/2022/01/30/wmf6WE.png",
        "https://upload.cc/i1/2022/01/31/7CJnao.png"
      ]
    },
    {
      history: ["西毒、男B",
        "黑客兼程式編寫員",
        "葉念信之遊戲好友和下屬",
        "Billie之鬥氣冤家",
        "於第2集加入PayPayDuck",
        "於第7集將Shirley喜帖以兩層傳遞方式傳送給數萬人，導致Shirley被指控欺騙粉絲金錢及令PayPayDuck被誤以為是欺詐程式",
        "於第8集被眾人發現因多年前搞垮網購平台而被各大雲端平台封鎖導致PayPayDuck不能使用雲端服務",], id: "chancharmman", actor: "陳湛文", char: "男B、西毒", ig: "chancharmman", img: [
          "https://upload.cc/i1/2022/01/29/1GExCu.jpeg",
          "https://upload.cc/i1/2022/01/30/TMvUar.png",
          "https://upload.cc/i1/2022/01/30/kVisdp.png",
          "https://upload.cc/i1/2022/01/30/gEhoHL.png",
          "https://upload.cc/i1/2022/01/30/kmeZnL.png",
      ]
    },
    {
      history: ["星之子",
        "Never之上司",
        "於第12集為反擊PayPayEgg提出讓葉念信裸跑作惡俗行銷，導致二人被拘留",
        "於第13集為令PayPayDuck取得雅典娜投資建議黃金開和喬子琳建立關係",
        "人物原型：陳易希",], id: "llokmann", actor: "楊樂文", char: "星之子Tony Chan", ig: "llokmann", img: [
          "https://upload.cc/i1/2022/01/29/Njo0qP.jpeg",
          "https://upload.cc/i1/2022/01/30/VkCU7L.png",
          "https://upload.cc/i1/2022/01/30/9x7dEb.png",
          "https://upload.cc/i1/2022/01/30/4vm79b.png",
        "https://upload.cc/i1/2022/02/02/8xwbqM.png",
        "https://upload.cc/i1/2022/02/02/skYdpD.png",
      ]
    },
    {
      history: ["Never",
        "Tony之下屬",
        "前遊戲設計師，現為程式編寫員",
        "性格負面",
        "於第2集加入Born Hub",
        "於第9集成功研發TouchWood應用程式",], id: "frankie", actor: "陳瑞輝", char: "林常樂、Never", ig: "frankie729", img: [
          "https://upload.cc/i1/2022/01/29/dLm6hv.jpeg",
          "https://upload.cc/i1/2022/01/30/RPrU7W.png",
          "https://upload.cc/i1/2022/01/30/6AMn7W.png",
          "https://upload.cc/i1/2022/01/30/DgvPrR.png",
          "https://upload.cc/i1/2022/01/30/VnP0wZ.png",
          "https://upload.cc/i1/2022/01/30/YxrFbe.png",
      ]
    },
    {
      history: ["患有侏儒症的插畫師", "於第5集將畫作「披皮」以NFT售出而一夜致富", "於第6集注資Born Hub"], id: "victorbb", actor: "鄧子超", char: "Johnny仔", ig: "victorbb", img: [
      "https://upload.cc/i1/2022/01/29/jmD9On.jpeg",
      "https://upload.cc/i1/2022/01/30/mjFWhg.png"
      ]
    },
    {
      history: ["開開",
        "富三代",
        "富三代講座學員",
        "對蒙玲有好感",
        "於第9集擔任水母創投主席，注資PayPayDuck，並要求成為實習生",
        "於第13集應Tony要求和喬子琳建立關係以取得雅典娜投資",
        "講座學員",
        "Science University校董",
        "對蒙玲有好感",
        "於第10集注資PayPayDuck，並要求成為實習生",], id: "locker", actor: "林家熙", char: "黃金開", ig: "locker_94", img: [
          "https://upload.cc/i1/2022/01/30/50TDn2.png",
          "https://upload.cc/i1/2022/01/30/mYncvJ.png",
          "https://upload.cc/i1/2022/01/30/amwo2C.png",

      ]
    },
    {
      history: ["數據港首席項目總監，於第8集辭任，加入水母創投",
        "畢業於Science University",
        "評審之一",
        "於第8集被開父委託看管黃金開以換取他資助水母創投，同集向葉念信解釋刻意在比賽中淘汰PayPayDuck是為了自己跟進PayPayDuck",
        "於第15集暗中為PayPayDuck解除公關災難，並夥同Linda助手揭發Linda涉嫌詐騙及虧空公款令其被捕",
        "於第15集被開父從水母創投辭退",], id: "kearenpang", actor: "彭秀慧", char: "Cathy Ho", ig: "kearenpang", img: [
          "https://upload.cc/i1/2022/01/30/Ly4ebK.png",
          "https://upload.cc/i1/2022/01/30/FySxlm.png"]
    },]
},
{
  props: "Louvitation & WOW", data: [{
    history: ["葉念信之大學同學和好兄弟",
      "於第11集交代被九龍銀行裁員後創辦Loutivation",
      "於第11集受葉念信所託為Tony、Billy及Billie進行「Loutivation」，但實際上是為取得PayPayDuck機密內容並抄襲其，取名PayPayEgg，於第12集發行。並在同集因而和葉念信決裂。",
      "人物原型：車志健",
      "諧音：老吹"], id: "siumong", actor: "周祉君", char: "Lou Chui", ig: "siumong", img: [
        "https://upload.cc/i1/2022/01/30/9BvtZS.png",
        "https://upload.cc/i1/2022/01/30/AeiV0W.png",
        "https://upload.cc/i1/2022/01/30/kb2NLJ.png"
    ]
  },
    {
      history: ["PayPayEgg員工",
        "WOW創辦人之一",
        "在麻省理工大學認識Issac, Timothee",
        "三人英文名字頭為MIT",
        "畢業於美國麻省理工大學",
        "計劃開發「Ice Breaker」共享風火輪並參加「初創有明天」比賽",
        "於第4集打算借接送Cathy Ho遊說她獲得參賽資格",
        "於第9集被控不誠實使用電腦而被判社會服務令",
        "於第11集起到Loutivation工作",
        "第12集加入PayPayEgg",], id: "stanleysc", actor: "邱士縉", char: "Marcus", ig: "stanleysc_", img: [
          "https://upload.cc/i1/2022/01/30/MOdwQL.png",
          "https://upload.cc/i1/2022/01/30/rR47WP.png",
          "https://upload.cc/i1/2022/01/30/9SxjYR.png"
      ]
    },
    {
      history: ["WOW員工",], id: "roserosemama", actor: "馬俊怡", char: "Coel", ig: "roserosemama", img: ['https://upload.cc/i1/2022/01/31/Y5gx9z.png', 'https://upload.cc/i1/2022/01/31/Wa3zJl.png']
    },
    {
      history: ["WOW創辦人之一",
        "在麻省理工大學認識Marcus, Issac",
        "三人英文名字頭為MIT",], id: "matthewthehan", actor: "幸卓輝", char: "Timothee", ig: "matthewthehan", img: ["https://upload.cc/i1/2022/01/30/bCOKx3.png"],
    },
    {
      history: ["WOW創辦人之一",
        "在麻省理工大學認識Marcus, Timothee",
        "三人英文名字頭為MIT",], id: "alanlongjai", actor: "李添朗", char: "Issac", ig: "alan_long_jai", img: ["https://upload.cc/i1/2022/01/30/7SNlWE.png"]
    },
  { id: "alvinwanwingkit", actor: "溫詠傑", char: "溫詠傑", ig: "alvinwanwingkit", },]
},
{
  props: "九龍銀行 & 富三代", data: [{
    history: ["富三代互助協會社工",], id: "lulutung", actor: "董嘉儀", char: "何姑娘", ig: "lulutung", img: [
      "https://upload.cc/i1/2022/01/30/bEu2mz.png",
      "https://upload.cc/i1/2022/01/30/vZUyrc.png",
    ]
  },
    {
      history: ["富三代講座見工導師",
        "於第4集因策劃綁架「富三代」導師及學員而被捕",], id: "siuyea_lo", actor: "盧鎮業", char: "Tommy", ig: "siuyea_lo", img: ["https://upload.cc/i1/2022/01/30/CiEYIp.png"]
    },
    {
      history: ["富三代",
        "講座學員",], id: "atm", actor: "譚澔天", char: "Anson", ig: "616atm", img: ["https://upload.cc/i1/2022/01/30/rml5Og.png"]
    },
    {
      history: ["HR部阿姐",
        "吳盈如- 經阿姐本人確認",
        "於第1集由九龍銀行裁走裁葉念信",
        "第11集由九龍銀行裁走Lou Chui",], id: "ivyhkactress", actor: "彭珮嵐", char: "吳盈如, HR阿姐", ig: "ivy_hkactress", img: [
          "https://upload.cc/i1/2022/01/30/eQGfzJ.png",
          "https://upload.cc/i1/2022/01/30/kobmUH.png",
      ]
    },
    {
      history: ["IT部同事，葉念信之下屬",], id: "cheongfat", actor: "徐浩昌", char: "阿保", ig: "cheongfat", img: [
        "https://upload.cc/i1/2022/01/30/k7aq59.png"
      ]
    },
    {
      history: ["IT部同事，葉念信之下屬",], id: "shiincheung", actor: "張毓軒", char: "張毓軒", ig: "shiincheung", img: [
        "https://upload.cc/i1/2022/01/30/QSM6h2.png"
      ]
    },
    { history: ["IT部同事，葉念信之下屬",], id: "pixelivan", actor: "謝俊霆", char: "謝俊霆", ig: "pixelivan", img: ["https://upload.cc/i1/2022/01/30/2awSoC.png"] },
    {
      history: ["IT部同事，葉念信之下屬",], id: "iamkevli", actor: "李傑樺", char: "李傑樺", ig: "iamkevli", img: [
        "https://upload.cc/i1/2022/01/30/uGFRET.png"
      ]
    },]
},
{
  props: "特別演出", data: [{
    history: ["華仔、John（第5集）",
      "15年前曾在數據港將「星之子」榮譽頒予Tony",], id: "johntsangpage", actor: "曾俊華", char: "華仔", ig: "johntsangpage", img: [
        "https://upload.cc/i1/2022/01/30/l0iYkW.png"
    ]
  },
    {
      history: ["被貼堂",], id: "fungblackandwhite", actor: "馮德倫", char: "馮德倫", ig: "fungblackandwhite", img: [
        "https://upload.cc/i1/2022/01/30/SVsM6o.png"
      ],
    },]
},
{
  props: "其他", data: [{ id: "aerochow", actor: "周開盛", char: "Simon", ig: "aerochow", img: ["https://upload.cc/i1/2022/01/30/VpPIdj.png"], },
    {
      history: ["葉念信父親（第1-2,7,13集）",
        "郵差，因自己當年向父親提出創業令其氣得心臟病發死亡而反對葉念信創業",], id: "wingcheong", actor: "羅永昌", char: "信父", ig: "wingcheong.law", img: [
          "https://upload.cc/i1/2022/01/30/lX145c.png",
          "https://upload.cc/i1/2022/01/30/PNiqa0.png"
      ],
    },
    {
      history: ["喬山河女兒（第13集）",
        "暗戀黃金開",
        "於第13集成為PayPayEgg實習生",
        "人物原型：喬子琳（護花危情）",], id: "sabrinasa", actor: "張蔓莎", char: "喬子琳", ig: "sabrinasa", img: [
          "https://upload.cc/i1/2022/01/30/Oo6KXU.png",
          "https://upload.cc/i1/2022/01/30/fNdGFx.png"
      ],
    },
    {
      history: ["Science University學生（第2-4,7,10,12-15集）",
        "被Kenneth針對，多番投訴不果",
        "於第13集加入PayPayEgg實習",], id: "jeffreyngai", actor: "魏浚笙", char: "Jayden", ig: "jeffreyngai", img: [
          "https://upload.cc/i1/2022/01/30/UxTuWz.png",
          "https://upload.cc/i1/2022/01/30/45lGtW.png"
      ],
    },
    {
      history: ["烹飪頻道CookCookGuide實況主",
        "葉念信之前女友",
        "於第7集計劃與Ryan舉行婚禮並成為PayPayDuck首名用家，但被葉念信發現Ryan出軌而取消，同時因為PayPayDuck誤將喜帖發送予數萬人收取人情被指控欺騙粉絲金錢而名聲受創，反目要求葉念信賠償",
        "於第10集以投資和借出場地為由讓Billie允許其加入SheIT",
        "在第15集和陽光社Linda合作，發起網上挑戰提升大眾對受欺壓女性的關注。但因為Linda捲入欺詐和虧空公款的醜聞，活動受波及被網民抨擊，誣衊Billie未有停止活動並動議把其逐出SheIT",], id: "anjaylia", actor: "陳嘉寶", char: "Shirley", ig: "anjaylia", img: [
          "https://upload.cc/i1/2022/01/30/jfkeNA.png",
          "https://upload.cc/i1/2022/01/30/x7L0t8.png",
          "https://upload.cc/i1/2022/01/30/ezAhg1.png"
      ],
    },
    {
      history: ["Joesep",
        "Kenneth之孿生哥哥",
        "早年因「智能果汁機」和「磁能線」項目涉嫌欺騙投資者，和Kenneth在初創界臭名遠播",
        "擁有餘香酒樓一半股權，於第10集因需資金周轉而打算賣盤，後打消念頭",
        "人物原型：趙公允",], id: "mixsonwong", actor: "黃寶漳", char: "趙家升", ig: "mixsonwong",
    },
    {
      history: ["蒙玲之前男友（第3,6集）",
        "視蒙玲為賺錢工具，不斷為她接設計生意賺錢來養活自己",
        "於第7集企圖挖角蒙玲到自己在德國開設的廣告公司「Lemon」，但被拒",], id: "wongyatho", actor: "黃溢濠", char: "蒙玲XBF", ig: "wongyatho", img: [
          "https://upload.cc/i1/2022/01/30/HKxdzi.png"
      ],
    },
    {
      history: ["娟娟（趙家俊暱稱）",
        "趙家俊之前女友",
        "This Desk創辦人之一",
        "第三屆初創有明天比賽評審之一",], id: "linkuen", actor: "練美娟", char: "容美娟", ig: "linkuen13", img: ['https://upload.cc/i1/2022/01/31/AIf8oj.png']
    },
    {
      history: ["擁有過百萬追蹤者的環保KOL（第8集）",
        "於第8集舉行婚禮並成為PayPayDuck首名用家",], id: "misselvani", actor: "倪晨曦", char: "Charlotte", ig: "misselvani", img: ["https://upload.cc/i1/2022/01/30/iLxdHG.png"]
    },
    {
      history: ["黑客（第8-10,12集）",
        "Billy之遊戲好友",
        "地下雲端創辦人",
        "於第8集從Billy索要兩張9.5分遊戲卡牌換取協助PayPayDuck進行保安系統測試及向PayPayDuck提供雲端服務",
        "於第9集被控不誠實使用電腦而被判社會服務令",
        "於第12集交代在PayPayDuck程式碼中放入了程式炸彈，可以炸毀系統和PayPayDuck一模一樣的PayPayEgg",
        "於第15集先後根據PayPayEgg和Cathy Ho要求指揮「打手」攻擊和唱好PayPayDuck",], id: "gladys", actor: "李靖筠", char: "東邪", ig: "gladys.li", img: [
          "https://upload.cc/i1/2022/01/30/Jl0KSq.png",
          "https://upload.cc/i1/2022/01/30/IphVX3.png"
      ]
    },
    {
      history: ["於第11集在Lou的回憶中成為Lou的人生導師（第11集）",], id: "alinaln", actor: "李炘頤", char: "Susanna", ig: "alinaln_", img: ["https://upload.cc/i1/2022/01/31/hFgcsA.png", "https://upload.cc/i1/2022/01/31/5glthE.png"]
    },
    {
      history: ["澳門殘障女畫家（第9-10集）",
        "於第9集被Johnny仔指控侵權，最後庭外和解，並向Johnny仔道歉及賠償",], id: "bubermak", actor: "麥詠楠", char: "澳門女畫家", ig: "bubermak", img: [
          "https://upload.cc/i1/2022/01/30/Tr9p1F.png",
          "https://upload.cc/i1/2022/01/30/Qp49iy.png"
      ],
    },
    {
      history: ["笑容識別鎖職員（第5集）", "一講到食就覺得肚餓",], id: "cheeth", actor: "張滿源", char: "笑容識別所研發者", ig: "cheungmoonyuenkenneth", img: [
        "https://upload.cc/i1/2022/01/30/pdvhjZ.png"
      ]
    },
    { history: ["阿米巴公司員工，藉詞參觀PayPayDuck打算抄襲他們，最終被蒙玲及Kenneth揭發而失敗（第11集）",], id: "tinchakleung", actor: "梁天尺", char: "阿米巴Kenneth", ig: "tinchakleung", },
  { id: "Edwardthk", actor: "鄧浩炯", char: "試酒職員", ig: "Edwardthk", },
  { id: "chun123hk", actor: "膠樽", char: "地產經紀", ig: "chun123hk", },
  { id: "ryuichi", actor: "井川龍一", char: "球場小霸王", ig: "ryuichi0324", },
  { id: "rexleyxraina", actor: "鏗鏗", char: "Rexley", ig: "rexley_x_raina", },
    { id: "ballfaiyau", actor: "波輝", char: "侍應 (波輝)", ig: "ballfaiyau", img: ["https://upload.cc/i1/2022/01/30/ChI5DF.png"], },
    {
      id: "gabrielch", actor: "雞髀", char: "NFT代表", ig: "gabrielch_n", img: [
        "https://upload.cc/i1/2022/01/30/ZEPi3K.png"
      ],
    },
    {
      history: ["速遞員（第2集）",], id: "deansiu", actor: "邵子風", char: "速遞員", ig: "deansiu", img: [
        "https://upload.cc/i1/2022/01/30/hV7R2K.png"
      ],
    },
    {
      history: ["派帖男",], id: "jimsiujim", actor: "英健朗", char: "派帖男", ig: "jimsiujim", img: [
        "https://upload.cc/i1/2022/02/02/6UdvcD.png",
        "https://upload.cc/i1/2022/01/30/0PUBMj.png"],
    },
    {
      history: ["Hot Desk仔（第2集）",], id: "johnee", actor: "劉冠瑤", char: "觸電男", ig: "johnee_lau", img: [
        "https://upload.cc/i1/2022/01/30/tXPLHl.png",
        "https://upload.cc/i1/2022/01/30/c73jiq.png"
      ],
    },
    {
      id: "zachary", actor: "翁煒桐", char: "侍應 (翁煒桐)", ig: "zachary2ung", img: ["https://upload.cc/i1/2022/02/01/PaQXBd.png"]
    },
    {
      id: "kinlongchan", actor: "陳健朗", char: "紅磡喪彪", ig: "kinlongchan", img: ["https://upload.cc/i1/2022/02/01/iNdUux.png", "https://upload.cc/i1/2022/02/01/6wG10n.png"], history: ["殯儀業龍頭（第14集）", "和PayPayDuck有合作計劃"]
    },
    {
      id: "chingyanfu", actor: "程仁富", char: "阿孝", ig: "chingyanfu", img: ["https://upload.cc/i1/2022/02/01/t9AZTL.png", "https://upload.cc/i1/2022/02/01/EKM6tx.png", "https://upload.cc/i1/2022/02/01/nqxzoE.png"], history: ["PayPayDuck用家"]
    },
    {
      id: "yeungyingwai", actor: "楊英偉", char: "喬山河", ig: "", img: ["https://upload.cc/i1/2022/02/01/VkDa6F.png"], history: ["經營雅典娜婚禮策劃公司，是行內龍頭", "和PayPayEgg有合作計劃", "人物原型：喬江山、喬江河"]
    },
    {
      id: "dear_himmy", actor: "朱謙", char: "萬鈞", ig: "dear_himmy", img: [
        "https://upload.cc/i1/2022/02/02/EpwzJh.png",
        "https://upload.cc/i1/2022/02/02/SbWmZz.png",
      ], history: ["白鯨創投主席"]
    },
    {
      id: "alextokong", actor: "杜港", char: "Greg", ig: "alextokong", img: [
        "https://upload.cc/i1/2022/02/02/KYWkBi.png",
        "https://upload.cc/i1/2022/02/02/LNd5m1.png"
      ], history: ["原為教師，後加入水母創投接替Cathy Ho負責看管黃金開（第16集）"]
    },
    {
      id: "belindayan", actor: "顏子菲", char: "Linda", ig: "belindayan", img: [
        "https://upload.cc/i1/2022/02/02/bspiGz.png",
        "https://upload.cc/i1/2022/02/02/jyY4hg.png",
      ], history: ["慈善團體陽光社主席，擅長碰瓷公關（第15集）", "第15集被其助手揭發涉嫌詐騙及虧空公款而被捕"]
    },
    {
      id: "thomas_lam", actor: "林祖輝", char: "開父", ig: "", img: [
        "https://upload.cc/i1/2022/02/02/rLdTG9.png",
        "https://upload.cc/i1/2022/02/02/KUqiWe.png"
      ], history: ["富二代，黃金開之父", "於第15集宣布停止為水母創投注資並辭退Cathy Ho"]
    },
    {
      id: "joanna_lamlam", actor: "陳琳琳", char: "7號檯賓客", ig: "joanna_lamlam", img: [
        "https://upload.cc/i1/2022/02/02/XptzMG.png"
      ], history: ["借了人情錢給葉念信"]
    },
    {
      id: "boyboy",
      actor: "boyboy",
      char: "真。IT狗boyboy",
      ig: "",
      img: [
        "https://upload.cc/i1/2022/02/02/drpFR6.png",
        "https://upload.cc/i1/2022/02/02/cmivZW.png",
      ],
      history: ["真是IT狗"]
    }
  ]
},];

const transformLinks = option => ({
  ...option,
  onClick:
    option.href && !option.onClick
      ? e => {
        e.preventDefault();
        if (
          window.confirm(
            `This will open a new tab to ${option.href}, is that okay?`
          )
        ) {
          window.open(option.href);
        }
      }
      : option.onClick
});

const startMenu = (injectedData = [], set, shutDown) => [
  [
    ...injectedData,
  ],
  {
    title: "關機...",
    icon: icons.shutdownCustom,
    onClick: shutDown,
  }
];

export const addIdsToData = data =>
  Array.isArray(data)
    ? data.map(d => {
      if (Array.isArray(d)) {
        return addIdsToData(d);
      }
      return {
        ...transformLinks(d),
        id: d.id || nanoid(),
        options: addIdsToData(d.options)
      };
    })
    : undefined;

const desktopWithIds = (desktopData = []) =>
  addIdsToData(desktopData).map(entry => {
    const { onClick, ...data } = entry;
    return {
      ...data,
      onDoubleClick: onClick
    };
  });

const mapActions = (open, doubleClick) => entry => {
  if (Array.isArray(entry)) {
    return initialize(open, entry);
  }
  const { onClick, ...nestedData } = entry;
  const onClickAction = !entry.options
    ? (...params) => {
      if (Applications[entry.component]) {
        open(entry);
      }
      if (entry.onClick) {
        entry.onClick(...params);
      }
      if (entry.onDoubleClick) {
        entry.onDoubleClick(...params);
      }
    }
    : undefined;
  return {
    ...nestedData,
    onClick: !doubleClick ? onClickAction : undefined,
    onDoubleClick: doubleClick ? onClick : undefined,
    options: initialize(open, entry.options)
  };
};

export const initialize = (open, data, doubleClick) => {
  const mapFunc = mapActions(open, doubleClick);
  return Array.isArray(data) ? data.map(mapFunc) : undefined;
};

const buildDesktop = (desktopData, open) => [
  ...initialize(p => open()(p), desktopWithIds(desktopData)).map(entry => {
    const { onClick, ...data } = entry;
    return {
      ...data,
      onDoubleClick: onClick
    };
  })
];

class ProgramProvider extends Component {
  static defaultProps = {
    startMenuData,
    desktopData
  };
  static contextType = SettingsContext;
  static socket;
  state = {
    programs: Object.keys(Applications).reduce(
      (acc, p) => ({
        ...acc,
        [p]: { ...Applications[p], programId: nanoid() }
      }),
      {}
    ),
    startMenu: initialize(
      p => this.open(p),
      addIdsToData(
        startMenu(
          this.props.startMenuData,
          () => this.toggleShutDownMenu()
        )
      )
    ),
    desktop: buildDesktop(this.props.desktopData, () => this.open),
    activePrograms: {},
    openOrder: [],
    zIndexes: [],
    settingsDisplay: false,
    shutDownMenu: false,
    offlineCachedVotes: {},
    api: {
      actors: actors,
      s2: s2,
      localvotes: {},
      cachedvotes: {},
      displayvotes: {},
      vote: (who) => this.vote(who),
      getSnapshot: async () => await this.getSnapshot()
    },
    otherProjects: otherProjects,
  };

  componentDidMount() {
    this.connect();
    // OPEN ALL TABS
    if (this.props.desktopData.length > 0) {
      const _d = this.props.desktopData.map(d => {
        d.id = nanoid();
        d.onDoubleClick = undefined;
        d.options = undefined;
        d.onClick = () => { };
        return d;
      });
      this.setState(() => ({
        desktop: buildDesktop(_d, () => this.open)
      }));
      // Cookies.get('visited') ? this.open(_d[3]) : this.open(_d[4]);
      // if (!Cookies.get('visited')) Cookies.set('visited', Date.now())
      this.open(_d[6]);

    }
    //   _d.map(x => {
    //     if (x.component) {
    //     }
    //   });
    // }
    // const desktopSaved = JSON.parse(window.localStorage.getItem("desktop"));
    // if (desktopSaved) {
    //   this.setState(() => ({
    //     desktop: buildDesktop(desktopSaved, () => this.open)
    //   }));
    // }
  }


  getSnapshot = async () => {
    const res = await axios.get("https://api.itdoghr.com/snapshot");
    this.update(res.data);
    return res;
  };

  connect = () => {
    if (typeof this.socket !== 'object') {
      this.socket = io("https://api.itdoghr.com", { transports: ['websocket', 'polling'] });
    }
    if (!ready) {
      this.socket.on("connect", () => {
        ready = true;
      });
    }
    axios.get("https://api.itdoghr.com/snapshot").then(res => {
      this.update(res.data);
      this.socket.on("diff", (data) => this.update(data));
      if (Object.keys(this.state.offlineCachedVotes) > 0) {
        const fkey = Object.keys(this.state.offlineCachedVotes)[0];
        this.socket.emit("vote", this.state.offlineCachedVotes[fkey]);
        let _offlineCachedVotes = this.state.offlineCachedVotes;
        delete _offlineCachedVotes[fkey];
        this.setState({
          offlineCachedVotes: _offlineCachedVotes
        });
      }
    });
  };

  vote = (who) => {
    let _localvotes = this.state.api.localvotes;
    _localvotes[who] = _localvotes[who] ? _localvotes[who] + 1 : 1;
    let _displayvotes = this.state.api.displayvotes;
    _displayvotes[who] = _displayvotes[who] ? _displayvotes[who] + 1 : 1;
    this.setState({
      localvotes: _localvotes,
      displayvotes: _displayvotes,
    });
    if (currentlySendingTo !== '' && currentlySendingTo !== who && currentlyVoteCount !== 0) {
      this.send(currentlySendingTo, currentlyVoteCount);
      currentlyVoteCount = 0;
    }
    clearTimeout(timeout);
    currentlySendingTo = who;
    currentlyVoteCount++;
    if (currentlySendingTo !== '' && currentlyVoteCount > 9) {
      this.send(currentlySendingTo, currentlyVoteCount);
      return currentlyVoteCount = 0;
    }
    timeout = setTimeout(() => {
      this.send(currentlySendingTo, currentlyVoteCount);
      currentlyVoteCount = 0;
    }, 1000);
  };

  send = (to, count) => {
    let _localvotes = this.state.api.localvotes;
    if (this.socket.disconnected) {
      let _offlineCachedVotes = this.state.offlineCachedVotes;
      _offlineCachedVotes[to] = this.state.offlineCachedVotes[to] ? this.state.offlineCachedVotes[to] + count : count;
      this.setState({
        offlineCachedVotes: _offlineCachedVotes
      });
      ready = false;
      this.connect();
    }
    if (ready) {
      if (this.context.isActive) {
        this.socket.emit("vote", {
          to: to,
          count: count
        });
      }
      _localvotes[to] = 0;
      this.setState({
        localvotes: _localvotes
      });
    }
  };

  update = (d) => {
    let _cachedvotes = this.state.api.cachedvotes;
    let _localvotes = this.state.api.localvotes;
    let _displayvotes = this.state.api.displayvotes;

    Object.keys(d).forEach(k => {
      var oldCachedVote = _cachedvotes[k] || 0;
      var newDiff = d[k] - oldCachedVote;
      _displayvotes[k] = d[k] + (_localvotes[k] ? _localvotes[k] : 0);
      _localvotes[k] = _localvotes[k] ? _localvotes[k] - newDiff : 0;
      if (_localvotes[k] < 0) { _localvotes[k] = 0; }
      _cachedvotes[k] = d[k];
      this.setState({
        localvotes: _localvotes,
        cachedvotes: _cachedvotes,
        displayvotes: _displayvotes,
      });
    });
  };

  toggleShutDownMenu = () =>
    this.setState(state => ({ shutDownMenu: !state.shutDownMenu }));
  toggleTaskManager = () =>
    this.setState(state => ({ taskManager: !state.taskManager }));
  toggleSettings = val =>
    this.setState(state => ({
      settingsDisplay: val || !state.settingsDisplay
    }));

  shutDown = () => {
    const desktop = document.querySelector(".desktop");
    if (desktop) {
      desktop.innerHTML = "";
      desktop.classList.add("windowsShuttingDown");
      setTimeout(() => {
        desktop.classList.replace(
          "windowsShuttingDown",
          "itIsNowSafeToTurnOffYourComputer"
        );
        window.localStorage.removeItem("loggedIn");
      }, 3000);
    }
  };

  isProgramActive = programId =>
    this.state.activePrograms[programId];

  moveToTop = windowId => {
    this.setState({
      activePrograms: {
        ...this.state.activePrograms,
        [windowId]: {
          ...this.state.activePrograms[windowId],
          minimized: false,
        },
      },
      activeId: windowId,
      zIndexes: [
        ...this.state.zIndexes.filter(v => v !== windowId),
        windowId,
      ],
    });
  };

  open = (program, options = {}) => {
    event('Programs', `${program.title}`, 'Program');
    // @todo use id instead to avoid weird open handling
    // @todo rename launch to handle multi-window programs
    if (!Applications[program.component]) {
      return;
    }
    if (this.isProgramActive(program.id) && !program.multiInstance) {
      this.moveToTop(program.id);
      return;
    }
    const newProgram = {
      ...program,
      id: nanoid(),
      data: options.new ? {} : program.data,
      title: options.new ? program.component : program.title
    };
    this.setState({
      activePrograms: {
        ...this.state.activePrograms,
        [newProgram.id]: newProgram,
      },
      openOrder: [...this.state.openOrder, newProgram.id],
      zIndexes: [...this.state.zIndexes, newProgram.id],
      activeId: newProgram.id
    });
  };

  close = (program, exit) => {
    if (!this.isProgramActive(program.id)) {
      return;
    }
    const taskBar = this.state.openOrder.filter(p => p !== program.id);
    this.setState({
      openOrder: taskBar,
      zIndexes: this.state.zIndexes.filter(p => p !== program.id),
    });

    if (!program.background || exit) {
      this.exit(program.id);
    }
  };

  exit = programId =>
    this.setState({
      activePrograms: Object.keys(this.state.activePrograms).reduce((acc, val) => {
        if (programId !== val) {
          return {
            ...acc,
            [val]: this.state.activePrograms[val],
          };
        }
        return acc;
      }, {}),
      activeId: null,
    });

  minimize = programId => {
    if (!this.state.activePrograms[programId]) {
      return;
    } else {
      this.setState({
        activePrograms: {
          ...this.state.activePrograms,
          [programId]: {
            ...this.state.activePrograms[programId],
            minimized: true,
          },
        },
        activeId: null
      });
    }
  };
  minimizeAll = () =>
    this.setState(state => ({
      activePrograms: Object.keys(state.activePrograms).reduce((acc, val) => ({
        ...state.activePrograms,
        [val]: {
          ...state.activePrograms[val],
          minimized: true,
        }
      }), {}),
      activeId: null
    }));

  save = (prog, data, title, location = "desktop") => {
    const mapFunc = mapActions(this.open, location === "desktop");
    const existing = this.state[location].find(
      p => p.title === title || p.id === prog.id
    );
    if (existing) {
      return this.setState(
        state => {
          const filtered = state[location].filter(
            p => p.title !== existing.title
          );
          const updated = {
            ...existing,
            data,
            updated: true
          };
          return {
            [location]: [
              ...filtered,
              mapFunc({
                ...updated,
                onClick: () => this.open(updated)
              })
            ]
          };
        },
        () => this.saveLocally(location)
      );
    } else {
      const newProg = {
        ...prog,
        data: {
          ...data,
          readOnly: false
        },
        title,
        newFile: true,
        id: nanoid(),
        readOnly: false
      };
      return this.setState(
        state => ({
          [location]: [
            ...state[location],
            {
              ...mapFunc({
                ...newProg,
                onClick: () => this.open(newProg)
              })
            }
          ]
        }),
        () => this.saveLocally(location)
      );
    }
  };

  saveLocally = loc =>
    window.localStorage.setItem(loc, JSON.stringify(this.state[loc]));

  render() {
    return (
      <ProgramContext.Provider
        value={{
          ...this.state,
          isActive: this.context.isActive,
          onOpen: this.open,
          onClose: this.close,
          moveToTop: this.moveToTop,
          toggleTaskManager: this.toggleTaskManager,
          toggleSettings: this.toggleSettings,
          toggleShutDownMenu: this.toggleShutDownMenu,
          shutDown: this.shutDown,
          onMinimize: this.minimize,
          save: this.save
        }}
      >
        {this.props.children}
      </ProgramContext.Provider>
    );
  }
}

export default ProgramProvider;
