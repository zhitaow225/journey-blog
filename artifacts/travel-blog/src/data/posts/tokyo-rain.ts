import type { Post } from '../types';
import tokyo1 from '../../assets/images/tokyo-rain/tokyo-1.png';
import tokyo2 from '../../assets/images/tokyo-rain/tokyo-2.png';

export const tokyoRain: Post = {
  id: "tokyo-rain",
  title: "东京夜雨",
  date: "2024-04-08",
  location: "东京，日本",
  weather: "细雨，12°C",
  rating: 4,
  costPerPerson: "¥2,100",
  budget: "¥4,200",
  days: 5,
  transport: "JR Pass + 地铁",
  images: [tokyo1, tokyo2],
  body: `## 雨中的城市

雨水的冲刷让这座钢铁丛林变得柔软了一些。撑着一把透明伞，走在新宿的街头。霓虹灯在湿漉漉的路面上折射出斑斓的色彩。

远离了白天喧嚣的人群，**深夜的东京有一种独特的迷幻感**。

## 一个人的深夜清单

- 拐进一家还亮着灯的居酒屋
- 点一碗热腾腾的关东煮
- 听窗外淅淅沥沥的雨声

在这座庞大城市里，**属于自己的微小角落**，往往藏在最不起眼的地方。只要放慢脚步，总会找到。`,
};
