import { useRef, useState, useEffect } from "react";
import type { Post } from "../data/types";

interface Props {
  post: Post;
  onClose: () => void;
}

function stripMarkdown(md: string): string {
  return md
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/[*_`~>]/g, "")
    .replace(/\n+/g, " ")
    .trim();
}

export function ShareModal({ post, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [qrUrl, setQrUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");

  const postUrl = window.location.href;
  const excerpt = stripMarkdown(post.body).slice(0, 110);

  useEffect(() => {
    import("qrcode").then((mod) => {
      const QRCode = mod.default;
      QRCode.toDataURL(postUrl, {
        width: 180,
        margin: 1,
        color: { dark: "#2a2a2a", light: "#F9F9F8" },
      }).then(setQrUrl);
    });
  }, [postUrl]);

  const download = async () => {
    if (!cardRef.current || !qrUrl) return;
    setStatus("generating");
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#F9F9F8",
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `${post.title} · 旅途.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (e) {
      console.error(e);
      setStatus("idle");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(20,20,20,0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 28,
        paddingBottom: 40,
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      {/* Action bar */}
      <div
        style={{ display: "flex", gap: 10, marginBottom: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={download}
          disabled={status === "generating" || !qrUrl}
          style={{
            padding: "10px 26px",
            background: status === "done" ? "#4a7c59" : "#1a1a1a",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "sans-serif",
            letterSpacing: "0.05em",
            transition: "background 0.3s",
          }}
        >
          {status === "generating" ? "生成中…" : status === "done" ? "✓ 已保存" : "↓ 保存长图"}
        </button>
        <button
          onClick={onClose}
          style={{
            padding: "10px 16px",
            background: "none",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "rgba(255,255,255,0.7)",
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "sans-serif",
          }}
        >
          关闭
        </button>
      </div>

      {/* Card — this is what gets captured */}
      <div onClick={(e) => e.stopPropagation()}>
        <div
          ref={cardRef}
          style={{
            width: 375,
            background: "#F9F9F8",
            fontFamily: "'Noto Serif SC', 'SimSun', serif",
            boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
            overflow: "hidden",
          }}
        >
          {/* Top bar */}
          <div
            style={{
              padding: "18px 22px",
              borderBottom: "1px solid #e5e5e3",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 13,
                letterSpacing: "0.22em",
                color: "#888",
                fontFamily: "sans-serif",
              }}
            >
              旅途 · JOURNEY
            </span>
            <span
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                color: "#bbb",
                fontFamily: "sans-serif",
              }}
            >
              {post.date}
            </span>
          </div>

          {/* Hero image */}
          {post.images[0] && (
            <div style={{ width: "100%", height: 260, overflow: "hidden" }}>
              <img
                src={post.images[0]}
                alt={post.title}
                crossOrigin="anonymous"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          )}

          {/* Content */}
          <div style={{ padding: "22px 22px 16px" }}>
            <p
              style={{
                margin: "0 0 10px",
                fontSize: 10,
                letterSpacing: "0.12em",
                color: "#aaa",
                fontFamily: "sans-serif",
              }}
            >
              📍 {post.location}
            </p>
            <h2
              style={{
                margin: "0 0 14px",
                fontSize: 24,
                fontWeight: 400,
                color: "#1a1a1a",
                lineHeight: 1.35,
                letterSpacing: "0.02em",
              }}
            >
              {post.title}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                lineHeight: 1.9,
                color: "#666",
                letterSpacing: "0.02em",
              }}
            >
              {excerpt}
              {post.body.length > 110 ? "……" : ""}
            </p>
          </div>

          {/* Tags row */}
          <div
            style={{
              padding: "0 22px 16px",
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {[`${post.days}天`, post.transport, post.weather]
              .filter(Boolean)
              .map((tag, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 10,
                    color: "#999",
                    border: "1px solid #e0e0de",
                    padding: "3px 8px",
                    fontFamily: "sans-serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  {tag}
                </span>
              ))}
          </div>

          {/* QR code footer */}
          <div
            style={{
              borderTop: "1px solid #e5e5e3",
              padding: "16px 22px 22px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "#F4F4F2",
            }}
          >
            {qrUrl ? (
              <img
                src={qrUrl}
                alt="QR"
                style={{ width: 72, height: 72, flexShrink: 0 }}
              />
            ) : (
              <div
                style={{
                  width: 72,
                  height: 72,
                  background: "#e0e0de",
                  flexShrink: 0,
                }}
              />
            )}
            <div>
              <p
                style={{
                  margin: "0 0 5px",
                  fontSize: 12,
                  color: "#555",
                  fontFamily: "'Noto Serif SC', serif",
                }}
              >
                扫码阅读全文
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 9,
                  color: "#aaa",
                  fontFamily: "sans-serif",
                  wordBreak: "break-all",
                  lineHeight: 1.5,
                }}
              >
                {postUrl.length > 45 ? postUrl.slice(0, 45) + "…" : postUrl}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p
        style={{
          marginTop: 16,
          color: "rgba(255,255,255,0.35)",
          fontSize: 11,
          fontFamily: "sans-serif",
          letterSpacing: "0.08em",
        }}
      >
        点击背景关闭
      </p>
    </div>
  );
}
