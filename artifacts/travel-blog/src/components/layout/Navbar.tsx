import { Link } from "wouter";

export function Navbar() {
  return (
    <header className="w-full py-12 px-6 md:px-12 flex justify-between items-center bg-transparent z-10">
      <Link href="/" className="font-serif text-2xl font-bold tracking-widest text-foreground hover:opacity-70 transition-opacity">
        旅途
      </Link>
      <nav className="flex items-center gap-8">
        <Link href="/" className="text-sm font-sans tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
          Journal
        </Link>
        <Link href="/map" className="text-sm font-sans tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
          地图
        </Link>
      </nav>
    </header>
  );
}
