import { Link } from "wouter";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { posts } from "../data/posts";
import { Navbar } from "../components/layout/Navbar";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-5 md:px-10 pb-28">
        {/* Hero header */}
        <motion.div
          className="mt-14 mb-20 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-serif text-foreground leading-tight mb-4">
            慢游与记录。
          </h1>
          <p className="text-muted-foreground font-sans text-base tracking-wider leading-relaxed">
            A quiet space for unhurried journeys.
          </p>
        </motion.div>

        {/* Masonry grid */}
        <motion.div
          className="masonry-grid"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {posts.map((post) => (
            <motion.div key={post.id} variants={item} className="masonry-item group">
              <Link href={`/post/${post.id}`} data-testid={`link-post-${post.id}`}>
                {/* Photo */}
                <div className="overflow-hidden bg-muted">
                  <motion.img
                    src={post.images[0]}
                    alt={post.title}
                    className="w-full h-auto object-cover"
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    data-testid={`img-post-${post.id}`}
                  />
                </div>

                {/* Card info */}
                <div className="mt-4 space-y-2">
                  {/* Location tag */}
                  <div className="inline-flex items-center gap-1 text-xs font-sans text-muted-foreground">
                    <MapPin size={10} strokeWidth={1.5} />
                    <span className="tracking-widest uppercase">{post.location}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg md:text-xl font-serif text-foreground leading-snug group-hover:opacity-60 transition-opacity duration-300">
                    {post.title}
                  </h2>

                  {/* Date + days */}
                  <div className="flex items-center gap-3 text-xs font-sans text-muted-foreground tracking-wide">
                    <span>{post.date}</span>
                    <span className="w-px h-3 bg-border inline-block" />
                    <span>{post.days} 天</span>
                    <span className="w-px h-3 bg-border inline-block" />
                    <span>{post.budget}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
