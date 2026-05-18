// components/GitHubCard/GitHubCard.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FaGithub } from "react-icons/fa";
import { useLanguage } from "@/lib/i18n";

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  followers: number;
  public_repos: number;
}

interface Repository {
  name: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
}

interface LanguageStat {
  name: string;
  count: number;
}

interface CacheData {
  user: GitHubUser;
  repos: Repository[];
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  topLanguages: LanguageStat[];
  popularRepos: Repository[];
  timestamp: number;
}

interface GitHubCardProps {
  username?: string;
  className?: string;
}

const CACHE_KEY_PREFIX = "github_card_";
const CACHE_TTL = 2 * 60 * 60 * 1000;

const IconStar = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconFork = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const IconUser = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconCommit = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="3" />
    <line x1="3" y1="12" x2="9" y2="12" />
    <line x1="15" y1="12" x2="21" y2="12" />
  </svg>
);

const IconRepo = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 4v16h16V4H4z" />
    <line x1="8" y1="9" x2="16" y2="9" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </svg>
);

const IconLocation = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconLink = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const IconStarSmall = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    style={{ color: "var(--primary)" }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const formatNumber = (num: number): string => {
  if (num >= 10000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
};

const getCachedData = (username: string): CacheData | null => {
  try {
    const key = CACHE_KEY_PREFIX + username;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const data: CacheData = JSON.parse(raw);
    if (Date.now() - data.timestamp < CACHE_TTL) return data;
    localStorage.removeItem(key);
    return null;
  } catch {
    return null;
  }
};

const setCachedData = (
  username: string,
  data: Omit<CacheData, "timestamp">,
) => {
  try {
    const key = CACHE_KEY_PREFIX + username;
    const toStore: CacheData = { ...data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(toStore));
  } catch (error) {
    console.warn("缓存写入失败", error);
  }
};

const fetchCommitCountForRepo = async (
  owner: string,
  repo: string,
): Promise<number> => {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "GitHubCardApp",
      },
    });
    if (!res.ok) return 0;
    const linkHeader = res.headers.get("Link");
    if (!linkHeader) {
      const data = await res.json();
      return Array.isArray(data) ? data.length : 0;
    }
    const lastMatch = linkHeader.match(/&page=(\d+)>; rel="last"/);
    if (lastMatch && lastMatch[1]) return parseInt(lastMatch[1], 10);
    const altMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
    if (altMatch && altMatch[1]) return parseInt(altMatch[1], 10);
    return 0;
  } catch {
    return 0;
  }
};

const deriveStatsFromRepos = (reposList: Repository[]) => {
  let stars = 0,
    forks = 0;
  const langMap = new Map<string, number>();
  const repoStarsList: Repository[] = [];

  for (const repo of reposList) {
    stars += repo.stargazers_count;
    forks += repo.forks_count;
    if (repo.language) {
      langMap.set(repo.language, (langMap.get(repo.language) || 0) + 1);
    }
    repoStarsList.push(repo);
  }

  const sortedLangs = Array.from(langMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const hotRepos = [...repoStarsList]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5);

  return {
    totalStars: stars,
    totalForks: forks,
    topLanguages: sortedLangs,
    popularRepos: hotRepos,
  };
};

const computeTotalCommits = async (
  owner: string,
  reposList: Repository[],
): Promise<number> => {
  let commitSum = 0;
  for (const repo of reposList) {
    const count = await fetchCommitCountForRepo(owner, repo.name);
    commitSum += count;
  }
  return commitSum;
};

