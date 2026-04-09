import type { Post } from '../types';
import swiss1 from '../../assets/images/swiss-meadow/swiss-1.png';
import swiss2 from '../../assets/images/swiss-meadow/swiss-2.png';

export const swissMeadow: Post = {
  id: "swiss-meadow",
  title: "阿尔卑斯的薄雾",
  date: "2024-06-22",
  location: "格林德瓦，瑞士",
  weather: "阵雨转晴，18°C",
  rating: 5,
  costPerPerson: "¥5,200",
  budget: "¥10,400",
  days: 5,
  transport: "瑞士火车通票",
  coordinates: [8.04, 46.62],
  countryCode: "756",
  images: [swiss1, swiss2],
  body: `## 清晨的山谷

清晨推开木屋的门，山谷里还弥漫着浓重的薄雾。草叶上挂着晶莹的露水，远处的雪峰在云层中若隐若现。

在这里，你可以听到远处传来的**悠远牛铃声**，这是阿尔卑斯山脉独有的脉搏。

## 最值得做的事

在格林德瓦，一定要尝试这些：

- 清晨六点出门，在薄雾中徒步一小时
- 在山上的小木屋喝一碗热奶酪汤
- 什么都不做，只是坐在草地上等云散开

山里的天气变换很快，**阳光穿透云层的那一刻**，整个山谷都被染上了浅浅的金色。这是一种无法用言语完全描述的感动。`,
};
