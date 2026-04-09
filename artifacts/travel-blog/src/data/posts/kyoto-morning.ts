import type { Post } from "../types";
import kyoto1 from "../../assets/images/kyoto-morning/kyoto-1.png";
import kyoto2 from "../../assets/images/kyoto-morning/kyoto-2.png";

export const kyotoMorning: Post = {
  id: "kyoto-morning",
  title: "京都的清晨",
  date: "2024-11-05",
  location: "京都，日本",
  weather: "微凉，14°C",
  rating: 5,
  costPerPerson: "¥1,200",
  budget: "¥4,800",
  days: 4,
  transport: "新干线",
  images: [
    kyoto1,
    kyoto2,  "https://res.cloudinary.com/dmpuvrumq/image/upload/v1775715410/test1_w15qi5.bmp",
  ],
  inlineImages: {
    street: kyoto1,
    river: kyoto2,
  },
  body: `## 在城市醒来之前

清晨五点半，鸭川的水面还没有被阳光照到。走在堤岸上，空气里带着淡淡的松木香和昨夜残留的秋意。

路过一家仍在准备营业的茶屋，木质推拉门微微敞开一条缝，漏出昏黄的灯光。在这里，**时间似乎走得特别慢**。

## 不需要去哪里

这一天的计划，只有：
![清晨的街道](street)
- 买一杯手冲抹茶
- 在鸭川边发呆
- 看阳光慢慢爬上町屋的屋檐

不需要急着赶往下一个景点。停下来，感受这座城市**呼吸的节奏**，便是最好的旅行方式。

这是一种久违的平静。`,
};
