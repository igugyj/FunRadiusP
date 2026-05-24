"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

const ITEMS_PER_PAGE = 20;
const SNIPPET_RADIUS = 60;

interface Entry {
  t: "p" | "d" | "m" | "e";
  a: string;
  s: string;
  u: string;
}

const TYPE_BADGE: Record<string, string> = {
  p: "POST",
  d: "DOC",
  m: "MOMENT",
  e: "DEMO",
};

const TYPE_COLOR: Record<string, string> = {
  p: "var(--primary)",
  d: "#6366f1",
  m: "#f59e0b",
  e: "#10b981",
};

function extractSnippet(text: string, query: string): string {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return text.slice(0, SNIPPET_RADIUS * 2) + (text.length > SNIPPET_RADIUS * 2 ? "..." : "");
  const start = Math.max(0, idx - SNIPPET_RADIUS);
  const end = Math.min(text.length, idx + q.length + SNIPPET_RADIUS);
  let snippet = text.slice(start, end).trim();
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet += "...";
  return snippet;
}

export default function SearchClient() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [entries, setEntries] = useState<Entry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState(query);

  useEffect(() => {
    fetch("/search-index.ndjson")
      .then((r) => r.text())
      .then((text) => {
        const list: Entry[] = [];
        for (const line of text.trim().split("\n")) {
          if (!line) continue;
          try { list.push(JSON.parse(line)); } catch {}
        }
        setEntries(list);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const filtered = entries.filter((e) => {
    if (!query) return false;
    const q = query.toLowerCase();
    return e.a.toLowerCase().includes(q) || e.s.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paged = filtered.slice(start, start + ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [query]);

  function handleSearch() {
    const q = inputValue.trim();
    if (!q) return;
    router.push("/search?q=" + encodeURIComponent(q));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 搜索框 */}
      <div className="search-page-bar">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("search.placeholder")}
          className="search-page-input"
        />
        <button
          onClick={handleSearch}
          className="search-page-btn"
          aria-label={t("search.search")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </button>
      </div>

      {/* 搜索提示 */}
      {loaded && !query && (
        <p className="text-center mt-12" style={{ color: "var(--text)", opacity: 0.5 }}>
          {t("search.noQuery")}
        </p>
      )}

      {loaded && query && filtered.length === 0 && (
        <p className="text-center mt-12" style={{ color: "var(--text)", opacity: 0.5 }}>
          {t("search.noResults")}
        </p>
      )}

      {!loaded && (
        <p className="text-center mt-12" style={{ color: "var(--text)" }}>
          {t("common.loading")}
        </p>
      )}

      {/* 结果列表 */}
      {loaded && query && filtered.length > 0 && (
        <>
          <p className="mb-4 text-sm" style={{ color: "var(--text)", opacity: 0.5 }}>
            {t("search.resultCount", { count: filtered.length })}
          </p>

          <div className="space-y-1">
            {paged.map((entry, i) => (
              <Link
                key={i}
                href={entry.u}
                className="search-result-card"
              >
                <span
                  className="search-type-badge"
                  style={{
                    backgroundColor: TYPE_COLOR[entry.t] + "20",
                    color: TYPE_COLOR[entry.t],
                  }}
                >
                  {TYPE_BADGE[entry.t]}
                </span>
                <span className="search-result-title">{entry.a}</span>
                {entry.s && (
                  <>
                    <span className="search-result-sep">·</span>
                    <span className="search-result-snippet">
                      {extractSnippet(entry.s, query)}
                    </span>
                  </>
                )}
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80"
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--text)",
                }}
              >
                {t("pagination.prev")}
              </button>
              <span className="text-sm" style={{ color: "var(--text)" }}>
                {t("pagination.page", { current: page, total: totalPages })}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80"
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--text)",
                }}
              >
                {t("pagination.next")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
