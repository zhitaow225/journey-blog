import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { X, ChevronLeft, ChevronRight, MapPin, Star, Wallet, CalendarDays, Train, ArrowLeft } from "lucide-react";
import { posts } from "../data/posts";
import { Navbar } from "../components/layout/Navbar";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const post = posts.find((p) => p.id === id);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 font-sans text-muted-foreground">
        <p>文章不存在</p>
        <Link href="/" className="text-sm underline underline-offset-4">返回首页</Link>
      </div>
    );
  }

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={13}
        strokeWidth={1.5}
        className={i < rating ? "fill-foreground text-foreground" : "text-border"}
      />
    ));

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null)
      setLightboxIndex((lightboxIndex + 1) % post.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null)
      setLightboxIndex((lightboxIndex - 1 + post.images.length) % post.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Full-bleed image gallery */}
      <motion.div
        className="w-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
      >
        {post.images.map((img, i) => (
          <div
            key={i}
            className="flex-none w-full md:w-[80vw] h-[55vh] md:h-[78vh] snap-center relative cursor-zoom-in"
            style={{ marginRight: i < post.images.length - 1 ? "2px" : 0 }}
            onClick={() => setLightboxIndex(i)}
          >
            <img
              src={img}
              alt={`${post.title} - ${i + 1}`}
              className="w-full h-full object-cover"
              data-testid={`gallery-img-${i}`}
            />
          </div>
        ))}
      </motion.div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-5 md:px-10 py-16 md:py-24 flex flex-col md:flex-row gap-12 md:gap-20">

        {/* Article */}
        <motion.article
          className="flex-1 min-w-0"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-sans tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors mb-10"
            data-testid="link-back-home"
          >
            <ArrowLeft size={12} strokeWidth={1.5} />
            所有文章
          </Link>

          <header className="mb-10">
            {/* Location */}
            <div className="inline-flex items-center gap-1.5 text-xs font-sans tracking-widest text-muted-foreground uppercase mb-5">
              <MapPin size={10} strokeWidth={1.5} />
              {post.location}
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-normal leading-tight text-foreground mb-4">
              {post.title}
            </h1>

            <p className="text-sm font-sans tracking-widest text-muted-foreground">{post.date}</p>
          </header>

          {/* Markdown body */}
          <div className="prose prose-neutral prose-lg max-w-none
            prose-p:leading-loose prose-p:font-serif prose-p:text-[1.05rem] prose-p:text-foreground/85
            prose-h2:font-serif prose-h2:font-normal prose-h2:text-2xl prose-h2:tracking-tight prose-h2:text-foreground prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-none
            prose-h3:font-serif prose-h3:font-normal prose-h3:text-xl prose-h3:text-foreground
            prose-strong:font-semibold prose-strong:text-foreground
            prose-ul:font-serif prose-ul:text-[1.05rem] prose-ul:text-foreground/85 prose-ul:leading-loose prose-ul:list-none prose-ul:pl-0
            prose-li:my-1.5 prose-li:pl-4 prose-li:border-l prose-li:border-border
            prose-hr:border-border">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.body}
            </ReactMarkdown>
          </div>
        </motion.article>

        {/* Metadata sidebar */}
        <motion.aside
          className="w-full md:w-56 flex-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          <div className="sticky top-24">
            {/* Metadata card */}
            <div className="border border-border p-6 space-y-7">
              <MetaRow
                icon={<CalendarDays size={13} strokeWidth={1.5} />}
                label="天数"
                value={`${post.days} 天`}
              />
              <MetaRow
                icon={<Wallet size={13} strokeWidth={1.5} />}
                label="预算"
                value={post.budget}
              />
              <MetaRow
                icon={<Train size={13} strokeWidth={1.5} />}
                label="交通工具"
                value={post.transport}
              />
              <div>
                <p className="text-xs font-sans tracking-widest text-muted-foreground uppercase mb-2.5 flex items-center gap-2">
                  <Star size={13} strokeWidth={1.5} />
                  推荐评分
                </p>
                <div className="flex items-center gap-0.5">
                  {renderStars(post.rating)}
                </div>
              </div>
            </div>

            {/* Weather note */}
            <p className="mt-4 text-xs font-sans text-muted-foreground tracking-wide leading-relaxed">
              {post.weather}
            </p>
          </div>
        </motion.aside>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-background/96 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute top-6 right-6 text-foreground p-2 hover:opacity-50 transition-opacity"
              onClick={() => setLightboxIndex(null)}
              data-testid="button-close-lightbox"
            >
              <X size={28} strokeWidth={1} />
            </button>

            {post.images.length > 1 && (
              <button
                className="absolute left-6 text-foreground p-4 hover:opacity-50 transition-opacity hidden md:block"
                onClick={prevImage}
              >
                <ChevronLeft size={44} strokeWidth={1} />
              </button>
            )}

            <motion.img
              src={post.images[lightboxIndex]}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            />

            {post.images.length > 1 && (
              <button
                className="absolute right-6 text-foreground p-4 hover:opacity-50 transition-opacity hidden md:block"
                onClick={nextImage}
              >
                <ChevronRight size={44} strokeWidth={1} />
              </button>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-sans tracking-widest text-muted-foreground">
              {lightboxIndex + 1} / {post.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-sans tracking-widest text-muted-foreground uppercase mb-1.5 flex items-center gap-2">
        {icon}
        {label}
      </p>
      <p className="font-serif text-base text-foreground">{value}</p>
    </div>
  );
}
