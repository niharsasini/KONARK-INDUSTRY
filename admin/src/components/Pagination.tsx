"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * itemsPerPage + 1;
  const end = Math.min(page * itemsPerPage, totalItems);

  let pageNumbers: number[];
  if (totalPages <= 5) {
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else if (page <= 3) {
    pageNumbers = [1, 2, 3, 4, 5];
  } else if (page >= totalPages - 2) {
    pageNumbers = Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
  } else {
    pageNumbers = Array.from({ length: 5 }, (_, i) => page - 2 + i);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 0",
        borderTop: "1px solid #e8dfd0",
        marginTop: 16,
      }}
    >
      <span style={{ color: "#6b5a45", fontSize: 13 }}>
        Showing {start}–{end} of {totalItems}
      </span>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          style={{
            background: "#ffffff",
            border: "1px solid #e8dfd0",
            color: page === 1 ? "#6b5a45" : "#1a0f00",
            padding: "6px 14px",
            borderRadius: 8,
            cursor: page === 1 ? "not-allowed" : "pointer",
            fontSize: 13,
          }}
        >
          ← Prev
        </button>

        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            style={{
              background: pageNum === page ? "#0f4c81" : "#ffffff",
              border: "1px solid #e8dfd0",
              color: pageNum === page ? "#ffffff" : "#1a0f00",
              padding: "6px 12px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: pageNum === page ? 700 : 400,
              fontSize: 13,
            }}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          style={{
            background: "#ffffff",
            border: "1px solid #e8dfd0",
            color: page === totalPages ? "#6b5a45" : "#1a0f00",
            padding: "6px 14px",
            borderRadius: 8,
            cursor: page === totalPages ? "not-allowed" : "pointer",
            fontSize: 13,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
