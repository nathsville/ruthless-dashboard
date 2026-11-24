import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { contacts as contactSeed, people, type Person } from "../data";
import { usePersisted, useWorkspace } from "../state";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Confirm,
  Empty,
  Field,
  Icon,
  IconButton,
  Menu,
  Modal,
  PageTitle,
  Search,
  Select,
  Tabs,
} from "../ui";
import { DataTable } from "../components/DataTable";
export function WorkApp() {
  const path = useLocation().pathname.split("/").at(-1);
  if (path === "contacts") return <Contacts />;
  if (path === "notes") return <Notes />;
  if (path === "calendar") return <Calendar />;
  if (path === "kanban") return <Kanban />;
  if (path === "tickets") return <Tickets />;
  if (path === "email") return <Email />;
  return <Chats ai={path === "chat-ai"} />;
}
function Contacts() {
  const [rows, setRows] = usePersisted("contacts", contactSeed);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(rows[0]?.id);
  const [editing, setEditing] = useState<Person | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [stars, setStars] = usePersisted<number[]>("starred-contacts", []);
  const { toast } = useWorkspace();
  const selected = rows.find((x) => x.id === active);
  const filtered = rows.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) &&
      (filter === "All" ||
        filter === "Frequent" ||
        (filter === "Starred" && stars.includes(r.id)) ||
        r.role === filter),
  );
  const editNew = () =>
    setEditing({
      id: Date.now(),
      name: "",
      role: "Sales",
      email: "",
      phone: "",
      age: 25,
      company: "",
      address: "",
      notes: "",
    });
  return (
    <>
      <PageTitle title="Contact App" />
      <section className="card split-app contacts-app">
        <aside className="app-sidebar">
          <Button variant="primary" className="full" onClick={editNew}>
            Add New Contact
          </Button>
          {["All", "Frequent", "Starred"].map((s, i) => (
            <button
              key={s}
              className={filter === s ? "app-nav active" : "app-nav"}
              onClick={() => setFilter(s)}
            >
              <Icon name={["UsersRound", "Clock", "Star"][i]} />
              {s}
            </button>
          ))}
          <h4>CATEGORIES</h4>
          {["Engineering", "Support", "Sales"].map((s) => (
            <button
              className={filter === s ? "app-nav active" : "app-nav"}
              key={s}
              onClick={() => setFilter(s)}
            >
              <i className="category-dot" />
              {s}
            </button>
          ))}
        </aside>
        <div className="app-list">
          <Search
            value={query}
            onChange={setQuery}
            placeholder="Search Contacts..."
          />
          <div className="app-list-scroll">
            {filtered.length ? (
              filtered.map((r) => (
                <button
                  className={
                    "contact-list-row " + (r.id === active ? "active" : "")
                  }
                  key={r.id}
                  onClick={() => setActive(r.id)}
                >
                  <Avatar i={r.id} />
                  <span>
                    <strong>{r.name}</strong>
                    <small>{r.role}</small>
                  </span>
                  {stars.includes(r.id) && <Icon name="Star" size={14} />}
                </button>
              ))
            ) : (
              <Empty />
            )}
          </div>
        </div>
        <div className="app-detail">
          {selected ? (
            <>
              <div className="detail-heading">
                <h2>Contact Details</h2>
                <IconButton
                  name="Star"
                  label="Star contact"
                  onClick={() =>
                    setStars(
                      stars.includes(selected.id)
                        ? stars.filter((id) => id !== selected.id)
                        : [...stars, selected.id],
                    )
                  }
                />
              </div>
              <div className="contact-profile">
                <Avatar i={selected.id} size={80} />
                <h2>{selected.name}</h2>
                <p>{selected.role}</p>
                <p className="muted">{selected.company}</p>
              </div>
              {[
                ["Phone Number", selected.phone],
                ["Email address", selected.email],
                ["Address", selected.address],
                ["Department", selected.role],
                ["Company", selected.company],
                ["Notes", selected.notes],
              ].map(([label, value]) => (
                <div className="contact-field" key={label}>
                  <small>{label}</small>
                  <p>{value || "Not provided"}</p>
                </div>
              ))}
              <div className="button-group">
                <Button variant="primary" onClick={() => setEditing(selected)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => setDeleting(true)}>
                  Delete
                </Button>
              </div>
            </>
          ) : (
            <Empty title="Select a contact" />
          )}
        </div>
      </section>
      <Modal
        open={!!editing}
        title={
          rows.some((r) => r.id === editing?.id)
            ? "Edit Contact"
            : "Add New Contact"
        }
        description="Fill in the contact information and save it to your workspace."
        onClose={() => setEditing(null)}
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
              setActive(editing.id);
              setEditing(null);
              toast("Contact saved");
            }}
          >
            <div className="form-grid">
              {(["name", "company", "phone", "email"] as const).map((k) => (
                <Field key={k} label={k === "name" ? "Full name" : k}>
                  <input
                    required={k === "name" || k === "email"}
                    type={
                      k === "email" ? "email" : k === "phone" ? "tel" : "text"
                    }
                    value={editing[k]}
                    onChange={(e) =>
                      setEditing({ ...editing, [k]: e.target.value })
                    }
                  />
                </Field>
              ))}
            </div>
            <Field label="Select Department">
              <select
                value={editing.role}
                onChange={(e) =>
                  setEditing({ ...editing, role: e.target.value })
                }
              >
                {[
                  "Engineering",
                  "Support",
                  "Sales",
                  "Business Development",
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
            <Field label="Notes">
              <textarea
                value={editing.notes}
                onChange={(e) =>
                  setEditing({ ...editing, notes: e.target.value })
                }
              />
            </Field>
            <div className="form-actions">
              <Button type="button" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button variant="primary">Submit</Button>
            </div>
          </form>
        )}
      </Modal>
      <Confirm
        open={deleting}
        title="Delete contact?"
        onClose={() => setDeleting(false)}
        onConfirm={() => {
          setRows(rows.filter((r) => r.id !== active));
          setActive(rows.find((r) => r.id !== active)?.id ?? 0);
        }}
      />
    </>
  );
}
const noteColors = ["neutral", "blue", "green", "orange", "pink", "purple"];
const noteSeed = [
  {
    id: 1,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    date: "6/4/2023",
    color: "neutral",
  },
  {
    id: 2,
    text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    date: "6/3/2023",
    color: "blue",
  },
  {
    id: 3,
    text: "Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
    date: "6/2/2023",
    color: "green",
  },
  {
    id: 4,
    text: "Write down the ideas that matter. Bring them to life, one small step at a time.",
    date: "6/4/2023",
    color: "orange",
  },
];
function Notes() {
  const [rows, setRows] = usePersisted("notes", noteSeed);
  const [active, setActive] = useState(1);
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [color, setColor] = useState("neutral");
  const selected = rows.find((r) => r.id === active);
  const update = (key: "text" | "color", v: string) =>
    setRows(rows.map((r) => (r.id === active ? { ...r, [key]: v } : r)));
  return (
    <>
      <PageTitle title="Notes app" />
      <section className="card notes-layout">
        <div className="note-list">
          <Search
            value={query}
            onChange={setQuery}
            placeholder="Search Notes..."
          />
          <h3>
            All Notes{" "}
            <IconButton
              name="Plus"
              label="Add Note"
              onClick={() => setAdding(true)}
            />
          </h3>
          {rows
            .filter((r) => r.text.toLowerCase().includes(query.toLowerCase()))
            .map((r) => (
              <div
                key={r.id}
                className={`note-preview note-${r.color} ${r.id === active ? "active" : ""}`}
              >
                <button onClick={() => setActive(r.id)}>
                  <p>{r.text}</p>
                  <small>{r.date}</small>
                </button>
                <IconButton
                  name="Trash2"
                  label="Delete note"
                  onClick={() => setRows(rows.filter((x) => x.id !== r.id))}
                />
              </div>
            ))}
        </div>
        <div className="note-editor">
          <div className="detail-heading">
            <h2>Edit Note</h2>
            <Button variant="primary" onClick={() => setAdding(true)}>
              Add Note
            </Button>
          </div>
          {selected ? (
            <>
              <textarea
                aria-label="Edit note content"
                value={selected.text}
                onChange={(e) => update("text", e.target.value)}
              />
              <h4>Change Note Color</h4>
              <ColorDots
                value={selected.color}
                onChange={(v) => update("color", v)}
              />
              <p className="muted small">
                Changes are saved automatically to this browser.
              </p>
            </>
          ) : (
            <Empty title="Select a note" />
          )}
        </div>
      </section>
      <Modal
        open={adding}
        title="Add New Note"
        onClose={() => setAdding(false)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const id = Date.now();
            setRows([
              { id, text: draft, date: new Date().toLocaleDateString(), color },
              ...rows,
            ]);
            setActive(id);
            setDraft("");
            setAdding(false);
          }}
        >
          <textarea
            required
            rows={5}
            placeholder="Write your note here..."
            aria-label="New note"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <h4>Change Note Color</h4>
          <ColorDots value={color} onChange={setColor} />
          <div className="form-actions">
            <Button type="button" onClick={() => setAdding(false)}>
              Close
            </Button>
            <Button variant="primary">Save</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
function ColorDots({
  value,
  onChange,
}: {
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <div className="color-dots">
      {noteColors.map((c) => (
        <button
          key={c}
          className={`note-${c} ${value === c ? "selected" : ""}`}
          aria-label={c + " note color"}
          aria-pressed={c === value}
          onClick={() => onChange(c)}
        />
      ))}
    </div>
  );
}
interface EventRecord {
  id: number;
  title: string;
  date: string;
  color: string;
  time: string;
}
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
function Calendar() {
  const today = new Date();
  const [cursor, setCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [view, setView] = useState("Month");
  const [events, setEvents] = usePersisted<EventRecord[]>(
    "calendar",
    [
      "Twice event For two Days",
      "Lunch with Mr.Raw",
      "Research of making own Browser",
      "Going For Party of Sahs",
      "Learn ReactJs",
      "Learn Ionic",
      "Launching MaterialArt Angular",
    ].map((title, i) => ({
      id: i + 1,
      title,
      date: iso(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          [8, 18, 19, 20, 22, 24, 27][i],
        ),
      ),
      color: noteColors[i % 6],
      time: "09:00",
    })),
  );
  const [editing, setEditing] = useState<EventRecord | null>(null);
  const offset =
    (new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay() + 6) % 7;
  const days = Array.from(
    { length: 42 },
    (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i - offset + 1),
  );
  const monthEvents = events.filter((e) =>
    e.date.startsWith(iso(cursor).slice(0, 7)),
  );
  const shift = (n: number) =>
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + n, 1));
  const openNew = (date: string) =>
    setEditing({
      id: Date.now(),
      title: "",
      date,
      color: "green",
      time: "09:00",
    });
  return (
    <>
      <PageTitle title="Calendar" />
      <Card className="calendar-card">
        <div className="calendar-toolbar">
          <div className="button-group">
            <Button
              onClick={() =>
                setCursor(new Date(today.getFullYear(), today.getMonth(), 1))
              }
            >
              Today
            </Button>
            <Button onClick={() => shift(-1)}>Back</Button>
            <Button onClick={() => shift(1)}>Next</Button>
          </div>
          <h2>
            {cursor.toLocaleString("en", { month: "long", year: "numeric" })}
          </h2>
          <Tabs
            items={["Month", "Week", "Day", "Agenda"]}
            value={view}
            onChange={setView}
          />
        </div>
        {view === "Month" ? (
          <div className="calendar-grid">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((n) => (
              <div className="calendar-weekday" key={n}>
                {n}
              </div>
            ))}
            {days.map((d) => (
              <div
                key={iso(d)}
                className={`calendar-day ${d.getMonth() !== cursor.getMonth() ? "outside" : ""} ${iso(d) === iso(today) ? "today" : ""}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const id = Number(e.dataTransfer.getData("text/plain"));
                  setEvents(
                    events.map((x) =>
                      x.id === id ? { ...x, date: iso(d) } : x,
                    ),
                  );
                }}
              >
                <button
                  className="calendar-date"
                  aria-label={"Add event on " + iso(d)}
                  onClick={() => openNew(iso(d))}
                >
                  {String(d.getDate()).padStart(2, "0")}
                </button>
                {events
                  .filter((e) => e.date === iso(d))
                  .map((e) => (
                    <button
                      draggable
                      onDragStart={(ev) =>
                        ev.dataTransfer.setData("text/plain", String(e.id))
                      }
                      onClick={() => setEditing(e)}
                      className={`calendar-event note-${e.color}`}
                      key={e.id}
                    >
                      {e.title}
                    </button>
                  ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="calendar-agenda">
            {(view === "Day"
              ? events.filter((e) => e.date === iso(today))
              : monthEvents
            ).map((e) => (
              <button key={e.id} onClick={() => setEditing(e)}>
                <strong>{e.date}</strong>
                <span>{e.time}</span>
                <span>{e.title}</span>
                <Icon name="Pencil" size={15} />
              </button>
            ))}
            <Button onClick={() => openNew(iso(cursor))}>
              <Icon name="Plus" size={16} />
              Add event
            </Button>
          </div>
        )}
      </Card>
      <Modal
        open={!!editing}
        title={
          events.some((e) => e.id === editing?.id) ? "Edit Event" : "Add Event"
        }
        onClose={() => setEditing(null)}
      >
        {editing && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEvents(
                events.some((x) => x.id === editing.id)
                  ? events.map((x) => (x.id === editing.id ? editing : x))
                  : [...events, editing],
              );
              setEditing(null);
            }}
          >
            <Field label="Event Title">
              <input
                required
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
              />
            </Field>
            <div className="form-grid">
              <Field label="Date">
                <input
                  required
                  type="date"
                  value={editing.date}
                  onChange={(e) =>
                    setEditing({ ...editing, date: e.target.value })
                  }
                />
              </Field>
              <Field label="Time">
                <input
                  required
                  type="time"
                  value={editing.time}
                  onChange={(e) =>
                    setEditing({ ...editing, time: e.target.value })
                  }
                />
              </Field>
            </div>
            <ColorDots
              value={editing.color}
              onChange={(color) => setEditing({ ...editing, color })}
            />
            <div className="form-actions">
              {events.some((x) => x.id === editing.id) && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => {
                    setEvents(events.filter((x) => x.id !== editing.id));
                    setEditing(null);
                  }}
                >
                  Delete
                </Button>
              )}
              <Button type="button" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button variant="primary">Save event</Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
interface Task {
  id: number;
  title: string;
  list: string;
  priority: string;
  description: string;
}
const taskSeed: Task[] = [
  "Prepare project scope",
  "Initial client meeting",
  "Collect project requirements",
  "Design homepage layout",
  "Set up development environment",
  "Create wireframes",
  "Approve branding guidelines",
  "Finalize user personas",
  "Research competitor websites",
  "Plan marketing launch",
].map((title, i) => ({
  id: i + 1,
  title,
  list:
    i < 3
      ? "New Request"
      : i < 5
        ? "In Progress"
        : i < 9
          ? "Complete"
          : "BackLog",
  priority:
    i === 3 || i === 7
      ? "High Priority"
      : i === 1 || i === 8
        ? "Medium Priority"
        : "Normal Priority",
  description: "",
}));
function Kanban() {
  const [lists, setLists] = usePersisted("kanban-lists", [
    "New Request",
    "In Progress",
    "Complete",
    "BackLog",
  ]);
  const [tasks, setTasks] = usePersisted("kanban-tasks", taskSeed);
  const [listDialog, setListDialog] = useState(false);
  const [listName, setListName] = useState("");
  const [editing, setEditing] = useState<Task | null>(null);
  const add = (list: string) =>
    setEditing({
      id: Date.now(),
      title: "",
      list,
      priority: "Normal Priority",
      description: "",
    });
  return (
    <>
      <PageTitle title="Kanban app" />
      <Card>
        <div className="card-header">
          <h2>Improving Work Processes</h2>
          <Button variant="primary" onClick={() => setListDialog(true)}>
            <Icon name="Plus" size={16} />
            Add List
          </Button>
        </div>
        <div className="kanban-board">
          {lists.map((list) => (
            <section
              className="kanban-list"
              key={list}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = Number(e.dataTransfer.getData("text/plain"));
                setTasks(tasks.map((t) => (t.id === id ? { ...t, list } : t)));
              }}
            >
              <div className="kanban-list-header">
                <h3>
                  {list}
                  <Badge tone="neutral">
                    {tasks.filter((t) => t.list === list).length}
                  </Badge>
                </h3>
                <Menu
                  label={"Options for " + list}
                  items={[
                    { label: "Add Task", onClick: () => add(list) },
                    {
                      label: "Delete empty list",
                      danger: true,
                      onClick: () => {
                        if (tasks.some((t) => t.list === list)) return;
                        setLists(lists.filter((s) => s !== list));
                      },
                    },
                  ]}
                />
              </div>
              {tasks
                .filter((t) => t.list === list)
                .map((t, i) => (
                  <button
                    key={t.id}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("text/plain", String(t.id))
                    }
                    className="kanban-task"
                    onClick={() => setEditing(t)}
                  >
                    {t.id === 4 && (
                      <img
                        src="/images/blog/blog-img4.png"
                        alt="Homepage design reference"
                      />
                    )}
                    <strong>{t.title}</strong>
                    <Badge>{t.priority}</Badge>
                    <div>
                      <span>
                        <Icon name="MessageCircle" size={13} />{" "}
                        {i === 0 ? 1 : 0}
                      </span>
                      <span>
                        <Icon name="Paperclip" size={13} /> {i === 0 ? 2 : 1}
                      </span>
                      <Avatar i={t.id} size={24} />
                    </div>
                  </button>
                ))}
              <Button
                className="full"
                variant="ghost"
                onClick={() => add(list)}
              >
                <Icon name="Plus" size={15} />
                Add Task
              </Button>
            </section>
          ))}
        </div>
      </Card>
      <Modal
        open={listDialog}
        title="Add List"
        onClose={() => setListDialog(false)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!lists.includes(listName.trim()))
              setLists([...lists, listName.trim()]);
            setListName("");
            setListDialog(false);
          }}
        >
          <Field label="List name">
            <input
              required
              value={listName}
              onChange={(e) => setListName(e.target.value)}
            />
          </Field>
          <div className="form-actions">
            <Button type="button" onClick={() => setListDialog(false)}>
              Cancel
            </Button>
            <Button variant="primary">Add List</Button>
          </div>
        </form>
      </Modal>
      <Modal
        open={!!editing}
        title={
          tasks.some((t) => t.id === editing?.id) ? "Edit Task" : "Add Task"
        }
        onClose={() => setEditing(null)}
      >
        {editing && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setTasks(
                tasks.some((t) => t.id === editing.id)
                  ? tasks.map((t) => (t.id === editing.id ? editing : t))
                  : [...tasks, editing],
              );
              setEditing(null);
            }}
          >
            <Field label="Task title">
              <input
                required
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
              />
            </Field>
            <Field label="Description">
              <textarea
                value={editing.description}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
              />
            </Field>
            <div className="form-grid">
              <Field label="List">
                <select
                  value={editing.list}
                  onChange={(e) =>
                    setEditing({ ...editing, list: e.target.value })
                  }
                >
                  {lists.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Priority">
                <select
                  value={editing.priority}
                  onChange={(e) =>
                    setEditing({ ...editing, priority: e.target.value })
                  }
                >
                  {["Normal Priority", "Medium Priority", "High Priority"].map(
                    (s) => (
                      <option key={s}>{s}</option>
                    ),
                  )}
                </select>
              </Field>
            </div>
            <div className="form-actions">
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  setTasks(tasks.filter((t) => t.id !== editing.id));
                  setEditing(null);
                }}
              >
                Delete
              </Button>
              <Button variant="primary">Save Task</Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
interface TicketRecord {
  id: number;
  title: string;
  description: string;
  assigned: string;
  status: string;
  date: string;
}
function Tickets() {
  const [rows, setRows] = usePersisted<TicketRecord[]>(
    "tickets",
    Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      title: [
        "Sed ut perspiciatis unde omnis iste",
        "Consequuntur magni dolores eos qui ratione",
        "Exercitationem ullam corporis",
      ][i % 3],
      description:
        "Ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
      assigned: ["Liam", "Steve", "Jack", "Steve"][i % 4],
      status: [
        "Closed",
        "Pending",
        "Open",
        "Closed",
        "Closed",
        "Pending",
        "Open",
        "Closed",
      ][i],
      date: ["Tue, May 6", "Tue, Jun 26", "Wed, Aug 22", "Tue, Apr 27"][i % 4],
    })),
  );
  const [filter, setFilter] = useState("Total");
  const [editing, setEditing] = useState<TicketRecord | null>(null);
  const [del, setDel] = useState<TicketRecord | null>(null);
  return (
    <>
      <PageTitle title="Tickets App" />
      <div className="summary-metrics four">
        {["Total", "Pending", "Open", "Closed"].map((s) => (
          <button
            className={filter === s ? "active" : ""}
            key={s}
            onClick={() => setFilter(s)}
          >
            <strong>
              {rows.filter((r) => s === "Total" || r.status === s).length}
            </strong>
            <span>{s} Tickets</span>
          </button>
        ))}
      </div>
      <Card>
        <div className="card-header">
          <h2>Tickets</h2>
          <Button
            variant="primary"
            onClick={() =>
              setEditing({
                id: Date.now(),
                title: "",
                description: "",
                assigned: "Liam",
                status: "Open",
                date: new Date().toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                  weekday: "short",
                }),
              })
            }
          >
            Create Ticket
          </Button>
        </div>
        <DataTable
          rows={rows.filter((r) => filter === "Total" || r.status === filter)}
          columns={[
            { key: "id", label: "Id" },
            {
              key: "title",
              label: "Ticket",
              render: (r) => (
                <div className="ticket-description">
                  <strong>{r.title}</strong>
                  <p>{r.description}</p>
                </div>
              ),
            },
            {
              key: "assigned",
              label: "Assigned To",
              render: (r) => (
                <div className="person-cell">
                  <Avatar i={r.id} />
                  {r.assigned}
                </div>
              ),
            },
            {
              key: "status",
              label: "Status",
              render: (r) => <Badge>{r.status}</Badge>,
            },
            { key: "date", label: "Date" },
          ]}
          searchable
          pagination={false}
          onEdit={setEditing}
          onDelete={setDel}
        />
      </Card>
      <Modal
        open={!!editing}
        title="Ticket Details"
        onClose={() => setEditing(null)}
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
            }}
          >
            <Field label="Ticket title">
              <input
                required
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
              />
            </Field>
            <Field label="Description">
              <textarea
                required
                value={editing.description}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
              />
            </Field>
            <div className="form-grid">
              <Field label="Assigned to">
                <select
                  value={editing.assigned}
                  onChange={(e) =>
                    setEditing({ ...editing, assigned: e.target.value })
                  }
                >
                  {["Liam", "Steve", "Jack", "John"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select
                  value={editing.status}
                  onChange={(e) =>
                    setEditing({ ...editing, status: e.target.value })
                  }
                >
                  {["Open", "Pending", "Closed"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Button variant="primary">Save ticket</Button>
          </form>
        )}
      </Modal>
      <Confirm
        open={!!del}
        title="Delete ticket?"
        onClose={() => setDel(null)}
        onConfirm={() => setRows(rows.filter((r) => r.id !== del?.id))}
      />
    </>
  );
}
interface Message {
  id: number;
  text: string;
  mine: boolean;
  time: string;
}
function Chats({ ai = false }: { ai?: boolean }) {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = usePersisted<Record<string, Message[]>>(
    ai ? "ai-chats" : "chats",
    {},
  );
  const [history, setHistory] = usePersisted<{ id: number; title: string }[]>(
    "ai-history",
    [],
  );
  const { toast } = useWorkspace();
  const names = ai
    ? history.map((x) => x.title)
    : [
        "James Johnson",
        "Maria Hernandez",
        "David Smith",
        "Maria Rodriguez",
        "Robert Smith",
        "Joseph Sarah",
        "Thomas Smith",
        "David Elizabeth",
        "Charles Martha",
        "Samuel Eliza",
      ];
  const key = String(active);
  const conversation =
    messages[key] ||
    (!ai
      ? [
          {
            id: 1,
            text: "Hi Cameron! How is the project coming along?",
            mine: false,
            time: "1 hour ago",
          },
          {
            id: 2,
            text: "The new dashboard looks great. I will share the updated designs shortly.",
            mine: false,
            time: "30 minutes ago",
          },
          {
            id: 3,
            text: "Thanks! Looking forward to your feedback.",
            mine: true,
            time: "6 minutes ago",
          },
        ]
      : []);
  function send() {
    if (!input.trim()) return;
    let current = active;
    if (ai && !history.some((h) => h.id === active)) {
      current = Date.now();
      setHistory([{ id: current, title: input.slice(0, 44) }, ...history]);
      setActive(current);
    }
    const list = messages[String(current)] || (!ai ? conversation : []);
    setMessages({
      ...messages,
      [String(current)]: [
        ...list,
        { id: Date.now(), text: input, mine: true, time: "just now" },
        ...(ai
          ? [
              {
                id: Date.now() + 1,
                text: "Local demo response: I can help you break this into smaller steps. Start by defining your objective, gathering the relevant information, and reviewing the result. Connect an AI provider to enable real responses.",
                mine: false,
                time: "just now",
              },
            ]
          : []),
      ],
    });
    setInput("");
  }
  return (
    <>
      <PageTitle title={ai ? "Chat-AI" : "Chat App"} />
      <section
        className={"card split-app chat-app " + (ai ? "ai-chat-app" : "")}
      >
        <aside className="app-list">
          {!ai && (
            <div className="profile-identity">
              <Avatar />
              <div>
                <strong>Cameron</strong>
                <p className="muted">Designer</p>
              </div>
            </div>
          )}
          <Search
            value={query}
            onChange={setQuery}
            placeholder={ai ? "Search Chat History..." : "Search Chats..."}
          />
          {ai ? (
            <Button
              variant="primary"
              className="full"
              onClick={() => {
                setActive(Date.now());
                setInput("");
              }}
            >
              New Chat
            </Button>
          ) : (
            <h4>Recent Chats</h4>
          )}
          <div className="app-list-scroll">
            {names.length ? (
              names
                .map((name, i) => ({ name, id: ai ? history[i].id : i }))
                .filter((x) =>
                  x.name.toLowerCase().includes(query.toLowerCase()),
                )
                .map(({ name, id }, i) => (
                  <button
                    key={id}
                    className={
                      "contact-list-row " + (active === id ? "active" : "")
                    }
                    onClick={() => setActive(id)}
                  >
                    {!ai && <Avatar i={i + 1} />}
                    <span>
                      <strong>{name}</strong>
                      <small>
                        {ai
                          ? "Saved conversation"
                          : "You: Let’s keep in touch..."}
                      </small>
                    </span>
                  </button>
                ))
            ) : (
              <p className="muted center">No chat history found.</p>
            )}
          </div>
        </aside>
        <div className="conversation">
          <div className="conversation-header">
            <div className="person-cell">
              {!ai && <Avatar i={active + 1} />}
              <div>
                <strong>{ai ? "RUTHLESS AI assistant" : names[active]}</strong>
                <small>
                  {ai
                    ? "Local demonstration · no provider connected"
                    : "online"}
                </small>
              </div>
            </div>
            <Menu
              items={[
                {
                  label: "Clear conversation",
                  onClick: () => setMessages({ ...messages, [key]: [] }),
                },
              ]}
            />
          </div>
          {ai && !conversation.length ? (
            <div className="ai-welcome">
              <span className="ai-symbol">
                <Icon name="Sparkles" size={36} />
              </span>
              <p>Welcome, Cameron</p>
              <h2>How can I help you today?</h2>
              <div>
                {[
                  "Can you explain photosynthesis in simple terms",
                  "Can you help me write a blog post about digital marketing",
                  "What are some marketing strategies for a new startup?",
                ].map((s) => (
                  <button key={s} onClick={() => setInput(s)}>
                    {s}
                    <Icon name="ArrowUpRight" size={17} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="message-list">
              {conversation.map((m) => (
                <div key={m.id} className={"message " + (m.mine ? "mine" : "")}>
                  <small>
                    {m.mine ? "You" : ai ? "Demo assistant" : names[active]} ·{" "}
                    {m.time}
                  </small>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>
          )}
          <form
            className="conversation-composer"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <label className="icon-button" aria-label="Attach file">
              <Icon name="Paperclip" />
              <input
                type="file"
                className="visually-hidden"
                onChange={(e) => {
                  if (e.target.files?.[0])
                    toast(
                      e.target.files[0].name +
                        " selected. Attachments are a local demo.",
                    );
                }}
              />
            </label>
            <input
              aria-label="Message"
              placeholder={ai ? "Ask anything..." : "Type here"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="icon-button"
              aria-label="Send message"
              disabled={!input.trim()}
            >
              <Icon name="Send" />
            </button>
          </form>
          {ai && (
            <div className="composer-options">
              <Button
                variant="ghost"
                onClick={() =>
                  toast("Use the paperclip to select a local file.")
                }
              >
                Attach
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  toast(
                    "No AI provider is connected. Replies are local demonstrations.",
                  )
                }
              >
                Settings
              </Button>
              <Select
                value="Options"
                options={["Options", "Clear current chat"]}
                onChange={() => setMessages({ ...messages, [key]: [] })}
              />
            </div>
          )}
        </div>
        {!ai && (
          <aside className="chat-media">
            <Avatar i={active + 1} size={70} />
            <h3>{names[active]}</h3>
            <h4>Media (1)</h4>
            <img src="/images/blog/blog-img4.png" alt="Shared workspace" />
            <h4>Attachments (5)</h4>
            {[
              "service-task.pdf",
              "homepage-design.fig",
              "about-us.html",
              "work-project.zip",
              "custom.js",
            ].map((f, i) => (
              <button
                className="attachment"
                key={f}
                onClick={() =>
                  toast(
                    f + " is a demo attachment; no file content was supplied.",
                  )
                }
              >
                <Icon name="FileText" />
                <span>
                  {f}
                  <small>{i + 1}MB</small>
                </span>
              </button>
            ))}
          </aside>
        )}
      </section>
    </>
  );
}
interface MailRecord {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  folder: string;
  label: string;
  starred: boolean;
  read: boolean;
}
function Email() {
  const [rows, setRows] = usePersisted<MailRecord[]>(
    "email",
    [
      "James Smith",
      "David Smith",
      "Maria Rodriguez",
      "Mary Smith",
      "James Smith",
      "Michael Smith",
      "Maria Rodriguez",
      "James Johnson",
    ].map((name, i) => ({
      id: i + 1,
      name,
      email: "abc@company.com",
      subject: [
        "Kindly check this latest updated",
        "Literature from 45 BC, making",
        "Latin professor at Hampden-Sydney College.",
        "the cites of the word in classical.",
        "All the Lorem Ipsum generators on the Internet.",
        "Latin words, combined with a handful.",
      ][i % 6],
      message:
        "Hello Andrew,\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque bibendum hendrerit lobortis. Nullam ut lacus eros. Sed at luctus urna, eu fermentum diam. In et tristique mauris.\n\nUt id ornare metus, sed auctor enim. Pellentesque nisi magna, laoreet a augue eget, tempor volutpat diam.\n\nRegards,\n" +
        name,
      folder: "Inbox",
      label: ["Promotional", "Social", "Health", "Social"][i % 4],
      starred: i === 2,
      read: i === 0,
    })),
  );
  const [folder, setFolder] = useState("Inbox");
  const [active, setActive] = useState(1);
  const [query, setQuery] = useState("");
  const [compose, setCompose] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const selected = rows.find((r) => r.id === active);
  const { toast } = useWorkspace();
  const move = (f: string) => {
    setRows(rows.map((r) => (r.id === active ? { ...r, folder: f } : r)));
    toast("Message moved to " + f);
  };
  return (
    <>
      <PageTitle title="Email App" />
      <section className="card split-app email-app">
        <aside className="app-sidebar">
          <Button
            variant="primary"
            className="full"
            onClick={() => {
              setTo("");
              setSubject("");
              setMessage("");
              setCompose(true);
            }}
          >
            Compose
          </Button>
          {[
            "Inbox",
            "Sent",
            "Draft",
            "Spam",
            "Trash",
            "Starred",
            "Important",
            "Promotional",
            "Social",
            "Health",
          ].map((s, i) => (
            <button
              key={s}
              className={"app-nav " + (folder === s ? "active" : "")}
              onClick={() => setFolder(s)}
            >
              <Icon
                name={
                  [
                    "Inbox",
                    "Send",
                    "File",
                    "ShieldAlert",
                    "Trash2",
                    "Star",
                    "Bookmark",
                    "Tag",
                    "Tag",
                    "Tag",
                  ][i]
                }
              />
              {s}
            </button>
          ))}
        </aside>
        <div className="app-list">
          <Search
            value={query}
            onChange={setQuery}
            placeholder="Search Mail..."
          />
          <div className="app-list-scroll">
            {rows
              .filter(
                (r) =>
                  (folder === "Starred"
                    ? r.starred
                    : folder === "Important"
                      ? r.starred
                      : ["Promotional", "Social", "Health"].includes(folder)
                        ? r.label === folder
                        : r.folder === folder) &&
                  (r.subject + r.name)
                    .toLowerCase()
                    .includes(query.toLowerCase()),
              )
              .map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setActive(r.id);
                    setRows(
                      rows.map((x) =>
                        x.id === r.id ? { ...x, read: true } : x,
                      ),
                    );
                  }}
                  className={
                    "mail-list-row " +
                    (active === r.id ? "active" : "") +
                    (r.read ? "" : " unread")
                  }
                >
                  <div>
                    <strong>{r.name}</strong>
                    <Badge>{r.label}</Badge>
                  </div>
                  <p>{r.subject}</p>
                  <small>{r.id === 1 ? "2 hours" : "1 day"} ago</small>
                </button>
              ))}
          </div>
        </div>
        <div className="app-detail mail-reader">
          {selected ? (
            <>
              <div className="detail-heading">
                <div className="person-cell">
                  <Avatar i={selected.id} />
                  <div>
                    <strong>{selected.name}</strong>
                    <small>{selected.email}</small>
                  </div>
                </div>
                <div className="button-group">
                  <IconButton
                    name="Star"
                    label="Star email"
                    onClick={() =>
                      setRows(
                        rows.map((r) =>
                          r.id === active ? { ...r, starred: !r.starred } : r,
                        ),
                      )
                    }
                  />
                  <IconButton
                    name="Trash2"
                    label="Move email to trash"
                    onClick={() => move("Trash")}
                  />
                </div>
              </div>
              <Badge>{selected.label}</Badge>
              <h2>{selected.subject}</h2>
              <div className="mail-body">{selected.message}</div>
              <h4>Attachments</h4>
              <div className="attachments-row">
                {["adobe.pdf", "abouts.html", "cheese.zip"].map((f) => (
                  <button
                    key={f}
                    className="attachment"
                    onClick={() => toast("Demo attachment: " + f)}
                  >
                    <Icon name="FileText" />
                    <span>
                      {f}
                      <small>2MB</small>
                    </span>
                  </button>
                ))}
              </div>
              <div className="button-group">
                <Button
                  onClick={() => {
                    setTo(selected.email);
                    setSubject("Re: " + selected.subject);
                    setMessage("");
                    setCompose(true);
                  }}
                >
                  <Icon name="Reply" size={16} />
                  Reply
                </Button>
                <Button
                  onClick={() => {
                    setTo("");
                    setSubject("Fwd: " + selected.subject);
                    setMessage(selected.message);
                    setCompose(true);
                  }}
                >
                  <Icon name="Forward" size={16} />
                  Forward
                </Button>
              </div>
            </>
          ) : (
            <Empty title="Please Select an Email" />
          )}
        </div>
      </section>
      <Modal
        open={compose}
        title="Compose Mail"
        onClose={() => setCompose(false)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setRows([
              {
                id: Date.now(),
                name: "Cameron",
                email: to,
                subject,
                message,
                folder: "Sent",
                label: "Social",
                starred: false,
                read: true,
              },
              ...rows,
            ]);
            setCompose(false);
            setFolder("Sent");
            toast("Saved to Sent locally. No email was delivered.");
          }}
        >
          <Field label="To">
            <input
              type="email"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </Field>
          <Field label="Subject">
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Field>
          <Field label="Message">
            <textarea
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Field>
          <Field label="Attachment">
            <input type="file" />
          </Field>
          <p className="small muted">
            Local demo: this form does not send external email.
          </p>
          <div className="form-actions">
            <Button type="button" onClick={() => setCompose(false)}>
              Cancel
            </Button>
            <Button variant="primary">Send</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
