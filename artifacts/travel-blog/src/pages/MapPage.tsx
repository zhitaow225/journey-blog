import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { Navbar } from "../components/layout/Navbar";
import { ArrowRight } from "lucide-react";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ISO numeric country codes
const VISITED = new Set(["392", "250", "352", "756"]); // Japan, France, Iceland, Switzerland

interface MarkerData {
  id: string;
  name: string;
  coordinates: [number, number];
  postTitle: string;
}

const MARKERS: MarkerData[] = [
  {
    id: "kyoto-morning",
    name: "京都",
    coordinates: [135.77, 35.01],
    postTitle: "京都的清晨",
  },
  {
    id: "tokyo-rain",
    name: "东京",
    coordinates: [139.69, 35.69],
    postTitle: "东京夜雨",
  },
  {
    id: "provence-light",
    name: "普罗旺斯",
    coordinates: [5.4, 43.8],
    postTitle: "蓝色海岸的三天两夜",
  },
  {
    id: "swiss-meadow",
    name: "格林德瓦",
    coordinates: [8.04, 46.62],
    postTitle: "阿尔卑斯的薄雾",
  },
  {
    id: "iceland-silence",
    name: "维克",
    coordinates: [-19.0, 63.42],
    postTitle: "在世界尽头",
  },
];

const COLOR_DEFAULT = "#E8E4DC";
const COLOR_VISITED = "#C9A87C";
const COLOR_VISITED_HOVER = "#B8936A";
const COLOR_STROKE = "#F9F9F8";

export default function MapPage() {
  const [activeMarker, setActiveMarker] = useState<MarkerData | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-5 md:px-10 pb-28">
        {/* Header */}
        <motion.div
          className="mt-14 mb-12 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-serif text-foreground leading-tight mb-4">
            走过的地方。
          </h1>
          <p className="text-muted-foreground font-sans text-sm tracking-wider leading-relaxed">
            {MARKERS.length} 座城市 · {VISITED.size} 个国家
          </p>
        </motion.div>

        {/* Map container */}
        <motion.div
          className="relative w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 155, center: [30, 42] }}
            className="w-full"
            style={{ background: "transparent" }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isVisited = VISITED.has(String(geo.id));
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isVisited ? COLOR_VISITED : COLOR_DEFAULT}
                      stroke={COLOR_STROKE}
                      strokeWidth={0.6}
                      style={{
                        default: { outline: "none" },
                        hover: {
                          outline: "none",
                          fill: isVisited ? COLOR_VISITED_HOVER : "#DEDAD1",
                        },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {MARKERS.map((marker) => (
              <Marker
                key={marker.id}
                coordinates={marker.coordinates}
                onMouseEnter={() => setActiveMarker(marker)}
                onMouseLeave={() => setActiveMarker(null)}
              >
                {/* Pulse ring */}
                <motion.circle
                  r={8}
                  fill="transparent"
                  stroke="#8B6240"
                  strokeWidth={1}
                  initial={{ scale: 0.5, opacity: 0.6 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: Math.random() * 1.5,
                  }}
                  style={{ transformOrigin: "center" }}
                />
                {/* Core dot */}
                <circle
                  r={4}
                  fill="#8B6240"
                  stroke="#F9F9F8"
                  strokeWidth={1.5}
                  style={{ cursor: "pointer" }}
                />
              </Marker>
            ))}
          </ComposableMap>

          {/* Hover card */}
          <AnimatePresence>
            {activeMarker && (
              <motion.div
                key={activeMarker.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
              >
                <Link
                  href={`/post/${activeMarker.id}`}
                  className="pointer-events-auto flex items-center gap-3 bg-background/90 backdrop-blur-sm border border-border px-5 py-3 shadow-sm"
                >
                  <span className="font-sans text-xs text-muted-foreground tracking-widest uppercase">
                    {activeMarker.name}
                  </span>
                  <span className="w-px h-3 bg-border" />
                  <span className="font-serif text-sm text-foreground">
                    {activeMarker.postTitle}
                  </span>
                  <ArrowRight size={12} className="text-muted-foreground" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* City list */}
        <motion.div
          className="mt-16 border-t border-border pt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-xs font-sans tracking-widest uppercase text-muted-foreground mb-6">
            足迹
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border">
            {MARKERS.map((marker) => (
              <Link
                key={marker.id}
                href={`/post/${marker.id}`}
                className="group bg-background p-5 flex flex-col gap-1 hover:bg-muted transition-colors duration-200"
              >
                <span className="font-serif text-base text-foreground group-hover:opacity-60 transition-opacity">
                  {marker.name}
                </span>
                <span className="font-sans text-xs text-muted-foreground tracking-wide">
                  {marker.postTitle}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
