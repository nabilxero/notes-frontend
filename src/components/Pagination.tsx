interface Props {
  page: number;
  totalPages: number;
  total: number;
  onChange(page: number): void;
}

// Reusable Previous / Next control for every paginated list.
export function Pagination({ page, totalPages, total, onChange }: Props) {
  if (total === 0) return null;
  return (
    <div className="pagination">
      <button className="secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ← Previous
      </button>
      <span className="muted">
        Page {page} of {Math.max(totalPages, 1)} · {total} total
      </span>
      <button className="secondary" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next →
      </button>
    </div>
  );
}
