import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft, Plus, Trash2, Copy, Check, Eye, EyeOff,
  FileCode, Save, RefreshCw, ChevronDown, ChevronUp,
} from "lucide-react";
import type { Post } from "../data/types";
import { getLocalPosts, saveLocalPost, deleteLocalPost } from "../data/localPosts";

// ─── 初始表单 ──────────────────────────────────────────────
const EMPTY: Omit<Post, "id"> = {
  title: "",
  date: new Date().toISOString().slice(0, 10),
  location: "",
  body: "",
  images: [],
  weather: "",
  rating: 5,
  costPerPerson: "",
  budget: "",
  days: 1,
  transport: "",
};

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
      .slice(0, 40) ||
    `post-${Date.now()}`
  );
}

// ─── 生成 TS 代码 ──────────────────────────────────────────
function genCode(post: Post): string {
  const varName = post.id
    .replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    .replace(/^[0-9]/, "_$&");
  return `import type { Post } from "../types";

export const ${varName}: Post = {
  id: "${post.id}",
  title: "${post.title.replace(/"/g, '\\"')}",
  date: "${post.date}",
  location: "${post.location}",
  weather: "${post.weather}",
  rating: ${post.rating},
  costPerPerson: "${post.costPerPerson}",
  budget: "${post.budget}",
  days: ${post.days},
  transport: "${post.transport}",
  images: [
${post.images.map((u) => `    "${u}"`).join(",\n")}
  ],
  body: \`
${post.body.replace(/`/g, "\\`")}
\`,
};
`;
}

// ─── 小组件 ────────────────────────────────────────────────
const Label = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      fontSize: 11,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "#888",
      fontFamily: "sans-serif",
      display: "block",
      marginBottom: 5,
    }}
  >
    {children}
  </span>
);

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  background: "#fff",
  border: "1px solid #e0e0de",
  fontSize: 14,
  color: "#1a1a1a",
  fontFamily: "sans-serif",
  outline: "none",
  boxSizing: "border-box",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

// ─── 复制按钮 ──────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 14px",
        background: copied ? "#4a7c59" : "#1a1a1a",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        fontSize: 12,
        fontFamily: "sans-serif",
        letterSpacing: "0.06em",
        transition: "background 0.25s",
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "已复制" : "复制代码"}
    </button>
  );
}

