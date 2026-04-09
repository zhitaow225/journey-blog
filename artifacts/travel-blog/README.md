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
import paris1 from '../../assets/images/paris-1.png';
import paris2 from '../../assets/images/paris-2.png';

export const parisSpring: Post = {
  id: "paris-spring",          // URL 路径：/post/paris-spring
  title: "巴黎的春天",
  date: "2025-04-10",
  location: "巴黎，法国",
  weather: "晴，18°C",
  rating: 5,
  costPerPerson: "¥4,000",
  budget: "¥8,000",
  days: 6,
  transport: "国际航班 + 地铁",
  images: [paris1, paris2],
  body: `正文内容写在这里，支持 Markdown。`,
};
```

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

正文（`body` 字段）使用 Markdown 格式，插入图片有两种方式：

### 方式一：使用公共目录（推荐）

把图片文件放入 `public/` 文件夹，例如 `public/kyoto-street.jpg`。

然后在 `body` 正文中用绝对路径引用：

```md
走过一条安静的小巷。

![巷子里的光](./kyoto-street.jpg)

转角处，一家茶屋正在开门。
```

> `public/` 中的文件会被直接部署到网站根目录，路径以 `./` 开头即可访问。

### 方式二：使用外部图片链接

直接粘贴图片的完整 URL：

```md
第一天的日落令人难忘。

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

![图片描述](./图片文件名.jpg)
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
