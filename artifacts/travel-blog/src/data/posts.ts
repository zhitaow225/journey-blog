export interface Post {
  id: string;
  title: string;
  date: string;
  location: string;
  body: string;
  images: string[];
  weather: string;
  rating: number;
  costPerPerson: string;
}

import kyoto1 from '../assets/images/kyoto-1.png';
import kyoto2 from '../assets/images/kyoto-2.png';
import provence1 from '../assets/images/provence-1.png';
import provence2 from '../assets/images/provence-2.png';
import iceland1 from '../assets/images/iceland-1.png';
import iceland2 from '../assets/images/iceland-2.png';
import swiss1 from '../assets/images/swiss-1.png';
import swiss2 from '../assets/images/swiss-2.png';
import tokyo1 from '../assets/images/tokyo-1.png';
import tokyo2 from '../assets/images/tokyo-2.png';

export const posts: Post[] = [
  {
    id: "kyoto-morning",
    title: "京都的清晨",
    date: "2024-11-05",
    location: "京都，日本",
    weather: "微凉，14°C",
    rating: 5,
    costPerPerson: "¥1,200",
    images: [kyoto1, kyoto2],
    body: `清晨的京都，空气里带着淡淡的松木香。

走在鸭川畔，水流声是唯一打破宁静的声响。路过一家仍在准备营业的茶屋，木质推拉门微微敞开一条缝，漏出昏黄的灯光。在这里，时间似乎走得特别慢。

不需要急着赶往下一个景点。只要停下来，喝一杯手冲抹茶，看着阳光一点点爬上町屋的屋檐，便是这一天最好的开始。这是一种久违的平静。`
  },
  {
    id: "provence-light",
    title: "蓝色海岸的三天两夜",
    date: "2024-09-12",
    location: "普罗旺斯，法国",
    weather: "晴朗，26°C",
    rating: 4,
    costPerPerson: "¥3,500",
    images: [provence1, provence2],
    body: `初秋的普罗旺斯，阳光依然热烈，却多了一份温柔。

大片的薰衣草田在微风中摇曳，空气中弥漫着浓郁的香气。住进一家石头砌成的老房子，推开带着岁月痕迹的蓝色百叶窗，外面就是连绵的丘陵。

这几天什么都没做，只是在小镇的集市上买些新鲜的奶酪和番茄，坐在院子里看日落。生活本来就该这样，简单，纯粹，被温暖的光线包裹。`
  },
  {
    id: "iceland-silence",
    title: "在世界尽头",
    date: "2024-02-18",
    location: "维克镇，冰岛",
    weather: "阴沉，-2°C",
    rating: 5,
    costPerPerson: "¥4,800",
    images: [iceland1, iceland2],
    body: `黑沙滩的风很大，夹杂着冰冷的海水气息。

眼前是灰白色的天空和深邃的北大西洋，孤独的黑教堂远远地伫立在荒原上。这是一种极致的荒凉美感，让人感到自身的渺小。

站在这里，世界安静得只剩下风声。没有色彩，没有繁杂，一切都回归到最原始的状态。在这片黑白灰交织的风景里，我找到了内心的锚点。`
  },
  {
    id: "swiss-meadow",
    title: "阿尔卑斯的薄雾",
    date: "2024-06-22",
    location: "格林德瓦，瑞士",
    weather: "阵雨转晴，18°C",
    rating: 5,
    costPerPerson: "¥5,200",
    images: [swiss1, swiss2],
    body: `清晨推开木屋的门，山谷里还弥漫着浓重的薄雾。

草叶上挂着晶莹的露水，远处的雪峰在云层中若隐若现。在这里，你可以听到远处传来的悠远牛铃声，这是阿尔卑斯山脉独有的脉搏。

泡了一壶热茶，坐在窗前发呆。山里的天气变换很快，阳光穿透云层的那一刻，整个山谷都被染上了浅浅的金色。这是一种无法用言语完全描述的感动。`
  },
  {
    id: "tokyo-rain",
    title: "东京夜雨",
    date: "2024-04-08",
    location: "东京，日本",
    weather: "细雨，12°C",
    rating: 4,
    costPerPerson: "¥2,100",
    images: [tokyo1, tokyo2],
    body: `雨水的冲刷让这座钢铁丛林变得柔软了一些。

撑着一把透明伞，走在新宿的街头。霓虹灯在湿漉漉的路面上折射出斑斓的色彩。远离了白天喧嚣的人群，深夜的东京有一种独特的迷幻感。

拐进一家还亮着灯的居酒屋，点了一碗热腾腾的关东煮。听着窗外淅淅沥沥的雨声，感受着这座庞大城市里属于自己的微小角落。`
  }
];