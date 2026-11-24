import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Button, Empty, Icon, Menu, Search, Select } from "../ui";
import { downloadText } from "../state";
export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  sort?: (row: T) => string | number;
}
export function DataTable<T extends { id: number | string }>({
  rows,
  columns,
  selectable = false,
  searchable = false,
  pageSize = 5,
  pageOptions = ["5", "10", "20"],
  onEdit,
  onDelete,
  actions,
  compact = false,
  pagination = true,
  striped = false,
  expandable = false,
  draggable = false,
  onReorder,
  filterable = false,
  toolbar,
  emptyText = "No records to display",
  exportable = false,
  defaultSortKey = "",
  reportedTotal,
}: {
  rows: T[];
  columns: Column<T>[];
  selectable?: boolean;
  searchable?: boolean;
  pageSize?: number;
  pageOptions?: string[];
  onEdit?: (r: T) => void;
  onDelete?: (r: T) => void;
  actions?: (r: T) => ReactNode;
  compact?: boolean;
  pagination?: boolean;
  striped?: boolean;
  expandable?: boolean;
  draggable?: boolean;
  onReorder?: (rows: T[]) => void;
  filterable?: boolean;
  toolbar?: ReactNode;
  emptyText?: string;
  exportable?: boolean;
  defaultSortKey?: string;
  /** Preserves a reference display quirk for the eCommerce orders counter. */
  reportedTotal?: number;
}) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ key: string; dir: number }>({
    key: defaultSortKey,
    dir: 1,
  });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(pageSize);
  const [selected, setSelected] = useState<(number | string)[]>([]);
  const [expanded, setExpanded] = useState<(number | string)[]>([]);
  const [drag, setDrag] = useState<number | string | null>(null);
  const check = useRef<HTMLInputElement>(null);
  const data = useMemo(
    () =>
      rows
        .filter((row) => {
          const record = row as Record<string, unknown>;
          return (
            Object.values(record)
              .join(" ")
              .toLowerCase()
              .includes(query.toLowerCase()) &&
            columns.every(
              (c) =>
                !filters[c.key] ||
                String(c.sort ? c.sort(row) : (record[c.key] ?? ""))
                  .toLowerCase()
                  .includes(filters[c.key].toLowerCase()),
            )
          );
        })
        .sort((a, b) => {
          const c = columns.find((c) => c.key === sort.key);
          if (!c) return 0;
          const av = c.sort
              ? c.sort(a)
              : String((a as Record<string, unknown>)[c.key] ?? ""),
            bv = c.sort
              ? c.sort(b)
              : String((b as Record<string, unknown>)[c.key] ?? "");
          return (
            (typeof av === "number" && typeof bv === "number"
              ? av - bv
              : String(av).localeCompare(String(bv))) * sort.dir
          );
        }),
    [rows, columns, query, filters, sort],
  );
  const pages = Math.max(1, Math.ceil(data.length / size));
  const safePage = Math.min(page, pages - 1);
  const visible = pagination
    ? data.slice(safePage * size, (safePage + 1) * size)
    : data;
  const quirkyTotal =
    reportedTotal !== undefined && safePage === 0 && size === pageSize;
  const footerTotal = quirkyTotal ? reportedTotal : data.length;
  const footerEnd = quirkyTotal
    ? Math.min(pageSize, reportedTotal)
    : Math.min((safePage + 1) * size, data.length);
  const all =
    visible.length > 0 && visible.every((r) => selected.includes(r.id));
  useEffect(() => {
    if (check.current)
      check.current.indeterminate =
        !all && visible.some((r) => selected.includes(r.id));
  }, [selected, visible, all]);
  const changeSearch = (s: string) => {
    setQuery(s);
    setPage(0);
  };
  function exportCsv() {
    const escape = (s: unknown) =>
      '"' + String(s ?? "").replaceAll('"', '""') + '"';
    downloadText(
      "ruthless-records.csv",
      [
        columns.map((c) => escape(c.label)).join(","),
        ...data.map((r) =>
          columns
            .map((c) =>
              escape(
                c.sort ? c.sort(r) : (r as Record<string, unknown>)[c.key],
              ),
            )
            .join(","),
        ),
      ].join("\n"),
      "text/csv",
    );
  }
  return (
    <div className="data-table">
      <div
        className={
          searchable || toolbar || exportable ? "table-toolbar" : "hidden"
        }
      >
        {searchable && (
          <Search
            value={query}
            onChange={changeSearch}
            placeholder="Search records..."
          />
        )}
        {toolbar}
        {exportable && (
          <Button onClick={exportCsv}>
            <Icon name="Download" size={15} />
            Export CSV
          </Button>
        )}
        {selected.length > 0 && (
          <span className="muted">{selected.length} selected</span>
        )}
      </div>
      <div className="table-scroll">
        <table
          className={`${compact ? "dense " : ""}${striped ? "striped " : ""}`}
        >
          <thead>
            <tr>
              {draggable && <th aria-label="Drag handle" />}
              {expandable && <th />}
              {selectable && (
                <th className="check-cell">
                  <input
                    ref={check}
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={all}
                    onChange={() =>
                      setSelected(
                        all
                          ? selected.filter(
                              (id) => !visible.some((r) => r.id === id),
                            )
                          : [
                              ...new Set([
                                ...selected,
                                ...visible.map((r) => r.id),
                              ]),
                            ],
                      )
                    }
                  />
                </th>
              )}
              {columns.map((c) => (
                <th
                  key={c.key}
                  aria-sort={
                    sort.key === c.key
                      ? sort.dir === 1
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <button
                    className="sort-button"
                    onClick={() =>
                      setSort({
                        key: c.key,
                        dir: sort.key === c.key ? -sort.dir : 1,
                      })
                    }
                  >
                    {c.label}
                    <Icon name="ArrowDownUp" size={13} />
                  </button>
                  {filterable && (
                    <input
                      aria-label={"Filter " + c.label}
                      placeholder={"Search " + c.label}
                      value={filters[c.key] || ""}
                      onChange={(e) => {
                        setFilters({ ...filters, [c.key]: e.target.value });
                        setPage(0);
                      }}
                    />
                  )}
                </th>
              ))}
              {(onEdit || onDelete || actions) && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <Row
                key={row.id}
                row={row}
                columns={columns}
                selected={selected.includes(row.id)}
                selectable={selectable}
                onSelect={() =>
                  setSelected(
                    selected.includes(row.id)
                      ? selected.filter((x) => x !== row.id)
                      : [...selected, row.id],
                  )
                }
                expanded={expanded.includes(row.id)}
                onExpand={() =>
                  setExpanded(
                    expanded.includes(row.id)
                      ? expanded.filter((x) => x !== row.id)
                      : [...expanded, row.id],
                  )
                }
                expandable={expandable}
                onEdit={onEdit}
                onDelete={onDelete}
                actions={actions}
                draggable={draggable}
                onDrag={() => setDrag(row.id)}
                onDrop={() => {
                  if (drag === null || drag === row.id || !onReorder) return;
                  const a = [...rows],
                    from = a.findIndex((r) => r.id === drag),
                    to = a.findIndex((r) => r.id === row.id);
                  a.splice(to, 0, ...a.splice(from, 1));
                  onReorder(a);
                  setDrag(null);
                }}
              />
            ))}
          </tbody>
        </table>
        {!data.length && (
          <Empty
            title={emptyText}
            text="Try clearing your search and filters."
          />
        )}
      </div>
      {pagination && (
        <div className="pagination">
          <div>
            <span>Show</span>
            <Select
              label="Rows per page"
              value={String(size)}
              options={pageOptions}
              onChange={(v) => {
                setSize(Number(v));
                setPage(0);
              }}
            />
            <span>per page</span>
          </div>
          <div>
            <span>
              {data.length ? safePage * size + 1 : 0}-{footerEnd} of {footerTotal}
            </span>
            <Button
              variant="ghost"
              aria-label="Previous page"
              disabled={!safePage}
              onClick={() => setPage(safePage - 1)}
            >
              <Icon name="ArrowLeft" />
            </Button>
            <span className="page-number">{safePage + 1}</span>
            <Button
              variant="ghost"
              aria-label="Next page"
              disabled={safePage >= pages - 1}
              onClick={() => setPage(safePage + 1)}
            >
              <Icon name="ArrowRight" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
function Row<T extends { id: number | string }>({
  row,
  columns,
  selected,
  selectable,
  onSelect,
  expanded,
  onExpand,
  expandable,
  onEdit,
  onDelete,
  actions,
  draggable,
  onDrag,
  onDrop,
}: {
  row: T;
  columns: Column<T>[];
  selected: boolean;
  selectable: boolean;
  onSelect: () => void;
  expanded: boolean;
  onExpand: () => void;
  expandable: boolean;
  onEdit?: (r: T) => void;
  onDelete?: (r: T) => void;
  actions?: (r: T) => ReactNode;
  draggable: boolean;
  onDrag: () => void;
  onDrop: () => void;
}) {
  return (
    <>
      <tr
        className={selected ? "selected" : ""}
        draggable={draggable}
        onDragStart={onDrag}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        {draggable && (
          <td>
            <Icon name="GripVertical" size={16} />
          </td>
        )}
        {expandable && (
          <td>
            <button
              className="icon-button"
              aria-label="Expand row"
              aria-expanded={expanded}
              onClick={onExpand}
            >
              <Icon
                name={expanded ? "ChevronDown" : "ChevronRight"}
                size={15}
              />
            </button>
          </td>
        )}
        {selectable && (
          <td className="check-cell">
            <input
              type="checkbox"
              aria-label={"Select row " + row.id}
              checked={selected}
              onChange={onSelect}
            />
          </td>
        )}
        {columns.map((c) => (
          <td key={c.key}>
            {c.render
              ? c.render(row)
              : String((row as Record<string, unknown>)[c.key] ?? "")}
          </td>
        ))}
        {(onEdit || onDelete || actions) && (
          <td>
            {actions ? (
              actions(row)
            ) : (
              <Menu
                items={[
                  ...(onEdit
                    ? [{ label: "Edit", onClick: () => onEdit(row) }]
                    : []),
                  ...(onDelete
                    ? [
                        {
                          label: "Delete",
                          onClick: () => onDelete(row),
                          danger: true,
                        },
                      ]
                    : []),
                ]}
              />
            )}
          </td>
        )}
      </tr>
      {expanded && (
        <tr>
          <td colSpan={columns.length + 4}>
            <div className="expanded-record">
              {Object.entries(row).map(([k, v]) => (
                <div key={k}>
                  <strong>{k}</strong>
                  <span>
                    {typeof v === "object" ? JSON.stringify(v) : String(v)}
                  </span>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
