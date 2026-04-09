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
  budget: string;
  days: number;
  transport: string;
  /** 正文内嵌图片映射表：key 为正文中使用的短名称，value 为 import 的图片路径 */
  inlineImages?: Record<string, string>;
  /** 城市地理坐标 [经度, 纬度]，用于地图标注 */
  coordinates: [number, number];
  /** ISO 3166-1 数字国家代码，用于地图高亮（日本 392，法国 250，冰岛 352，瑞士 756，中国 156…） */
  countryCode: string;
}
