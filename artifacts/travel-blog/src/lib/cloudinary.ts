/**
 * Cloudinary 图床工具
 *
 * 使用方式：
 *   import { cl } from '../lib/cloudinary';
 *   const url = cl('my-folder/photo1');          // 自动优化 URL
 *   const thumb = cl('my-folder/photo1', 800);   // 指定宽度
 */

/** 你的 Cloudinary Cloud Name，在 Cloudinary 控制台 Dashboard 首页可以找到 */
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? '';

/**
 * 生成 Cloudinary 自动优化 URL
 *
 * @param publicId  Cloudinary 中的图片 public_id（不含域名和 /upload/）
 *                  例如 "travel/kyoto-1" 或 "kyoto-1"
 * @param width     可选，输出宽度（像素）。不传则使用原始尺寸
 * @param opts      可选额外 transform 参数，默认 quality=auto, format=auto
 */
export function cl(
  publicId: string,
  width?: number,
  opts: { quality?: string; format?: string; crop?: string } = {}
): string {
  if (!CLOUD_NAME) {
    console.warn('[cloudinary] VITE_CLOUDINARY_CLOUD_NAME 未设置，无法生成 URL');
    return publicId;
  }

  const q = opts.quality ?? 'auto';
  const f = opts.format ?? 'auto';
  const transforms: string[] = [`q_${q}`, `f_${f}`];

  if (width) transforms.push(`w_${width}`);
  if (opts.crop) transforms.push(`c_${opts.crop}`);

  const t = transforms.join(',');
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${t}/${publicId}`;
}

/**
 * 从完整 Cloudinary URL 中提取 public_id
 * 方便将已有链接转换为可用 cl() 再处理的格式
 */
export function clPublicId(fullUrl: string): string {
  const match = fullUrl.match(/\/upload\/(?:[^/]+\/)?(.+)$/);
  return match ? match[1].replace(/\.[^.]+$/, '') : fullUrl;
}
