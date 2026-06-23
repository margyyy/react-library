import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export function HomeNav() {
  return (
    <div>
      <nav className="fixed top-0 z-50 flex w-full items-center gap-2 border-b border-purple-900/30 bg-[#1a1625]/60 p-2 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Link to={"/"} className="rounded-full p-2 transition-colors hover:bg-white/10">
            <Home size={20} className="text-purple-200" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