// ─── 已保存文章卡片 ────────────────────────────────────────
function LocalPostCard({
  post,
  onEdit,
  onDelete,
}: {
  post: Post;
  onEdit: (p: Post) => void;
  onDelete: (id: string) => void;
}) {
  const [showCode, setShowCode] = useState(false);
  const code = genCode(post);

  return (
    <div
      style={{
        border: "1px solid #e0e0de",
        background: "#fff",
        marginBottom: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 16px",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        {post.images[0] && (
          <img
            src={post.images[0]}
            alt=""
            style={{
              width: 56,
              height: 56,
              objectFit: "cover",
              flexShrink: 0,
              filter: "brightness(0.95)",
            }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: "0 0 3px",
              fontSize: 15,
              color: "#1a1a1a",
              fontFamily: "'Noto Serif SC', serif",
              fontWeight: 400,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {post.title || "（无标题）"}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: "#aaa",
              fontFamily: "sans-serif",
              letterSpacing: "0.06em",
            }}
          >
            {post.location} · {post.date} · {post.days}天
          </p>
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button
            onClick={() => setShowCode((v) => !v)}
            title="查看 TS 代码"
            style={{
              padding: "5px 8px",
              background: "none",
              border: "1px solid #e0e0de",
              cursor: "pointer",
              color: "#888",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontFamily: "sans-serif",
            }}
          >
            <FileCode size={12} />
            {showCode ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
          </button>
          <Link href={`/post/${post.id}`}>
            <button
              title="预览"
              style={{
                padding: "5px 8px",
                background: "none",
                border: "1px solid #e0e0de",
                cursor: "pointer",
                color: "#888",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Eye size={12} />
            </button>
          </Link>
          <button
            onClick={() => onEdit(post)}
            style={{
              padding: "5px 10px",
              background: "#1a1a1a",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              fontSize: 11,
              fontFamily: "sans-serif",
              letterSpacing: "0.06em",
            }}
          >
            编辑
          </button>
          <button
            onClick={() => onDelete(post.id)}
            title="删除"
            style={{
              padding: "5px 8px",
              background: "none",
              border: "1px solid #fca5a5",
              cursor: "pointer",
              color: "#e87070",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {showCode && (
        <div
          style={{
            borderTop: "1px solid #e0e0de",
            background: "#F4F4F2",
            padding: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "#888",
                fontFamily: "sans-serif",
                letterSpacing: "0.08em",
              }}
            >
              复制后粘贴至 src/data/posts/ 目录下的新文件，并在 index.ts 中导入
            </span>
            <CopyButton text={code} />
          </div>
          <pre
            style={{
              margin: 0,
              fontSize: 11.5,
              lineHeight: 1.7,
              color: "#444",
              fontFamily: "'JetBrains Mono', 'Menlo', monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {code}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── 主页面 ────────────────────────────────────────────────
export default function AdminPage() {
  const [localPosts, setLocalPosts] = useState<Post[]>(() => getLocalPosts());
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<Omit<Post, "id">>(EMPTY);
  const [editId, setEditId] = useState<string>("");
  const [preview, setPreview] = useState(false);
  const [imagesRaw, setImagesRaw] = useState("");
  const [saved, setSaved] = useState(false);

  const refresh = useCallback(() => setLocalPosts(getLocalPosts()), []);

  useEffect(() => {
    window.addEventListener("jt-posts-updated", refresh);
    return () => window.removeEventListener("jt-posts-updated", refresh);
  }, [refresh]);

  // 进入编辑模式
  const startEdit = (post: Post) => {
    setEditing(post);
    setEditId(post.id);
    setForm({
      title: post.title,
      date: post.date,
      location: post.location,
      body: post.body,
      images: post.images,
      weather: post.weather,
      rating: post.rating,
      costPerPerson: post.costPerPerson,
      budget: post.budget,
      days: post.days,
      transport: post.transport,
    });
    setImagesRaw(post.images.join("\n"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditing(null);
    setEditId("");
    setForm(EMPTY);
    setImagesRaw("");
    setSaved(false);
  };

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    const id = editId || slugify(form.title);
    const images = imagesRaw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const post: Post = { ...form, id, images };
    saveLocalPost(post);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    refresh();
    if (!editing) resetForm();
  };

  const handleDelete = (id: string) => {
    if (!confirm("确定删除这篇文章吗？")) return;
    deleteLocalPost(id);
    refresh();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F9F9F8",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #e5e5e3",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/">
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#888",
                fontSize: 12,
                letterSpacing: "0.08em",
              }}
            >
              <ArrowLeft size={13} />
              返回博客
            </button>
          </Link>
          <span
            style={{
              fontSize: 13,
              color: "#ccc",
              userSelect: "none",
            }}
          >
            /
          </span>
          <span
            style={{
              fontSize: 14,
              color: "#1a1a1a",
              letterSpacing: "0.04em",
              fontFamily: "'Noto Serif SC', serif",
            }}
          >
            旅途后台
          </span>
        </div>
        <span
          style={{
            fontSize: 11,
            color: "#bbb",
            letterSpacing: "0.08em",
          }}
        >
          本地草稿 · 不需联网
        </span>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "28px 24px 60px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 28,
          alignItems: "start",
        }}
      >
        {/* ── 左列：表单 ── */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#1a1a1a",
              }}
            >
              {editing ? "编辑文章" : "新建文章"}
            </h2>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setPreview((v) => !v)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 12px",
                  background: "none",
                  border: "1px solid #e0e0de",
                  cursor: "pointer",
                  fontSize: 11,
                  color: "#888",
                  letterSpacing: "0.06em",
                }}
              >
                {preview ? <EyeOff size={11} /> : <Eye size={11} />}
                {preview ? "隐藏预览" : "正文预览"}
              </button>
              {editing && (
                <button
                  onClick={resetForm}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 12px",
                    background: "none",
                    border: "1px solid #e0e0de",
                    cursor: "pointer",
                    fontSize: 11,
                    color: "#888",
                    letterSpacing: "0.06em",
                  }}
                >
                  <RefreshCw size={11} />
                  新建
                </button>
              )}
            </div>
          </div>

          {/* 基础信息 */}
          <Field label="标题">
            <input
              style={inputStyle}
              value={form.title}
              placeholder="文章标题"
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="日期">
              <input
                type="date"
                style={inputStyle}
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </Field>
            <Field label="天数">
              <input
                type="number"
                min={1}
                style={inputStyle}
                value={form.days}
                onChange={(e) => set("days", Number(e.target.value))}
              />
            </Field>
          </div>

          <Field label="地点（格式：城市，国家）">
            <input
              style={inputStyle}
              value={form.location}
              placeholder="京都，日本"
              onChange={(e) => set("location", e.target.value)}
            />
            <span
              style={{
                fontSize: 10,
                color: "#bbb",
                display: "block",
                marginTop: 4,
              }}
            >
              使用全角逗号"，"，地图页将自动标记
            </span>
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="天气">
              <input
                style={inputStyle}
                value={form.weather}
                placeholder="晴 / 阴雨 / 大雪"
                onChange={(e) => set("weather", e.target.value)}
              />
            </Field>
            <Field label="交通方式">
              <input
                style={inputStyle}
                value={form.transport}
                placeholder="飞机 / 火车 / 自驾"
                onChange={(e) => set("transport", e.target.value)}
              />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <Field label="评分（1-5）">
              <input
                type="number"
                min={1}
                max={5}
                step={0.5}
                style={inputStyle}
                value={form.rating}
                onChange={(e) => set("rating", Number(e.target.value))}
              />
            </Field>
            <Field label="人均花费">
              <input
                style={inputStyle}
                value={form.costPerPerson}
                placeholder="¥3000"
                onChange={(e) => set("costPerPerson", e.target.value)}
              />
            </Field>
            <Field label="预算级别">
              <input
                style={inputStyle}
                value={form.budget}
                placeholder="中等 / 奢华"
                onChange={(e) => set("budget", e.target.value)}
              />
            </Field>
          </div>

          {/* 图片 */}
          <Field label="图片 URL（每行一个）">
            <textarea
              style={{
                ...inputStyle,
                minHeight: 90,
                resize: "vertical",
                lineHeight: 1.7,
              }}
              value={imagesRaw}
              placeholder={"https://images.unsplash.com/…\nhttps://res.cloudinary.com/…"}
              onChange={(e) => setImagesRaw(e.target.value)}
            />
          </Field>

          {/* 正文 */}
          <Field label="正文（Markdown）">
            <textarea
              style={{
                ...inputStyle,
                minHeight: 280,
                resize: "vertical",
                lineHeight: 1.8,
                fontFamily: "'JetBrains Mono', 'Menlo', monospace",
                fontSize: 12.5,
              }}
              value={form.body}
              placeholder={"## 出发\n\n天刚亮，我背起行囊……\n\n> 旅行是逃离，也是抵达。"}
              onChange={(e) => set("body", e.target.value)}
            />
          </Field>

          {/* 正文 Markdown 预览 */}
          {preview && form.body && (
            <div
              style={{
                border: "1px solid #e0e0de",
                background: "#fff",
                padding: "20px 22px",
                marginBottom: 18,
                fontFamily: "'Noto Serif SC', serif",
                fontSize: 14,
                lineHeight: 2,
                color: "#333",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  color: "#bbb",
                  fontFamily: "sans-serif",
                  marginTop: 0,
                  marginBottom: 14,
                  textTransform: "uppercase",
                }}
              >
                正文预览
              </p>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {form.body}
              </ReactMarkdown>
            </div>
          )}

          {/* 保存按钮 */}
          <button
            onClick={handleSave}
            disabled={!form.title}
            style={{
              width: "100%",
              padding: "12px 0",
              background: saved ? "#4a7c59" : form.title ? "#1a1a1a" : "#ccc",
              color: "#fff",
              border: "none",
              cursor: form.title ? "pointer" : "not-allowed",
              fontSize: 13,
              letterSpacing: "0.1em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "background 0.25s",
            }}
          >
            {saved ? (
              <>
                <Check size={14} /> 已保存
              </>
            ) : (
              <>
                <Save size={14} /> {editing ? "保存修改" : "保存草稿"}
              </>
            )}
          </button>

          {form.title && (
            <p
              style={{
                marginTop: 10,
                fontSize: 10,
                color: "#bbb",
                textAlign: "center",
                fontFamily: "sans-serif",
                letterSpacing: "0.06em",
              }}
            >
              文章 ID：{editId || slugify(form.title)}
            </p>
          )}
        </div>

        {/* ── 右列：已保存列表 ── */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#1a1a1a",
              }}
            >
              本地草稿
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 11,
                  color: "#aaa",
                  fontWeight: 400,
                }}
              >
                ({localPosts.length})
              </span>
            </h2>
            <button
              onClick={resetForm}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 12px",
                background: "#1a1a1a",
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                color: "#fff",
                letterSpacing: "0.06em",
              }}
            >
              <Plus size={11} />
              新文章
            </button>
          </div>

          {localPosts.length === 0 ? (
            <div
              style={{
                border: "1px dashed #ddd",
                padding: "40px 24px",
                textAlign: "center",
                color: "#bbb",
                fontSize: 13,
              }}
            >
              还没有本地草稿
              <br />
              <span style={{ fontSize: 11, marginTop: 6, display: "block" }}>
                填写左侧表单，保存后出现在这里
              </span>
            </div>
          ) : (
            localPosts.map((p) => (
              <LocalPostCard
                key={p.id}
                post={p}
                onEdit={startEdit}
                onDelete={handleDelete}
              />
            ))
          )}

          {/* 使用说明 */}
          <div
            style={{
              marginTop: 24,
              padding: "16px 18px",
              background: "#F4F4F2",
              border: "1px solid #e5e5e3",
              fontSize: 12,
              color: "#888",
              lineHeight: 1.9,
            }}
          >
            <p style={{ margin: "0 0 8px", fontWeight: 600, color: "#666" }}>
              使用说明
            </p>
            <ol style={{ margin: 0, paddingLeft: 18 }}>
              <li>在左侧填写文章信息，点击「保存草稿」</li>
              <li>草稿立刻出现在首页和地图，可点击预览</li>
              <li>满意后展开文章右侧「TS 代码」，复制粘贴至代码库</li>
              <li>在 <code>src/data/posts/index.ts</code> 中导入并添加</li>
              <li>代码部署后草稿可安全删除</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
