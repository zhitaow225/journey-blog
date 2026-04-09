import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Navbar } from "../components/layout/Navbar";
import { ArrowRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { posts } from "../data/posts";
import { resolveGeo } from "../data/geoLookup";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const COLOR_DEFAULT = "#E8E4DC";
const COLOR_VISITED = "#C9A87C";
const COLOR_VISITED_HOVER = "#B8936A";
const COLOR_STROKE = "#F9F9F8";

const DEFAULT_CENTER: [number, number] = [30, 42];
const DEFAULT_ZOOM = 1;

// 自动从文章 location 字段解析——无需手动填写任何代码
const geoData = posts
  .map((p) => ({ post: p, geo: resolveGeo(p.location) }))
  .filter((x): x is { post: typeof x.post; geo: NonNullable<typeof x.geo> } =>
    x.geo !== null
  );

const VISITED = new Set(geoData.map((x) => x.geo.countryCode));
const MARKERS = geoData.map(({ post, geo }) => ({
  id: post.id,
  name: post.location.split("，")[0],
  coordinates: geo.coordinates,
  postTitle: post.title,
}));

interface MarkerData {
  id: string;
  name: string;
  coordinates: [number, number];
  postTitle: string;
}

interface MapPosition {
  center: [number, number];
  zoom: number;
}

export default function MapPage() {
  const [activeMarker, setActiveMarker] = useState<MarkerData | null>(null);
  const [position, setPosition] = useState<MapPosition>({
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
  });

  const handleZoomIn = () =>
    setPosition((p) => ({ ...p, zoom: Math.min(p.zoom * 1.8, 10) }));
  const handleZoomOut = () =>
    setPosition((p) => ({ ...p, zoom: Math.max(p.zoom / 1.8, 0.8) }));
  const handleReset = () =>
    setPosition({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-5 md:px-10 pb-28">
        {/* Header */}
        <motion.div
          className="mt-14 mb-10 max-w-xl"
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
          className="relative w-full border border-border overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          style={{ cursor: "grab" }}
        >
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 155, center: DEFAULT_CENTER }}
            className="w-full"
            style={{ background: "transparent" }}
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.center}
              minZoom={0.8}
              maxZoom={10}
              onMoveEnd={({ zoom, coordinates }) =>
                setPosition({ zoom, center: coordinates as [number, number] })
              }
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
                  <circle
                    r={4}
                    fill="#8B6240"
                    stroke="#F9F9F8"
                    strokeWidth={1.5}
                    style={{ cursor: "pointer" }}
                  />
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          {/* Zoom controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-1">
            {[
              { icon: ZoomIn, action: handleZoomIn, label: "放大" },
              { icon: ZoomOut, action: handleZoomOut, label: "缩小" },
              { icon: RotateCcw, action: handleReset, label: "复位" },
            ].map(({ icon: Icon, action, label }) => (
              <button
                key={label}
                onClick={action}
                title={label}
                className="w-8 h-8 flex items-center justify-center bg-background/90 backdrop-blur-sm border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon size={14} />
              </button>
            ))}
          </div>

          {/* Hover card */}
          <AnimatePresence>
            {activeMarker && (
              <motion.div
                key={activeMarker.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
              >
                <Link
                  href={`/post/${activeMarker.id}`}
                  className="pointer-events-auto flex items-center gap-3 bg-background/90 backdrop-blur-sm border border-border px-5 py-3 shadow-sm whitespace-nowrap"
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

          {/* Hint */}
          <p className="absolute bottom-4 left-4 text-xs font-sans text-muted-foreground/50 tracking-wide select-none">
            滚轮缩放 · 拖拽平移
          </p>
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
