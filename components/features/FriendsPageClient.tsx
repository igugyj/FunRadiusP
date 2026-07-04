"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/i18n";
import FriendCard from "@/components/ui/FriendCard";
import GlobalDialog from "@/components/ui/GlobalDialog";
import PageTitle from "@/components/ui/PageTitle";

interface Friend {
  name: string;
  link: string | string[];
  description: string;
  avatar: string;
}

interface CachedData {
  data: Friend[];
  timestamp: number;
}

const CACHE_KEY = "pblog_friends_cache";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
const ITEMS_PER_PAGE = parseInt(
  process.env.NEXT_PUBLIC_FRIENDS_ITEMS_PER_PAGE || "20",
  10,
);

export default function FriendsPageClient() {
  const { t } = useLanguage();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const loadFromCache = useCallback((): Friend[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      const parsed: CachedData = JSON.parse(cached);
      const now = Date.now();
      if (now - parsed.timestamp < CACHE_DURATION) {
        return parsed.data;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const saveToCache = useCallback((data: Friend[]) => {
    try {
      const cacheData: CachedData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch {
      // Ignore cache error
    }
  }, []);

  const fetchFriends = useCallback(async () => {
    const friendsUrl = process.env.NEXT_PUBLIC_FRIENDS_JSON_URL;
    if (!friendsUrl) {
      setError(t("friends.loadError"));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(friendsUrl, {
        redirect: "follow",
      });
      if (!response.ok) {
        console.warn("Network response not ok for friends, treating as empty");
        setFriends([]);
        saveToCache([]);
        setError(null);
        setLoading(false);
        return;
      }

      let data;
      const text = await response.text();

      // 处理空文件或空值的情况
      if (
        !text ||
        text.trim() === "" ||
        text.trim() === "[]" ||
        text.trim() === "{}"
      ) {
        data = [];
      } else {
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          // JSON 解析失败，按空数据处理
          console.warn(
            "Failed to parse friends JSON, treating as empty:",
            parseError,
          );
          data = [];
        }
      }

      const friendsData = Array.isArray(data) ? data : [];
      setFriends(friendsData);
      saveToCache(friendsData);
      setError(null);
    } catch (error) {
      // 所有错误都按空数据处理
      console.warn("Error loading friends, treating as empty:", error);
      setFriends([]);
      saveToCache([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [t, saveToCache]);

  useEffect(() => {
    const cachedData = loadFromCache();
    if (cachedData) {
      setFriends(cachedData);
      setLoading(false);
    }
    fetchFriends();
  }, [loadFromCache, fetchFriends]);

  const totalPages = Math.ceil(friends.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFriends = friends.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <PageTitle translationKey="friends.title" />
        <button
          onClick={() => setIsDialogOpen(true)}
          className="px-4 py-2 rounded-lg transition-all hover:opacity-80"
          style={{
            backgroundColor: "var(--primary)",
            color: "white",
          }}
        >
          {t("friends.howToAdd")}
        </button>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-lg" style={{ color: "var(--text)" }}>
            {t("common.loading")}
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-12">
          <div className="card p-6">
            <p className="text-lg" style={{ color: "var(--text)" }}>
              {error}
            </p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchFriends();
              }}
              className="mt-4 px-4 py-2 rounded-lg transition-all hover:opacity-80"
              style={{
                backgroundColor: "var(--primary)",
                color: "white",
              }}
            >
              {t("common.retry")}
            </button>
          </div>
        </div>
      )}

      {!loading && !error && friends.length === 0 && (
        <div className="text-center py-12">
          <div className="card p-6">
            <p className="text-lg" style={{ color: "var(--text)" }}>
              {t("friends.empty")}
            </p>
          </div>
        </div>
      )}

      {!loading && !error && friends.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {paginatedFriends.map((friend, index) => (
              <div key={index} className="entrance" style={{ animationDelay: `${index * 20}ms` }}>
                <FriendCard friend={friend} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--text)",
                }}
              >
                {t("friends.paginationPrev")}
              </button>
              <span
                className="px-4 py-2 flex items-center"
                style={{ color: "var(--text)" }}
              >
                {t("pagination.page", {
                  current: currentPage,
                  total: totalPages,
                })}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--text)",
                }}
              >
                {t("friends.paginationNext")}
              </button>
            </div>
          )}
        </>
      )}

      {/* 添加友链对话框 */}
      <GlobalDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            {t("friends.dialogTitle")}
          </h2>
          <button
            onClick={() => setIsDialogOpen(false)}
            className="text-2xl"
            style={{ color: "var(--text)" }}
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <a
              href="https://github.com/igugyj/pblog-comments/issues/new?template=friend-link-request.yml"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg transition-all hover:opacity-80"
              style={{
                backgroundColor: "var(--secondary)",
                color: "var(--text)",
              }}
            >
              <h3 className="font-semibold">{t("friends.dialogIssue")}</h3>
            </a>
            <a
              href="https://github.com/igugyj/pblog-comments/pulls"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg transition-all hover:opacity-80"
              style={{
                backgroundColor: "var(--secondary)",
                color: "var(--text)",
              }}
            >
              <h3 className="font-semibold">{t("friends.dialogPR")}</h3>
            </a>
            <a
              href="mailto:hello@pg25-lsae.eu.org"
              className="block p-4 rounded-lg transition-all hover:opacity-80"
              style={{
                backgroundColor: "var(--secondary)",
                color: "var(--text)",
              }}
            >
              <h3 className="font-semibold">{t("friends.dialogEmail")}</h3>
            </a>
            <a
              href="/about"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg transition-all hover:opacity-80"
              style={{
                backgroundColor: "var(--secondary)",
                color: "var(--text)",
              }}
            >
              <h3 className="font-semibold">{t("friends.dialogOther")}</h3>
            </a>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2" style={{ color: "var(--text)" }}>
              {t("friends.dialogDataFormat")}
            </h3>
            <pre
              className="p-4 rounded-lg text-sm overflow-x-auto"
              style={{ backgroundColor: "var(--secondary)" }}
            >
              {`{
  "name": "Pfolg",
  "link": ["https://pg25-lsae.eu.org","https://pfolg.qzz.io","https://github.com/csy214-beep","https://space.bilibili.com/515553532"],
  "description": "Seeking between the ebb and flow of binary tides.",
  "avatar": "https://avatars.githubusercontent.com/u/237149328"
}`}
            </pre>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsDialogOpen(false)}
            className="px-4 py-2 rounded-lg transition-all hover:opacity-80"
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
            }}
          >
            {t("common.close")}
          </button>
        </div>
      </GlobalDialog>
    </div>
  );
}
