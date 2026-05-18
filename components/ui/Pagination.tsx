'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const { t } = useLanguage();
  if (totalPages <= 1) return null;

  const getPageRange = () => {
    const range = [];
    const showPages = 5;
    const half = Math.floor(showPages / 2);

    let start = currentPage - half;
    let end = currentPage + half;

    if (start < 1) {
      start = 1;
      end = Math.min(showPages, totalPages);
    }

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, totalPages - showPages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageRange = getPageRange();

  return (
    <div className="flex justify-center mt-8">
      <nav className="inline-flex rounded-md shadow-sm">
        {currentPage > 1 && (
          <Link
            href={`${basePath}/${currentPage - 1}`}
            className="px-4 py-2 border rounded-l-md transition-colors hover:opacity-80"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--primary)",
              color: "var(--text)",
            }}
          >
            {t('pagination.prev')}
          </Link>
        )}

        {pageRange.map((page) => (
          <Link
            key={page}
            href={`${basePath}/${page}`}
            className={`px-4 py-2 border transition-colors hover:opacity-80`}
            style={{
              backgroundColor:
                page === currentPage ? "var(--primary)" : "var(--background)",
              borderColor: "var(--primary)",
              color: page === currentPage ? "white" : "var(--text)",
            }}
          >
            {page}
          </Link>
        ))}

        {currentPage < totalPages && (
          <Link
            href={`${basePath}/${currentPage + 1}`}
            className="px-4 py-2 border rounded-r-md transition-colors hover:opacity-80"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--primary)",
              color: "var(--text)",
            }}
          >
            {t('pagination.next')}
          </Link>
        )}
      </nav>
    </div>
  );
}