import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  contacts,
  money,
  orders,
  people,
  type Person,
  type Order,
} from "../data";
import { usePersisted, useWorkspace } from "../state";
import {
  Avatar,
  Badge,
  Button,
  Confirm,
  Field,
  Icon,
  IconButton,
  Modal,
  PageTitle,
  Search,
  Tabs,
} from "../ui";
import { DataTable, type Column } from "../components/DataTable";
export function TablesPage() {
  const { pathname } = useLocation();
  if (pathname.endsWith("user-datatable")) return <UsersTable />;
  if (pathname.endsWith("order-datatable")) return <OrdersTable />;
  return <ExampleTables key={pathname} />;
}
function UsersTable() {
  const [rows, setRows] = usePersisted("users", people);
  const [tab, setTab] = useState("All");
  const [editing, setEditing] = useState<Person | null>(null);
  const [deleting, setDeleting] = useState<Person | null>(null);
  const { toast } = useWorkspace();
  const columns: Column<Person>[] = [
    {
      key: "name",
      label: "Name",
      render: (r) => (
        <div className="person-cell">
          <Avatar i={r.id} />
          <strong>{r.name}</strong>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (r) => (
        <Badge tone={r.role === "Admin" ? "green" : "neutral"}>{r.role}</Badge>
      ),
    },
    { key: "age", label: "Age" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
  ];
  return (
    <>
      <PageTitle title="User Table" />
      <section className="card">
        <div className="table-titlebar">
          <Tabs
            items={[
              "All",
              "Admin",
              "User",
              "Superadmin",
              "Moderator",
              "Author",
            ]}
            value={tab}
            onChange={setTab}
          />
          <Button
            variant="primary"
            onClick={() =>
              setEditing({
                id: Date.now(),
                name: "",
                role: "User",
                email: "",
                phone: "",
                age: 18,
                company: "",
                address: "",
                notes: "",
              })
            }
          >
            <Icon name="Plus" size={16} />
            Create User
          </Button>
        </div>
        <DataTable
          rows={rows.filter((r) => tab === "All" || r.role === tab)}
          columns={columns}
          selectable
          searchable
          pageSize={10}
          exportable
          onEdit={setEditing}
          onDelete={setDeleting}
        />
      </section>
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={
          rows.some((r) => r.id === editing?.id) ? "Edit User" : "Create User"
        }
      >
        {editing && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setRows(
                rows.some((r) => r.id === editing.id)
                  ? rows.map((r) => (r.id === editing.id ? editing : r))
                  : [editing, ...rows],
              );
              setEditing(null);
              toast("User saved to this workspace.");
            }}
          >
            <div className="form-grid">
              {(["name", "email", "phone", "age"] as const).map((k) => (
                <Field key={k} label={k}>
                  <input
                    required
                    aria-label={k}
                    type={
                      k === "email" ? "email" : k === "age" ? "number" : "text"
                    }
                    min={1}
                    value={editing[k]}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        [k]:
                          k === "age" ? Number(e.target.value) : e.target.value,
                      })
                    }
                  />
                </Field>
              ))}
              <Field label="Role">
                <select
                  value={editing.role}
                  onChange={(e) =>
                    setEditing({ ...editing, role: e.target.value })
                  }
                >
                  {["Admin", "User", "Superadmin", "Moderator", "Author"].map(
                    (s) => (
                      <option key={s}>{s}</option>
                    ),
                  )}
                </select>
              </Field>
            </div>
            <div className="form-actions">
              <Button type="button" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button variant="primary">Save user</Button>
            </div>
          </form>
        )}
      </Modal>
      <Confirm
        open={!!deleting}
        title="Delete user?"
        onClose={() => setDeleting(null)}
        onConfirm={() => setRows(rows.filter((x) => x.id !== deleting?.id))}
      />
    </>
  );
}
function OrdersTable() {
  const [rows, setRows] = usePersisted("orders", orders);
  const [status, setStatus] = useState("All Status");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState<Order | null>(null);
  const summary = [
    ["$95.3k", "Income"],
    ["485", "Pending"],
    ["996", "Shipping"],
    ["1.4k", "Completed"],
    ["2.1k", "Processing"],
    ["1.1k", "Cancelled"],
  ];
  return (
    <>
      <PageTitle title="Order Table" />
      <div className="summary-metrics">
        {summary.map(([v, l]) => (
          <button
            key={l}
            onClick={() =>
              setStatus(
                l === "Income"
                  ? "All Status"
                  : l === "Shipping"
                    ? "Shipped"
                    : l,
              )
            }
          >
            <strong>{v}</strong>
            <span>{l}</span>
          </button>
        ))}
      </div>
      <section className="card">
        <div className="card-header">
          <h2>Orders Table</h2>
        </div>
        <div className="table-toolbar">
          <Search
            value={query}
            onChange={setQuery}
            placeholder="Order ID or customer name"
          />
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {[
              "All Status",
              "Pending",
              "Completed",
              "Shipped",
              "Cancelled",
              "Processing",
            ].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <input
            type="date"
            aria-label="Filter order date"
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            onClick={() => {
              setStatus("All Status");
              setQuery("");
            }}
          >
            Clear filters
          </Button>
        </div>
        <DataTable
          rows={rows.filter(
            (r) =>
              (status === "All Status" || r.status === status) &&
              Object.values(r)
                .join(" ")
                .toLowerCase()
                .includes(query.toLowerCase()),
          )}
          columns={[
            { key: "order", label: "Order ID" },
            { key: "customer", label: "Customer" },
            {
              key: "status",
              label: "Status",
              render: (r) => <Badge>{r.status}</Badge>,
            },
            { key: "date", label: "Date" },
            {
              key: "amount",
              label: "Amount",
              render: (r) => money(r.amount),
              sort: (r) => r.amount,
            },
            { key: "address", label: "Address" },
          ]}
          selectable
          pageSize={10}
          onEdit={setEditing}
          onDelete={setDeleting}
          exportable
        />
      </section>
      <Modal
        open={!!editing}
        title="Edit Order"
        onClose={() => setEditing(null)}
      >
        {editing && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setRows(rows.map((r) => (r.id === editing.id ? editing : r)));
              setEditing(null);
            }}
          >
            <Field label="Customer">
              <input
                required
                value={editing.customer}
                onChange={(e) =>
                  setEditing({ ...editing, customer: e.target.value })
                }
              />
            </Field>
            <Field label="Status">
              <select
                value={editing.status}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value })
                }
              >
                {[
                  "Pending",
                  "Completed",
                  "Shipped",
                  "Cancelled",
                  "Processing",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Address">
              <textarea
                value={editing.address}
                onChange={(e) =>
                  setEditing({ ...editing, address: e.target.value })
                }
              />
            </Field>
            <Button variant="primary">Save changes</Button>
          </form>
        )}
      </Modal>
      <Confirm
        open={!!deleting}
        title="Delete order?"
        onClose={() => setDeleting(null)}
        onConfirm={() => setRows(rows.filter((x) => x.id !== deleting?.id))}
      />
    </>
  );
}
interface Example {
  id: number;
  name: string;
  role: string;
  project: string;
  team: string;
  status: string;
  budget: number;
  progress: number;
}
const initial: Example[] = [
  "Sunil Joshi",
  "Andrew McDownland",
  "Christopher Jamil",
  "Nirav Joshi",
  "Micheal Doe",
].map((name, i) => ({
  id: i + 1,
  name,
  role: [
    "Web Designer",
    "Project Manager",
    "Project Manager",
    "Frontend Engineer",
    "Content Writer",
  ][i],
  project: [
    "Elite Admin",
    "Real Homes WP Theme",
    "MedicalPro WP Theme",
    "Hosting Press HTML",
    "Helping Hands WP Theme",
  ][i],
  team: ["S D", "N X A", "X", "X Y", "S"][i],
  status: ["Active", "Pending", "Completed", "Active", "Cancel"][i],
  budget: [3900, 24500, 12800, 2400, 9300][i],
  progress: [60, 30, 45, 37, 87][i],
}));
function ExampleTables() {
  const { pathname } = useLocation();
  const kind = pathname.split("/").at(-1)!;
  const [rows, setRows] = useState(
    kind === "empty"
      ? []
      : kind === "pagination" || kind === "sticky"
        ? [
            ...initial,
            ...initial.map((r) => ({ ...r, id: r.id + 5 })),
            ...initial.map((r) => ({ ...r, id: r.id + 10 })),
          ]
        : initial,
  );
  const [dense, setDense] = useState(false);
  const [visible, setVisible] = useState([
    "name",
    "project",
    "team",
    "status",
    "budget",
  ]);
  const [editing, setEditing] = useState<Example | null>(null);
  const title =
    (
      {
        basic: "Basic Table",
        "striped-row": "Striped Table",
        "hover-table": "Hover Table",
        "checkbox-table": "Checkbox Table",
        columnvisibility: "Column Visibility Table",
        "row-selection": "Row Selection Table",
        "drag-drop": "Drag & Drop Table",
      } as Record<string, string>
    )[kind] || kind.charAt(0).toUpperCase() + kind.slice(1) + " Table";
  const columns: Column<Example>[] = [
    {
      key: "name",
      label: "User",
      render: (r) => (
        <div className="person-cell">
          <Avatar i={r.id} />
          <div>
            <strong>{r.name}</strong>
            <small>{r.role}</small>
          </div>
        </div>
      ),
    },
    { key: "project", label: "Project Name" },
    {
      key: "team",
      label: "Team",
      render: (r) => (
        <div className="team-bubbles">
          {r.team.split(" ").map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (r) => <Badge>{r.status}</Badge>,
    },
    {
      key: "budget",
      label: "Budget",
      render: (r) => "$" + (r.budget / 1000).toFixed(1) + "k",
      sort: (r) => r.budget,
    },
  ];
  return (
    <>
      <PageTitle title={title} />
      <section
        className={
          "card example-table " + (kind === "sticky" ? "sticky-table" : "")
        }
      >
        <div className="card-header">
          <h2>{title}</h2>
          {kind === "dense" && (
            <Button onClick={() => setDense(!dense)}>Toggle Density</Button>
          )}
        </div>
        {kind === "columnvisibility" && (
          <div className="column-toggles">
            <label>
              <input
                type="checkbox"
                checked={visible.length === 5}
                onChange={() =>
                  setVisible(
                    visible.length === 5 ? [] : columns.map((c) => c.key),
                  )
                }
              />
              Toggle All
            </label>
            {columns.map((c) => (
              <label key={c.key}>
                <input
                  type="checkbox"
                  checked={visible.includes(c.key)}
                  onChange={() =>
                    setVisible(
                      visible.includes(c.key)
                        ? visible.filter((k) => k !== c.key)
                        : [...visible, c.key],
                    )
                  }
                />
                {c.label}
              </label>
            ))}
          </div>
        )}
        <DataTable
          rows={rows}
          columns={columns.filter((c) => visible.includes(c.key))}
          compact={dense}
          selectable={["row-selection", "checkbox-table"].includes(kind)}
          filterable={kind === "filtering" || kind === "empty"}
          searchable={kind === "empty"}
          pagination={kind === "pagination"}
          pageSize={10}
          striped={kind === "striped-row"}
          expandable={kind === "expanding"}
          draggable={kind === "drag-drop"}
          onReorder={setRows}
          onEdit={kind === "editable" ? setEditing : undefined}
          exportable={kind === "pagination"}
        />
      </section>
      {kind === "drag-drop" && (
        <section className="card section-space">
          <div className="card-header">
            <h2>Column Drag & Drop Table</h2>
            <span className="muted">Drag the column labels below</span>
          </div>
          <div className="column-toggles">
            {visible.map((k) => (
              <button
                key={k}
                className="btn"
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", k)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const from = e.dataTransfer.getData("text/plain");
                  const a = [...visible],
                    i = a.indexOf(from),
                    j = a.indexOf(k);
                  if (i < 0) return;
                  a.splice(j, 0, ...a.splice(i, 1));
                  setVisible(a);
                }}
              >
                <Icon name="GripVertical" size={14} />
                {columns.find((c) => c.key === k)?.label}
              </button>
            ))}
          </div>
          <DataTable
            rows={rows}
            columns={visible.map((k) => columns.find((c) => c.key === k)!)}
            pagination={false}
          />
        </section>
      )}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit row">
        {editing && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setRows(rows.map((r) => (r.id === editing.id ? editing : r)));
              setEditing(null);
            }}
          >
            <Field label="User name">
              <input
                required
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
              />
            </Field>
            <Field label="Project name">
              <input
                required
                value={editing.project}
                onChange={(e) =>
                  setEditing({ ...editing, project: e.target.value })
                }
              />
            </Field>
            <Field label="Status">
              <select
                value={editing.status}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value })
                }
              >
                {["Active", "Pending", "Completed", "Cancel"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Button variant="primary">Save row</Button>
          </form>
        )}
      </Modal>
    </>
  );
}
