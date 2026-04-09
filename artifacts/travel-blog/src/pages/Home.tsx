import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { posts } from "../data/posts";
import { Navbar } from "../components/layout/Navbar";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <motion.div 
          className="mt-12 mb-24 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-serif text-foreground leading-tight mb-6">
            慢游与记录。
          </h1>
          <p className="text-muted-foreground font-sans text-lg tracking-wide leading-relaxed">
            A quiet space for unhurried journeys.
          </p>
        </motion.div>

        <motion.div 
          className="masonry-grid"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {posts.map((post) => (
            <motion.div key={post.id} variants={item} className="masonry-item group cursor-pointer">
              <Link href={`/post/${post.id}`}>
                <div className="overflow-hidden bg-muted">
                  <motion.img 
                    src={post.images[0]} 
                    alt={post.title}
                    className="w-full h-auto object-cover"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    data-testid={`img-post-${post.id}`}
                  />
                </div>
                <div className="mt-4 flex flex-col gap-1">
                  <div className="text-xs font-sans tracking-widest text-muted-foreground uppercase">
                    {post.date} — {post.location}
                  </div>
                  <h2 className="text-xl font-serif text-foreground group-hover:opacity-70 transition-opacity">
                    {post.title}
                  </h2>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
