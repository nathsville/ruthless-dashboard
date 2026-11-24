import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  Modal,
  PageTitle,
  Switch,
  Tabs,
} from "../ui";
import { Upload } from "./Commerce";
export function ThemePage() {
  const p = useLocation().pathname;
  if (p.endsWith("account-settings")) return <Settings />;
  if (p.endsWith("faq")) return <FAQ />;
  if (p.endsWith("pricing")) return <Pricing />;
  if (p.endsWith("casl")) return <Access />;
  if (p.endsWith("inetegration")) return <Integrations />;
  if (p.endsWith("apikey")) return <ApiKeys />;
  return <EmptyPage />;
}
function Settings() {
  const [tab, setTab] = useState("Account");
  const [profile, setProfile] = usePersisted("profile", {
    name: "Cameron",
    location: "India",
    email: "info@ruthless.dashboard",
    store: "Macima Studio",
    currency: "USD",
    phone: "+91 1234567895",
    address: "814 Howard Street, 120065, India",
    image: "",
  });
  const [draft, setDraft] = useState(profile);
  const [notifications, setNotifications] = usePersisted("notifications", {
    Email: true,
    Push: true,
    "New messages": true,
    "Product updates": false,
    "Weekly summary": true,
  });
  const [twofa, setTwofa] = usePersisted("two-factor-demo", false);
  const { toast } = useWorkspace();
  return (
    <>
      <PageTitle title="Account Setting" />
      <Tabs
        items={["Account", "Notification", "Bills", "Security"]}
        value={tab}
        onChange={setTab}
      />
      {tab === "Account" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setProfile(draft);
            toast("Personal details saved to this browser.");
          }}
        >
          <div className="settings-grid">
            <Card title="Change Profile">
              <div className="card-body center">
                <p className="muted">Change your profile picture from here</p>
                {draft.image ? (
                  <img
                    className="avatar"
                    width={100}
                    height={100}
                    src={draft.image}
                    alt="Your profile"
                  />
                ) : (
                  <Avatar size={100} />
                )}
                <div className="button-group centered">
                  <label className="btn btn-primary">
                    Upload
                    <input
                      className="visually-hidden"
                      type="file"
                      accept="image/png,image/jpeg,image/gif"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        if (f.size > 800 * 1024) {
                          toast("Choose an image smaller than 800KB.");
                          return;
                        }
                        const r = new FileReader();
                        r.onload = () =>
                          setDraft({ ...draft, image: String(r.result) });
                        r.readAsDataURL(f);
                      }}
                    />
                  </label>
                  <Button
                    type="button"
                    onClick={() => setDraft({ ...draft, image: "" })}
                  >
                    Reset
                  </Button>
                </div>
                <p className="small muted">
                  Allowed JPG, GIF or PNG. Max size of 800K
                </p>
              </div>
            </Card>
            <Card title="Change Password">
              <div className="card-body">
                <p className="muted">
                  To change your password please confirm here
                </p>
                {["Current Password", "New Password", "Confirm Password"].map(
                  (s) => (
                    <Field key={s} label={s}>
                      <input
                        type="password"
                        autoComplete={
                          s === "Current Password"
                            ? "current-password"
                            : "new-password"
                        }
                        minLength={8}
                        aria-label={s}
                      />
                    </Field>
                  ),
                )}
                <p className="small muted">
                  Demo only. Passwords are not stored or transmitted.
                </p>
              </div>
            </Card>
            <Card title="Personal Details" className="span-full">
              <div className="card-body">
                <p className="muted">
                  To change your personal detail, edit and save from here
                </p>
                <div className="form-grid">
                  {(
                    [
                      "name",
                      "location",
                      "email",
                      "store",
                      "currency",
                      "phone",
                      "address",
                    ] as const
                  ).map((k) => (
                    <Field
                      key={k}
                      label={
                        {
                          name: "Your Name",
                          location: "Location",
                          email: "Email",
                          store: "Store Name",
                          currency: "Currency",
                          phone: "Phone",
                          address: "Address",
                        }[k]
                      }
                    >
                      {k === "location" || k === "currency" ? (
                        <select
                          value={draft[k]}
                          onChange={(e) =>
                            setDraft({ ...draft, [k]: e.target.value })
                          }
                        >
                          {(k === "location"
                            ? [
                                "India",
                                "United States",
                                "United Kingdom",
                                "Indonesia",
                              ]
                            : ["USD", "EUR", "GBP", "IDR"]
                          ).map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={
                            k === "email"
                              ? "email"
                              : k === "phone"
                                ? "tel"
                                : "text"
                          }
                          required
                          value={draft[k]}
                          onChange={(e) =>
                            setDraft({ ...draft, [k]: e.target.value })
                          }
                        />
                      )}
                    </Field>
                  ))}
                </div>
              </div>
            </Card>
          </div>
          <div className="form-actions">
            <Button type="button" onClick={() => setDraft(profile)}>
              Cancel
            </Button>
            <Button variant="primary">Save</Button>
          </div>
        </form>
      ) : tab === "Notification" ? (
        <Card title="Notification preferences">
          <div className="card-body">
            {Object.entries(notifications).map(([name, checked]) => (
              <div className="settings-row" key={name}>
                <div>
                  <strong>{name}</strong>
                  <p className="muted">
                    Manage {name.toLowerCase()} notifications for your
                    workspace.
                  </p>
                </div>
                <Switch
                  label={name + " notifications"}
                  checked={checked}
                  onChange={(v) =>
                    setNotifications({ ...notifications, [name]: v })
                  }
                />
              </div>
            ))}
          </div>
        </Card>
      ) : tab === "Bills" ? (
        <Card title="Billing & subscriptions">
          <div className="card-body">
            <Badge>Basic Plan</Badge>
            <h2>Your current plan is Free</h2>
            <p className="muted">
              No payment method is stored. This is a local demonstration
              workspace.
            </p>
            <Link className="btn btn-primary" to="/theme-pages/pricing">
              Explore plans
            </Link>
            <h3 className="section-space">Billing history</h3>
            <Empty
              title="No invoices yet"
              text="Your subscription invoices will appear here when billing is connected."
            />
          </div>
        </Card>
      ) : (
        <Card title="Security">
          <div className="card-body">
            <div className="settings-row">
              <div>
                <h3>Two-factor authentication</h3>
                <p className="muted">
                  Preference only; real authentication requires a backend
                  provider.
                </p>
              </div>
              <Switch
                label="Two-factor authentication preference"
                checked={twofa}
                onChange={setTwofa}
              />
            </div>
            <div className="settings-row">
              <div>
                <h3>Active session</h3>
                <p className="muted">This browser · Local demo</p>
              </div>
              <Badge>Current</Badge>
            </div>
            <Link className="btn btn-secondary" to="/auth/auth1/login">
              Open sign-in demo
            </Link>
          </div>
        </Card>
      )}
    </>
  );
}
const faqItems = [
  [
    "What is an Admin Dashboard?",
    "An admin dashboard is a central workspace for managing your application, reviewing data, and keeping track of important activity.",
  ],
  [
    "What should an admin dashboard template include?",
    "A dashboard template should include clear navigation, useful analytics, responsive layouts, forms, tables, and consistent UI components.",
  ],
  [
    "Why should I choose RUTHLESS dashboard?",
    "This workspace brings analytics, commerce, communication and everyday management tools together in one consistent interface.",
  ],
  [
    "Is this a production service?",
    "This build is a local demonstration. Data is saved in your browser. Payments, AI responses, email delivery and secure authentication are not connected to production providers.",
  ],
];
function FAQ() {
  return (
    <>
      <PageTitle title="FAQ" />
      <div className="faq-page">
        <h1>Frequently asked questions</h1>
        <p className="muted">
          Get to know more about ready-to-use admin dashboard templates
        </p>
        <div className="faq-items">
          {faqItems.map(([q, a]) => (
            <details className="card" key={q}>
              <summary>
                {q}
                <Icon name="ChevronDown" size={18} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
        <Card className="faq-contact">
          <div className="avatar-stack">
            <Avatar i={1} />
            <Avatar i={2} />
            <Avatar i={3} />
          </div>
          <h2>Still have questions</h2>
          <p className="muted">
            Can't find the answer you're looking for? Please chat to our
            friendly team.
          </p>
          <Link className="btn btn-primary" to="/apps/chats">
            Chat with us
          </Link>
        </Card>
      </div>
    </>
  );
}
function Pricing() {
  const [yearly, setYearly] = useState(false);
  const [plan, setPlan] = usePersisted("subscription-demo", "Silver");
  const { toast } = useWorkspace();
  return (
    <>
      <PageTitle title="Pricing" />
      <div className="pricing-heading">
        <h1>
          Flexible Plans Tailored to Fit Your
          <br />
          Community's Unique Needs!
        </h1>
        <div className="button-group centered">
          <span>Monthly</span>
          <Switch
            label="Yearly billing"
            checked={yearly}
            onChange={setYearly}
          />
          <span>Yearly</span>
        </div>
      </div>
      <div className="pricing-grid">
        {["Silver", "Bronze", "Gold"].map((name, i) => (
          <Card
            key={name}
            className={"pricing-card " + (i === 1 ? "featured-plan" : "")}
          >
            <div className="detail-heading">
              <h3>{name}</h3>
              {i === 1 && <Badge>Popular</Badge>}
            </div>
            <Icon name={["Package", "Award", "Crown"][i]} size={56} />
            <div className="plan-price">
              {i === 0
                ? "Free"
                : "$" +
                  ((i === 1 ? 10.99 : 22.99) * (yearly ? 10 : 1)).toFixed(2)}
              {i > 0 && <small>/{yearly ? "year" : "month"}</small>}
            </div>
            {[
              i === 0
                ? "3 Members"
                : i === 1
                  ? "5 Members"
                  : "Unlimited Members",
              i === 0 ? "Single Device" : "Multiple Device",
              ["50GB Storage", "80GB Storage", "150GB Storage"][i],
              "Monthly Backups",
              "Permissions & workflows",
            ].map((s, j) => (
              <p key={s} className={i === 0 && j > 2 ? "muted" : ""}>
                <Icon name={i === 0 && j > 2 ? "X" : "Check"} size={17} />
                {s}
              </p>
            ))}
            <Button
              variant={i === 1 ? "primary" : "secondary"}
              className="full"
              onClick={() => {
                setPlan(name);
                toast(
                  name +
                    " selected as a demo preference. No subscription or charge was created.",
                );
              }}
            >
              {plan === name ? "Current Demo Plan" : "Choose " + name}
            </Button>
          </Card>
        ))}
      </div>
    </>
  );
}
function Access() {
  const [role, setRole] = useState("Admin");
  const [rows, setRows] = usePersisted(
    "access-users",
    [
      "Stanley Hudson",
      "Angela Martin",
      "Kevin Malone",
      "Dwight Schrute",
      "Pam Beesly",
    ].map((name, id) => ({
      id,
      name,
      email: name.toLowerCase().replace(" ", ".") + "@demo.com",
    })),
  );
  const [editing, setEditing] = useState<(typeof rows)[number] | null>(null);
  return (
    <>
      <PageTitle title="Rollbase Access" />
      <Tabs
        items={["Admin", "Manager", "Subscriber"]}
        value={role}
        onChange={setRole}
      />
      <Card>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>
                    <div className="button-group">
                      <IconButton
                        name="Pencil"
                        label={"Edit " + r.name}
                        disabled={role === "Subscriber"}
                        onClick={() => setEditing(r)}
                      />
                      <IconButton
                        name="Trash2"
                        label={"Delete " + r.name}
                        disabled={role !== "Admin"}
                        onClick={() =>
                          setRows(rows.filter((x) => x.id !== r.id))
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small muted card-body">
          Demo permissions: Admin can edit and delete. Manager can edit.
          Subscriber has read-only access.
        </p>
      </Card>
      <Modal
        open={!!editing}
        title="Edit User"
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
            <Field label="Name">
              <input
                required
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
              />
            </Field>
            <Field label="Email">
              <input
                required
                type="email"
                value={editing.email}
                onChange={(e) =>
                  setEditing({ ...editing, email: e.target.value })
                }
              />
            </Field>
            <Button variant="primary">Save</Button>
          </form>
        )}
      </Modal>
    </>
  );
}
function Integrations() {
  const [apps, setApps] = usePersisted(
    "integrations",
    [
      "Gmail",
      "Google Meet",
      "Linear",
      "Loom",
      "Zoom",
      "Mailchimp",
      "Notion",
      "Trello",
      "Jira",
    ].map((name, id) => ({ id, name, enabled: id % 3 === 0 })),
  );
  const [detail, setDetail] = useState("");
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const { toast } = useWorkspace();
  return (
    <>
      <PageTitle title="Integration">
        <Button variant="primary" onClick={() => setAdding(true)}>
          Add New Integration
        </Button>
      </PageTitle>
      <div className="integration-grid">
        {apps.map((app, i) => (
          <Card className="integration-card" key={app.id}>
            <div className="detail-heading">
              <span className={"integration-logo integration-" + (i % 5)}>
                <Icon
                  name={
                    [
                      "Mail",
                      "Video",
                      "Layers",
                      "Play",
                      "Video",
                      "Mail",
                      "NotebookText",
                      "PanelsTopLeft",
                      "Workflow",
                    ][i % 9]
                  }
                  size={28}
                />
              </span>
              <Switch
                checked={app.enabled}
                label={"Enable " + app.name}
                onChange={(enabled) => {
                  setApps(
                    apps.map((x) => (x.id === app.id ? { ...x, enabled } : x)),
                  );
                  toast(
                    "Preference saved. No external " +
                      app.name +
                      " connection was created.",
                  );
                }}
              />
            </div>
            <h2>{app.name}</h2>
            <p className="muted">
              {
                [
                  "Integrate Gmail to send, receive, and manage emails directly from your workspace.",
                  "Connect your Google Meet account for seamless video conferencing.",
                  "Integrate Linear to manage issues, track progress, and streamline your team’s workflow.",
                  "Integrate Loom to easily record, share, and manage video messages.",
                  "Integrate Zoom to streamline your virtual meetings and team collaborations.",
                  "Connect Mailchimp to streamline your email marketing—automate campaigns.",
                  "Capture, organize, and tackle your to-dos from anywhere.",
                  "Capture, organize, and tackle your to-dos from anywhere.",
                  "Track issues and manage projects with ease and full team visibility.",
                ][i % 9]
              }
            </p>
            <Button className="full" onClick={() => setDetail(app.name)}>
              Details
            </Button>
          </Card>
        ))}
      </div>
      <Modal
        open={!!detail}
        title="Integration details"
        description="Check the settings for your selected app."
        onClose={() => setDetail("")}
      >
        <div className="contact-field">
          <small>App Name</small>
          <p>{detail}</p>
        </div>
        <div className="contact-field">
          <small>Connection status</small>
          <p>Not connected — demonstration only</p>
        </div>
        <p className="muted">
          A production connection needs provider credentials, OAuth
          authorization and a secure backend. No credentials are stored in this
          demo.
        </p>
      </Modal>
      <Modal
        open={adding}
        title="Add New Integration"
        onClose={() => setAdding(false)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setApps([...apps, { id: Date.now(), name, enabled: false }]);
            setName("");
            setAdding(false);
          }}
        >
          <Field label="App Name">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Button variant="primary">Add Integration</Button>
        </form>
      </Modal>
    </>
  );
}
interface DemoKey {
  id: number;
  name: string;
  enabled: boolean;
  created: string;
  value: string;
}
function ApiKeys() {
  const [keys, setKeys] = usePersisted<DemoKey[]>("api-keys", [
    {
      id: 1,
      name: "Web Client API Key",
      enabled: true,
      created: "11 Feb, 2025",
      value: "demo_rth_web_01",
    },
    {
      id: 2,
      name: "Development API key",
      enabled: true,
      created: "19 Dec, 2024",
      value: "demo_rth_development_02",
    },
    {
      id: 3,
      name: "Production API Key",
      enabled: false,
      created: "23 Mar, 2024",
      value: "demo_rth_production_03",
    },
  ]);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const { toast } = useWorkspace();
  return (
    <>
      <PageTitle title="API Keys" />
      <Card
        title="API Keys"
        action={
          <Button variant="primary" onClick={() => setAdding(true)}>
            Generate API key
          </Button>
        }
      >
        <p className="muted card-body">
          Demo API keys are local identifiers, not credentials for a live API.
        </p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Created</th>
                <th>Last used</th>
                <th>Disable/Enable</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id}>
                  <td>
                    <strong>{k.name}</strong>
                    <div className="key-value">
                      <code>{k.value.slice(0, 10)}••••••••</code>
                      <Button
                        variant="ghost"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(k.value);
                            toast("Demo key copied");
                          } catch {
                            toast(
                              "Clipboard access unavailable in this browser.",
                            );
                          }
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </td>
                  <td>
                    <Badge>{k.enabled ? "Active" : "Disabled"}</Badge>
                  </td>
                  <td>{k.created}</td>
                  <td>Never</td>
                  <td>
                    <Switch
                      label={"Enable " + k.name}
                      checked={k.enabled}
                      onChange={(enabled) =>
                        setKeys(
                          keys.map((x) =>
                            x.id === k.id ? { ...x, enabled } : x,
                          ),
                        )
                      }
                    />
                  </td>
                  <td>
                    <IconButton
                      name="Trash2"
                      label={"Delete " + k.name}
                      onClick={() => setDeleting(k.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal
        open={adding}
        title="Generate demo API key"
        onClose={() => setAdding(false)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setKeys([
              ...keys,
              {
                id: Date.now(),
                name,
                enabled: true,
                created: new Date().toLocaleDateString("en", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
                value: "demo_rth_" + crypto.randomUUID().replaceAll("-", ""),
              },
            ]);
            setAdding(false);
            setName("");
          }}
        >
          <Field label="Key name">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <p className="small muted">
            This creates a demo identifier in local browser storage only.
          </p>
          <Button variant="primary">Generate</Button>
        </form>
      </Modal>
      <Confirm
        open={deleting !== null}
        title="Delete API key?"
        onClose={() => setDeleting(null)}
        onConfirm={() => setKeys(keys.filter((k) => k.id !== deleting))}
      />
    </>
  );
}
function EmptyPage() {
  const kind = useLocation().pathname.slice(-1);
  const [projects, setProjects] = usePersisted<string[]>("projects", []);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const { toast } = useWorkspace();
  const nav = useNavigate();
  return (
    <>
      <Card className="empty-state-card">
        {kind === "1" ? (
          <Empty
            title={projects.length ? "Your Projects" : "No Projects Yet"}
            text="You haven't created any projects yet. Get started by creating your first project."
            action={
              <div className="button-group">
                <Button variant="primary" onClick={() => setAdding(true)}>
                  Create Project
                </Button>
                <label className="btn btn-secondary">
                  Import Project
                  <input
                    className="visually-hidden"
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f)
                        f.text().then((t) => {
                          try {
                            const value = JSON.parse(t);
                            if (
                              !Array.isArray(value) ||
                              !value.every((x) => typeof x === "string")
                            )
                              throw new Error();
                            setProjects([...projects, ...value]);
                            toast("Projects imported");
                          } catch {
                            toast("Use a JSON array of project names.");
                          }
                        });
                    }}
                  />
                </label>
                <Link to="/theme-pages/faq" className="btn btn-ghost">
                  Learn More
                </Link>
              </div>
            }
          />
        ) : kind === "2" ? (
          <div className="empty">
            <Icon name="FolderPlus" size={44} />
            <h1>Create your first project</h1>
            <p>Pick a starting point or create your project from scratch.</p>
            <div className="starting-points">
              {[
                [
                  "Client Workspace",
                  "Manage client projects, files, and communication in one place.",
                ],
                [
                  "Internal Operations",
                  "Streamline team workflows, tasks, and internal processes.",
                ],
                [
                  "Research & Planning",
                  "Collect ideas, insights, and plan your next big move.",
                ],
              ].map(([n, t]) => (
                <button
                  className="card card-body"
                  key={n}
                  onClick={() => {
                    setName(n);
                    setAdding(true);
                  }}
                >
                  <Icon name="Folder" />
                  <strong>{n}</strong>
                  <p>{t}</p>
                </button>
              ))}
            </div>
            <Button variant="ghost" onClick={() => setAdding(true)}>
              or start with a blank project
            </Button>
          </div>
        ) : kind === "3" ? (
          <Empty
            title="Access to this page is blocked!"
            text="Please try another way or make sure you have the necessary permissions."
            action={
              <div className="button-group">
                <Button onClick={() => nav(-1)}>Go back</Button>
                <Link className="btn btn-primary" to="/apps/chats">
                  Contact support
                </Link>
              </div>
            }
          />
        ) : (
          <Empty
            title="No Internet Connection"
            text="It seems you are offline. Check your internet connection and try again."
            action={
              <Button
                variant="primary"
                onClick={() =>
                  toast(
                    navigator.onLine
                      ? "Your browser is online. This page is an offline-state demonstration."
                      : "You are offline. Please check your connection.",
                  )
                }
              >
                Try Again
              </Button>
            }
          />
        )}
      </Card>
      {projects.length > 0 && kind === "1" && (
        <div className="project-grid section-space">
          {projects.map((p, i) => (
            <Card key={i}>
              <div className="card-body">
                <Icon name="Folder" />
                <h3>{p}</h3>
                <Button
                  variant="ghost"
                  onClick={() =>
                    setProjects(projects.filter((_, j) => i !== j))
                  }
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal
        open={adding}
        title="Create Project"
        onClose={() => setAdding(false)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setProjects([...projects, name]);
            setName("");
            setAdding(false);
            toast("Project created");
          }}
        >
          <Field label="Project Name">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Button variant="primary">Create Project</Button>
        </form>
      </Modal>
    </>
  );
}
