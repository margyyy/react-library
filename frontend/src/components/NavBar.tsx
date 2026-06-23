import { useEffect, useState } from "react";
import { ArrowLeft, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export function NavBar() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") ?? "";
  const [pageInput, setPageInput] = useState(String(page));

  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  const onPageChange = (val: number) => {
    const newPage = Math.max(1, val);
    const next = new URLSearchParams(searchParams);
    next.set("page", String(newPage));
    setSearchParams(next);
  };

  const onSearch = (value: string) => {
    const next = new URLSearchParams();
    next.set("page", "1");
    if (value.trim()) next.set("search", value.trim());
    setSearchParams(next);
  };

  return (
    <div>
      <nav className="fixed top-0 w-full flex items-center gap-2 p-2 z-50 bg-[#1a1625]/60 backdrop-blur-md border-b border-purple-900/30">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-purple-200" />
          </button>
          <Link to={"/"} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Home size={20} className="text-purple-200" />
          </Link>
        </div>
        <input
          name="search by BookName"
          placeholder="Search by title"
          defaultValue={search}
          className="bg-[#2a2040] border border-purple-700/40 text-purple-100 text-sm rounded-full block w-full px-4 py-1.5 focus:ring-purple-500 focus:border-purple-500 outline-none shadow-sm placeholder:text-purple-300/50"
          type="text"
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className="flex items-center gap-1">
          <button onClick={() => onPageChange(page - 1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft size={20} className="text-purple-200" />
          </button>
          <button onClick={() => onPageChange(page + 1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronRight size={20} className="text-purple-200" />
          </button>
        </div>
        <input
          name="page changer"
          placeholder="Pag."
          value={pageInput}
          className="bg-[#2a2040] border border-purple-700/40 text-purple-100 text-sm rounded-full w-20 px-2 py-1.5 text-center focus:ring-purple-500 focus:border-purple-500 outline-none shadow-sm placeholder:text-purple-300/50"
          onChange={(e) => {
            const value = e.target.value;
            setPageInput(value);

            if (value === "") return;

            const number = Number(value);
            if (!isNaN(number) && number > 0) onPageChange(number);
          }}
          onBlur={() => {
            if (pageInput === "") setPageInput(String(page));
          }}
        />
      </nav>
    </div>
  );
}
