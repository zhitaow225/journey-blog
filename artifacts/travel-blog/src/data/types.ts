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
}