const GitHubCard: React.FC<GitHubCardProps> = ({
  username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "",
  className = "",
}) => {
  // 如果用户名为空，不渲染组件
  if (!username) {
    return null;
  }

  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(true);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalStars, setTotalStars] = useState(0);
  const [totalForks, setTotalForks] = useState(0);
  const [totalCommits, setTotalCommits] = useState<number | null>(null);
  const [topLanguages, setTopLanguages] = useState<LanguageStat[]>([]);
  const [popularRepos, setPopularRepos] = useState<Repository[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const cached = getCachedData(username);
    if (cached) {
      setUser(cached.user);
      setTotalStars(cached.totalStars);
      setTotalForks(cached.totalForks);
      setTotalCommits(cached.totalCommits);
      setTopLanguages(cached.topLanguages);
      setPopularRepos(cached.popularRepos);
      setLoading(false);
      return;
    }

    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`, {
        headers: { "User-Agent": "GitHubCardApp" },
      });
      if (!userRes.ok) throw new Error(`GitHub API 错误: ${userRes.status}`);
      const userData: GitHubUser = await userRes.json();

      const reposRes = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
        {
          headers: { "User-Agent": "GitHubCardApp" },
        },
      );
      if (!reposRes.ok) throw new Error(`无法获取仓库信息`);
      const reposData: Repository[] = await reposRes.json();

      const {
        totalStars: s,
        totalForks: f,
        topLanguages: langs,
        popularRepos: popular,
      } = deriveStatsFromRepos(reposData);
      const commits = await computeTotalCommits(username, reposData);

      setUser(userData);
      setTotalStars(s);
      setTotalForks(f);
      setTotalCommits(commits);
      setTopLanguages(langs);
      setPopularRepos(popular);

      setCachedData(username, {
        user: userData,
        repos: reposData,
        totalStars: s,
        totalForks: f,
        totalCommits: commits,
        topLanguages: langs,
        popularRepos: popular,
      });
    } catch (err: any) {
      setError(err.message || "加载失败");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div
        className={`card ${className}`}
        style={{ textAlign: "center", padding: "3rem" }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            margin: "0 auto 1rem",
            border: "3px solid var(--secondary)",
            borderTopColor: "var(--primary)",
            borderRadius: "50%",
            animation: "spin 0.6s linear infinite",
          }}
        ></div>
        <p style={{ color: "var(--text)" }}>{t("gitHubCard.loading")}</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div
        className={`card ${className}`}
        style={{
          textAlign: "center",
          padding: "2rem",
          backgroundColor: "color-mix(in srgb, var(--primary) 5%, transparent)",
        }}
      >
        <p style={{ color: "var(--text)" }}>
          ⚠️ {error || t("gitHubCard.error")}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`card ${className}`}
      style={{ maxWidth: "900px", width: "100%" }}
    >
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          userSelect: "none",
          padding: "0.5rem 0",
        }}
      >
        <div
          style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.85rem",
          fontWeight: 600,
          color: "var(--primary)",
          }}
        >
          <FaGithub size="18" />
          <span>{t("gitHubCard.githubProfile")} — @{user.login}</span>
        </div>
        <span
          style={{
            transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 0.2s",
            color: "var(--text)",
            opacity: 0.5,
          }}
        >
          ▼
        </span>
      </div>

      {!collapsed && (
        <>
      <div
        style={{
          display: "flex",
          gap: "1.2rem",
          marginBottom: "1.8rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
        className="github-card-user-info"
      >
        <img
          src={user.avatar_url}
          alt={user.login}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid var(--secondary)",
          }}
        />
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              margin: "0 0 4px 0",
              color: "var(--text)",
            }}
          >
            {user.name || user.login}
          </h1>
          <div
            style={{
              fontSize: "0.9rem",
              color: "var(--text)",
              opacity: 0.7,
              marginBottom: "6px",
            }}
          >
            @{user.login}
          </div>
          {user.bio && (
            <div
              style={{
                fontSize: "0.85rem",
                color: "var(--text)",
                marginBottom: "8px",
              }}
            >
              {user.bio}
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "0.8rem",
            }}
          >
            {user.location && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "var(--primary)",
                }}
              >
                <IconLocation /> {user.location}
              </span>
            )}
            {user.blog && (
              <a
                href={
                  user.blog.startsWith("http")
                    ? user.blog
                    : `https://${user.blog}`
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  textDecoration: "none",
                  color: "var(--primary)",
                }}
              >
                <IconLink /> {user.blog}
              </a>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "0.8rem",
          marginBottom: "1.8rem",
        }}
        className="github-card-stats-grid"
      >
        {[
          {
            icon: <IconStar />,
            number: formatNumber(totalStars),
            label: t("gitHubCard.starsEarned"),
          },
          {
            icon: <IconFork />,
            number: formatNumber(totalForks),
            label: t("gitHubCard.totalForks"),
          },
          {
            icon: <IconUser />,
            number: user.followers,
            label: t("gitHubCard.followers"),
          },
          {
            icon: <IconCommit />,
            number: totalCommits !== null ? formatNumber(totalCommits) : "...",
            label: t("gitHubCard.totalCommits"),
          },
          {
            icon: <IconRepo />,
            number: user.public_repos,
            label: t("gitHubCard.repositories"),
          },
          {
            icon: <IconStar />,
            number: topLanguages[0]?.name || "—",
            label: t("gitHubCard.topLanguage"),
          },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "var(--secondary)",
              borderRadius: "1rem",
              padding: "0.8rem 0.4rem",
              textAlign: "center",
              transition: "all 0.1s",
              border: "1px solid var(--card-border)",
            }}
            className="github-card-stat-item"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "6px",
                color: "var(--primary)",
                opacity: 0.8,
              }}
            >
              {item.icon}
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--text)",
                lineHeight: 1.2,
              }}
              className="github-card-stat-number"
            >
              {item.number}
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                color: "var(--text)",
                opacity: 0.7,
                marginTop: "4px",
              }}
              className="github-card-stat-label"
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundColor: "var(--secondary)",
          borderRadius: "1.2rem",
          padding: "1rem 1.2rem",
          marginBottom: "1.5rem",
          border: "1px solid var(--card-border)",
        }}
        className="github-card-languages"
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "1rem",
            color: "var(--text)",
            marginBottom: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <IconStar /> {t("gitHubCard.topLanguages")}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {topLanguages.length ? (
            topLanguages.map((lang, idx) => (
              <div
                key={lang.name}
                style={{
                  backgroundColor: "var(--background)",
                  borderRadius: "40px",
                  padding: "4px 12px",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: "6px",
                  border: "1px solid var(--card-border)",
                }}
              >
                <span style={{ fontWeight: 700, color: "var(--primary)" }}>
                  {idx + 1}
                </span>
                <span style={{ color: "var(--text)" }}>{lang.name}</span>
              </div>
            ))
          ) : (
            <div
              style={{
                backgroundColor: "var(--background)",
                borderRadius: "40px",
                padding: "4px 12px",
                fontSize: "0.8rem",
                fontWeight: 500,
                border: "1px solid var(--card-border)",
              }}
            >
              {t("gitHubCard.noLanguage")}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "0.5rem" }} className="github-card-repos">
        <div
          style={{
            fontWeight: 700,
            fontSize: "1rem",
            color: "var(--text)",
            marginBottom: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <IconStar /> {t("gitHubCard.mostPopularRepos")}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {popularRepos.map((repo) => (
            <a
              key={repo.name}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "var(--secondary)",
                padding: "8px 12px",
                borderRadius: "14px",
                textDecoration: "none",
                transition: "all 0.1s",
                border: "1px solid var(--card-border)",
              }}
              className="hover:border-primary transition-all duration-100 github-card-repo-item"
            >
              <span
                style={{
                  fontWeight: 600,
                  color: "var(--primary)",
                  fontSize: "0.85rem",
                }}
              >
                {repo.name}
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.75rem",
                  backgroundColor: "var(--background)",
                  padding: "3px 8px",
                  borderRadius: "30px",
                  fontWeight: 500,
                  color: "var(--text)",
                  border: "1px solid var(--card-border)",
                }}
              >
                <IconStarSmall /> {formatNumber(repo.stargazers_count)}
              </span>
            </a>
          ))}
          {popularRepos.length === 0 && (
            <div
              style={{
                backgroundColor: "var(--secondary)",
                padding: "8px 12px",
                borderRadius: "14px",
                border: "1px solid var(--card-border)",
              }}
            >
              {t("gitHubCard.noRepos")}
            </div>
          )}
        </div>
      </div>

        </>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .github-card-user-info {
            flex-direction: column;
            text-align: center;
          }

          .github-card-user-info > div {
            flex: none !important;
            width: 100%;
          }

          .github-card-stats-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }

          .github-card-stat-number {
            font-size: 1.2rem !important;
          }

          .github-card-stat-label {
            font-size: 0.65rem !important;
          }

          .github-card-stat-item {
            padding: 0.6rem 0.3rem !important;
          }
        }

        @media (max-width: 480px) {
          .github-card-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          .github-card-languages {
            padding: 0.8rem 1rem !important;
          }

          .github-card-repo-item {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 6px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default GitHubCard;
