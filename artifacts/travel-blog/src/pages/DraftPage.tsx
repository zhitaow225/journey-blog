import { useState, useEffect, useRef } from "react";

interface Draft {
  id: string;
  text: string;
  imageDataUrl?: string;
  imageName?: string;
  createdAt: string;
}

const KEY = "journey_drafts";

function load(): Draft[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); }
  catch { return []; }
}

function persist(drafts: Draft[]) {
  localStorage.setItem(KEY, JSON.stringify(drafts));
}

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        const ratio = Math.min(1, MAX / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DraftPage() {
  const [text, setText] = useState("");
  const [img, setImg] = useState<string | undefined>();
  const [imgName, setImgName] = useState<string | undefined>();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [status, setStatus] = useState<"idle" | "saved" | "full">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setDrafts(load()); }, []);

  const handleImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await resizeImage(file);
    setImg(dataUrl);
    setImgName(file.name);
  };

  const handleSave = () => {
    if (!text.trim() && !img) return;
    const draft: Draft = {
      id: Date.now().toString(),
      text,
      imageDataUrl: img,
      imageName: imgName,
      createdAt: new Date().toLocaleString("zh-CN"),
    };
    const next = [draft, ...drafts];
    try {
      persist(next);
      setDrafts(next);
      setText("");
      setImg(undefined);
      setImgName(undefined);
      if (fileRef.current) fileRef.current.value = "";
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("full");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const remove = (id: string) => {
    const next = drafts.filter(d => d.id !== id);
    persist(next);
    setDrafts(next);
  };

  const s: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100svh",
      background: "#F9F9F8",
      padding: "48px 24px 80px",
      maxWidth: 600,
      margin: "0 auto",
      boxSizing: "border-box",
    },
    label: {
      fontSize: 11,
      letterSpacing: "0.15em",
      color: "#aaa",
      marginBottom: 28,
      display: "block",
    },
    textarea: {
      width: "100%",
      minHeight: 200,
      border: "none",
      borderBottom: "1px solid #e0e0e0",
      background: "transparent",
      fontSize: 18,
      lineHeight: 1.9,
      resize: "none",
      outline: "none",
      fontFamily: "'Noto Serif SC', serif",
      color: "#2a2a2a",
      padding: "4px 0 12px",
      boxSizing: "border-box",
    },
    preview: {
      marginTop: 16,
      width: "100%",
      maxHeight: 280,
      objectFit: "cover" as const,
      display: "block",
    },
    bar: {
      display: "flex",
      gap: 10,
      marginTop: 20,
      alignItems: "center",
      flexWrap: "wrap" as const,
    },
    btnGhost: {
      padding: "9px 16px",
      border: "1px solid #d8d8d8",
      background: "none",
      cursor: "pointer",
      fontSize: 13,
      color: "#666",
      fontFamily: "sans-serif",
    },
    btnPrimary: {
      padding: "9px 22px",
      border: "none",
      background: "#2a2a2a",
      color: "#fff",
      cursor: "pointer",
      fontSize: 13,
      fontFamily: "sans-serif",
    },
    btnText: {
      padding: "9px 8px",
      border: "none",
      background: "none",
      cursor: "pointer",
      fontSize: 13,
      color: "#bbb",
      fontFamily: "sans-serif",
    },
    statusMsg: {
      fontSize: 12,
      color: status === "full" ? "#c0392b" : "#888",
      marginLeft: 4,
    },
    divider: { borderTop: "1px solid #ebebeb", padding: "18px 0 4px" },
    meta: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    metaTime: { fontSize: 11, color: "#bbb", fontFamily: "sans-serif" },
    draftText: {
      fontSize: 15,
      lineHeight: 1.85,
      color: "#555",
      fontFamily: "'Noto Serif SC', serif",
      whiteSpace: "pre-wrap",
      margin: "6px 0 0",
    },
    draftImg: {
      marginTop: 10,
      width: "100%",
      maxHeight: 200,
      objectFit: "cover" as const,
      display: "block",
    },
    deleteBtn: {
      fontSize: 11,
      color: "#ccc",
      border: "none",
      background: "none",
      cursor: "pointer",
      padding: 0,
      fontFamily: "sans-serif",
    },
    sectionTitle: {
      fontSize: 11,
      color: "#ccc",
      letterSpacing: "0.1em",
      margin: "48px 0 0",
      fontFamily: "sans-serif",
    },
  };

  return (
    <div style={s.page}>
      <span style={s.label}>DRAFT · 草稿箱</span>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="随手写几句……"
        style={s.textarea}
        autoFocus
      />

      {img && (
        <img src={img} alt={imgName} style={s.preview} />
      )}

      <div style={s.bar}>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleImg}
        />
        <button style={s.btnGhost} onClick={() => fileRef.current?.click()}>
          {img ? "换图" : "＋ 传图"}
        </button>

        <button style={s.btnPrimary} onClick={handleSave}>
          {status === "saved" ? "✓ 已存" : "存草稿"}
        </button>

        {img && (
          <button style={s.btnText} onClick={() => {
            setImg(undefined);
            setImgName(undefined);
            if (fileRef.current) fileRef.current.value = "";
          }}>
            移除图片
          </button>
        )}

        {status === "saved" && <span style={s.statusMsg}>已存到本机</span>}
        {status === "full" && <span style={s.statusMsg}>存储空间不足，请删除旧草稿</span>}
      </div>

      {drafts.length > 0 && (
        <>
          <p style={s.sectionTitle}>已存 {drafts.length} 篇草稿</p>
          {drafts.map(d => (
            <div key={d.id} style={s.divider}>
              <div style={s.meta}>
                <span style={s.metaTime}>{d.createdAt}</span>
                <button style={s.deleteBtn} onClick={() => remove(d.id)}>删除</button>
              </div>
              {d.text && <p style={s.draftText}>{d.text}</p>}
              {d.imageDataUrl && (
                <img src={d.imageDataUrl} alt={d.imageName} style={s.draftImg} />
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
