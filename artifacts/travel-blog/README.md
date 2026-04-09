# 旅途 · 维护手册

## 文件结构

```
src/data/
├── types.ts                  — Post 接口定义（字段类型在这里改）
├── posts.ts                  — 入口，保持不动
└── posts/
    ├── index.ts              — 汇总所有文章，控制首页顺序
    ├── kyoto-morning.ts      — 单篇文章文件（每篇一个）
    ├── provence-light.ts
    ├── iceland-silence.ts
    ├── swiss-meadow.ts
    └── tokyo-rain.ts

public/                       — 静态资源，图片放这里可直接在正文引用
src/assets/images/            — 封面图（首页缩略图 + 详情页画廊用）
```

---

## 修改文章

打开对应文件（如 `src/data/posts/kyoto-morning.ts`），直接编辑各字段：

| 字段            | 说明                         |
| --------------- | ---------------------------- |
| `title`         | 文章标题                     |
| `date`          | 日期，格式 `YYYY-MM-DD`      |
| `location`      | 地点名称（显示在卡片和详情页）|
| `weather`       | 天气描述（详情页小字）        |
| `budget`        | 总预算（详情页侧边栏）        |
| `days`          | 旅行天数                     |
| `transport`     | 交通方式                     |
| `rating`        | 推荐评分，1–5 的整数          |
| `costPerPerson` | 人均花费                     |
| `images`        | 图片数组，第一张作为封面      |
| `body`          | 正文，支持 Markdown           |

---

## 新增文章

**第一步：准备封面图**

把封面图片放入 `src/assets/images/`，文件名建议使用小写英文加连字符，例如 `paris-1.png`。

**第二步：新建文章文件**

在 `src/data/posts/` 下新建文件，例如 `paris-spring.ts`，复制已有文件的结构并修改：

```ts
import type { Post } from '../types';
import paris1 from '../../assets/images/paris-spring/paris-1.png';
import paris2 from '../../assets/images/paris-spring/paris-2.png';

export const parisSpring: Post = {
  id: "paris-spring",          // URL 路径：/post/paris-spring
  title: "巴黎的春天",
  date: "2025-04-10",
  location: "巴黎，法国",      // 格式：「城市，国家」，地图标注自动取「，」前的城市名
  weather: "晴，18°C",
  rating: 5,
  costPerPerson: "¥4,000",
  budget: "¥8,000",
  days: 6,
  transport: "国际航班 + 地铁",
  coordinates: [2.3522, 48.8566], // [经度, 纬度]，可在 Google Maps 右键复制
  countryCode: "250",             // ISO 数字国家代码，法国=250（常用代码见下表）
  images: [paris1, paris2],
  body: `正文内容写在这里，支持 Markdown。`,
};
```

> **地图自动更新**：填入 `coordinates` 和 `countryCode` 后，地图页面会自动显示该城市的光点并点亮对应国家，无需改动其他任何文件。

**常用国家代码（ISO 3166-1 数字）：**

| 国家 | 代码 | 国家 | 代码 |
|------|------|------|------|
| 中国 | 156  | 日本 | 392  |
| 法国 | 250  | 意大利 | 380 |
| 瑞士 | 756  | 西班牙 | 724 |
| 冰岛 | 352  | 英国  | 826  |
| 德国 | 276  | 美国  | 840  |
| 泰国 | 764  | 新西兰 | 554 |

**第三步：注册文章**

打开 `src/data/posts/index.ts`，加入新文章，数组顺序即首页显示顺序：

```ts
import { parisSpring } from './paris-spring';   // 新增这行

export const posts = [
  kyotoMorning,
  provenceLight,
  icelandSilence,
  swissMeadow,
  tokyoRain,
  parisSpring,    // 新增这行
];
```

---

## 删除文章

1. 从 `src/data/posts/index.ts` 的数组中删去该条目及其 import 行
2. 删除对应的 `.ts` 文件（可选）

---

## 在正文中插入图片

正文（`body` 字段）使用 Markdown 格式，插入图片有三种方式：

---

### 方式一：引用 `src/assets/images/` 中的图片（推荐）

这是和封面图相同的目录，经过 Vite 构建优化，适合高质量摄影图片。

**第一步：** 在文章文件顶部 import 图片：

```ts
import kyoto1 from '../../assets/images/kyoto-1.png';
import kyotoStreet from '../../assets/images/kyoto-street.jpg';
```

**第二步：** 在文章对象中添加 `inlineImages` 映射表，给每张图起一个短名称：

```ts
export const kyotoMorning: Post = {
  // ...其他字段...
  inlineImages: {
    "kyoto-street": kyotoStreet,   // 短名称: 导入的图片变量
    "kyoto-river": kyoto1,
  },
  body: `...`
};
```

**第三步：** 在 `body` 正文里，用短名称作为图片路径：

```md
走过一条安静的小巷。

![清晨的街道](kyoto-street)

转角处，一家茶屋正在开门。

![鸭川河畔](kyoto-river)

这是一种久违的平静。
```

> 短名称可以随意命名，只要 `inlineImages` 里的 key 和正文里写的名称一致即可。

完整示例参见 `src/data/posts/kyoto-morning.ts`。

---

### 方式二：使用 `public/` 文件夹

把图片放入 `public/` 文件夹（例如 `public/paris-cafe.jpg`），直接在正文中引用，**不需要** `inlineImages`：

```md
咖啡馆门口停着一辆旧自行车。

![巴黎咖啡馆](./paris-cafe.jpg)

窗内透出温暖的黄光。
```

> 适合临时插图或不需要构建优化的场景。

---

### 方式三：使用外部图片链接

直接粘贴图片的完整 URL，**不需要** `inlineImages`：

```md
日落时分，海面染成橙红色。

![日落](https://your-image-host.com/sunset.jpg)

第二天清晨，我们出发去山顶。
```

---

## Markdown 正文语法速查

```md
## 二级标题

普通段落文字，可以**加粗**某些词语。

- 无序列表第一项
- 无序列表第二项
- 无序列表第三项

![图片描述](图片短名称或路径)
```

---

## 调整首页顺序

编辑 `src/data/posts/index.ts`，调整数组中文章的顺序即可：

```ts
export const posts = [
  tokyoRain,       // 这篇会排在最前
  kyotoMorning,
  swissMeadow,
  // ...
];
```
