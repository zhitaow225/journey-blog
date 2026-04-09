import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { posts } from "../data/posts";
import { Navbar } from "../components/layout/Navbar";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const post = posts.find((p) => p.id === id);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        Post not found.
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < rating ? "text-foreground" : "text-muted"}>
        ★
      </span>
    ));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % post.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + post.images.length) % post.images.length);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Full Bleed Image Gallery */}
      <motion.div 
        className="w-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {post.images.map((img, i) => (
          <div 
            key={i} 
            className="flex-none w-full md:w-[80vw] h-[60vh] md:h-[80vh] snap-center relative group cursor-zoom-in mr-1"
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

      {/* Content Area */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-24 flex flex-col md:flex-row gap-16 md:gap-24">
        
        {/* Main Article */}
        <motion.article 
          className="flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <header className="mb-12">
            <div className="text-sm font-sans tracking-widest text-muted-foreground uppercase mb-4">
              {post.date} — {post.location}
            </div>
            <h1 className="text-4xl md:text-5xl font-serif leading-tight">
              {post.title}
            </h1>
          </header>

          <div className="prose prose-neutral prose-lg max-w-none prose-p:leading-loose prose-p:font-serif prose-p:text-lg prose-p:text-foreground/90">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.body}
            </ReactMarkdown>
          </div>
        </motion.article>

        {/* Sidebar Metadata */}
        <motion.aside 
          className="w-full md:w-64 flex-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="sticky top-24 space-y-10">
            <div>
              <h3 className="text-xs font-sans tracking-widest text-muted-foreground uppercase mb-3">
                天气
              </h3>
              <p className="font-serif text-lg">{post.weather}</p>
            </div>
            
            <div>
              <h3 className="text-xs font-sans tracking-widest text-muted-foreground uppercase mb-3">
                推荐指数
              </h3>
              <p className="text-lg tracking-widest">
                {renderStars(post.rating)}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-sans tracking-widest text-muted-foreground uppercase mb-3">
                人均花费
              </h3>
              <p className="font-serif text-lg">{post.costPerPerson}</p>
            </div>
          </div>
        </motion.aside>

      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightboxIndex(null)}
          >
            <button 
              className="absolute top-8 right-8 text-foreground p-2 hover:opacity-70 transition-opacity"
              onClick={() => setLightboxIndex(null)}
              data-testid="button-close-lightbox"
            >
              <X size={32} strokeWidth={1} />
            </button>

            {post.images.length > 1 && (
              <button 
                className="absolute left-8 text-foreground p-4 hover:opacity-70 transition-opacity hidden md:block"
                onClick={prevImage}
              >
                <ChevronLeft size={48} strokeWidth={1} />
              </button>
            )}

            <motion.img 
              src={post.images[lightboxIndex]} 
              className="max-w-[90vw] max-h-[90vh] object-contain"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />

            {post.images.length > 1 && (
              <button 
                className="absolute right-8 text-foreground p-4 hover:opacity-70 transition-opacity hidden md:block"
                onClick={nextImage}
              >
                <ChevronRight size={48} strokeWidth={1} />
              </button>
            )}
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm font-sans tracking-widest text-muted-foreground">
              {lightboxIndex + 1} / {post.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
