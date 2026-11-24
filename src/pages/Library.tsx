import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Empty,
  Field,
  Icon,
  Modal,
  PageTitle,
  Select,
  Stars,
  Switch,
  Tabs,
} from "../ui";
import { GenericChart, SalesChart } from "../components/Charts";
import { usePersisted, useWorkspace } from "../state";
import { Upload } from "./Commerce";
export function ImageAI() {
  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState("Landscape (4:3)");
  const [style, setStyle] = useState("No style");
  const [tone, setTone] = useState("No Tone");
  const [light, setLight] = useState("No Lighting");
  const [camera, setCamera] = useState("No Camera");
  const [images, setImages] = usePersisted<
    { id: number; prompt: string; src: string }[]
  >("image-previews", []);
  const [selected, setSelected] = useState("");
  const { toast } = useWorkspace();
  function preview() {
    if (!prompt.trim()) return;
    const id = Date.now();
    setImages([
      {
        id,
        prompt,
        src: `/images/blog/blog-img${[4, 5, 9][images.length % 3]}.png`,
      },
      ...images,
    ]);
    toast(
      "Reference preview added. Real image generation needs an AI provider.",
    );
  }
  return (
    <>
      <PageTitle title="Image-AI" />
      <Card title="AI Image generator">
        <div className="card-body">
          <p className="muted">
            Create an image with Generative AI by describing what you'd like to
            see. Please note, all images are shared publicly by default.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              preview();
            }}
          >
            <Field label="Prompt">
              <textarea
                required
                rows={5}
                placeholder="Describe the image you would like to create..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </Field>
            <div className="image-options">
              <Select
                value={ratio}
                options={["Landscape (4:3)", "Square (1:1)", "Portrait (3:4)"]}
                onChange={setRatio}
              />
              <Select
                value={style}
                options={[
                  "No style",
                  "Photographic",
                  "Illustration",
                  "Digital art",
                ]}
                onChange={setStyle}
              />
              <Select
                value={tone}
                options={["No Tone", "Warm", "Cool", "Monochrome"]}
                onChange={setTone}
              />
              <Select
                value={light}
                options={[
                  "No Lighting",
                  "Natural light",
                  "Studio light",
                  "Soft light",
                ]}
                onChange={setLight}
              />
              <Select
                value={camera}
                options={["No Camera", "Wide angle", "Close-up", "Macro"]}
                onChange={setCamera}
              />
            </div>
            <p className="small muted">
              Local demo: Generate creates a reference preview using bundled
              artwork. It does not generate a new AI image or send your prompt
              anywhere.
            </p>
            <div className="button-group">
              <Button variant="primary">Generate</Button>
              <Button type="button" onClick={() => setPrompt("")}>
                Clear
              </Button>
            </div>
          </form>
        </div>
      </Card>
      <h2 className="section-space">Recent Images</h2>
      {images.length ? (
        <div className="gallery-grid">
          {images.map((i) => (
            <Card key={i.id}>
              <button
                className="gallery-image"
                onClick={() => setSelected(i.src)}
              >
                <img src={i.src} alt={"Reference preview: " + i.prompt} />
              </button>
              <div className="card-body">
                <strong>{i.prompt}</strong>
                <p className="small muted">
                  Reference preview · not AI generated
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setImages(images.filter((x) => x.id !== i.id))}
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Empty
          title="No images yet"
          text="Enter a prompt to create a local reference preview."
        />
      )}
      <Modal
        open={!!selected}
        title="Reference preview"
        wide
        onClose={() => setSelected("")}
      >
        <img
          className="image-preview"
          src={selected || undefined}
          alt="Reference artwork"
        />
      </Modal>
    </>
  );
}
export function LibraryPage() {
  const { pathname } = useLocation();
  const { kind = "button" } = useParams();
  const [checked, setChecked] = useState(true);
  const [tab, setTab] = useState("Account");
  const [value, setValue] = useState("Option 1");
  const [modal, setModal] = useState(false);
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState([""]);
  const { toast } = useWorkspace();
  const form = pathname.startsWith("/forms");
  const charts = kind.endsWith("-chart") || pathname.endsWith("/chart");
  const cards = pathname.endsWith("/card");
  const icons = pathname.includes("/icons/");
  const name = icons
    ? "Iconify Icons"
    : form
      ? "Form " + kind.replaceAll("-", " ")
      : kind.replaceAll("-", " ").replace(/\b\w/g, (s) => s.toUpperCase());
  if (icons)
    return (
      <>
        <PageTitle title={name} />
        <Card title="Installation">
          <div className="card-body">
            <p>RUTHLESS dashboard uses locally bundled Lucide React icons.</p>
            <pre>npm install lucide-react</pre>
          </div>
        </Card>
        <Card title="Usage Example" className="section-space">
          <div className="card-body">
            <pre>
              {
                "import { ArrowRight } from 'lucide-react';\n\n<ArrowRight size={20} />"
              }
            </pre>
            <div className="icon-gallery">
              {[
                "Activity",
                "ArrowRight",
                "Bell",
                "CalendarDays",
                "Check",
                "Cloud",
                "CreditCard",
                "Download",
                "FileText",
                "Folder",
                "Heart",
                "Home",
                "Mail",
                "MapPin",
                "Search",
                "Settings",
                "ShieldCheck",
                "ShoppingBag",
                "Star",
                "UsersRound",
              ].map((n) => (
                <button
                  key={n}
                  onClick={async () => {
                    await navigator.clipboard?.writeText(n);
                    toast(n + " copied");
                  }}
                >
                  <Icon name={n} size={26} />
                  <small>{n}</small>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </>
    );
  if (form)
    return (
      <>
        <PageTitle title={name} />
        <Card title={name}>
          <form
            className="card-body"
            onSubmit={(e) => {
              e.preventDefault();
              if (kind.includes("wizard") && step < 2) {
                setStep(step + 1);
                return;
              }
              toast("Form saved locally for this demonstration.");
            }}
          >
            {kind.includes("wizard") && (
              <Tabs
                items={["Account", "Personal details", "Confirmation"]}
                value={["Account", "Personal details", "Confirmation"][step]}
                onChange={(v) =>
                  setStep(
                    ["Account", "Personal details", "Confirmation"].indexOf(v),
                  )
                }
              />
            )}
            <div className="form-grid">
              <Field label="Full name">
                <input required placeholder="Cameron" />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  required
                  placeholder="cameron@ruthless.dashboard"
                />
              </Field>
              <Field label="Phone">
                <input type="tel" placeholder="+1 415 123 4567" />
              </Field>
              <Field label="Role">
                <select>
                  <option>Designer</option>
                  <option>Developer</option>
                  <option>Manager</option>
                </select>
              </Field>
            </div>
            <Field label="Message">
              <textarea rows={4} />
            </Field>
            {kind.includes("repeater") && (
              <>
                {fields.map((v, i) => (
                  <div className="button-group" key={i}>
                    <input
                      aria-label={"Additional field " + (i + 1)}
                      placeholder="Additional field"
                      value={v}
                      onChange={(e) =>
                        setFields(
                          fields.map((x, j) => (j === i ? e.target.value : x)),
                        )
                      }
                    />
                    <Button
                      type="button"
                      onClick={() =>
                        setFields(fields.filter((_, j) => j !== i))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => setFields([...fields, ""])}
                >
                  Add field
                </Button>
              </>
            )}
            <label className="radio-row">
              <input type="checkbox" required />I agree to save these details in
              this demo.
            </label>
            <div className="form-actions">
              <Button type="reset">Reset</Button>
              <Button variant="primary">
                {kind.includes("wizard") && step < 2 ? "Next" : "Submit"}
              </Button>
            </div>
          </form>
        </Card>
      </>
    );
  if (charts)
    return (
      <>
        <PageTitle title={name} />
        <div className="dashboard-grid">
          {[0, 1, 2, 3].map((i) => (
            <div className="span-6" key={i}>
              <Card
                title={(i ? "Monthly " : "") + name}
                icon="ChartNoAxesCombined"
              >
                <div className="card-body">
                  <p className="muted">January – June 2026</p>
                  <GenericChart kind={kind.replace("-chart", "")} />
                  <p className="positive">Trending up by 5.2% this month</p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </>
    );
  return (
    <>
      <PageTitle title={name} />
      <div className="component-grid">
        <Card title={cards ? "Overview card" : name + " examples"}>
          <div className="component-preview">
            {kind === "avatar" ? (
              <div className="button-group">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Avatar key={i} i={i} size={i * 8 + 24} />
                ))}
              </div>
            ) : kind === "badge" ? (
              <div className="button-group">
                {["Active", "Pending", "Cancelled", "Draft"].map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            ) : kind === "switch" ? (
              <Switch
                checked={checked}
                onChange={setChecked}
                label="Example switch"
              />
            ) : kind === "checkbox" ? (
              <label className="radio-row">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
                Accept terms and conditions
              </label>
            ) : kind === "radio-group" ? (
              <div>
                {["Default", "Comfortable", "Compact"].map((s, i) => (
                  <label key={s} className="radio-row">
                    <input
                      type="radio"
                      name="example"
                      defaultChecked={i === 0}
                    />
                    {s}
                  </label>
                ))}
              </div>
            ) : kind === "select" ? (
              <Select
                value={value}
                options={["Option 1", "Option 2", "Option 3"]}
                onChange={setValue}
              />
            ) : kind === "input" ? (
              <Field label="Email">
                <input placeholder="Enter your email" type="email" />
              </Field>
            ) : kind === "textarea" ? (
              <Field label="Your message">
                <textarea placeholder="Type your message here" rows={4} />
              </Field>
            ) : kind === "tab" ? (
              <>
                <Tabs
                  items={["Account", "Password"]}
                  value={tab}
                  onChange={setTab}
                />
                <p>Manage your {tab.toLowerCase()} settings here.</p>
              </>
            ) : kind === "accordion" ? (
              <div className="faq-items">
                {[
                  "Is it accessible?",
                  "Is it responsive?",
                  "Can I customize it?",
                ].map((s) => (
                  <details key={s}>
                    <summary>
                      {s}
                      <Icon name="ChevronDown" size={15} />
                    </summary>
                    <p>
                      Yes. These editable components support responsive layouts
                      and keyboard interaction.
                    </p>
                  </details>
                ))}
              </div>
            ) : kind === "datepicker" ? (
              <Field label="Choose a date">
                <input type="date" />
              </Field>
            ) : kind === "tooltip" ? (
              <button
                className="btn btn-secondary"
                title="Add this item to your workspace"
              >
                Hover to see tooltip
              </button>
            ) : cards || kind === "card" ? (
              <Card className="card-body">
                <Icon name="TrendingUp" size={24} />
                <h2>Total Revenue</h2>
                <strong className="large-number">$45,231.89</strong>
                <p className="positive">+20.1% from last month</p>
              </Card>
            ) : (
              <div className="button-group">
                <Button
                  variant="primary"
                  onClick={() => toast("Primary action clicked")}
                >
                  Primary
                </Button>
                <Button onClick={() => toast("Secondary action clicked")}>
                  Secondary
                </Button>
                <Button variant="danger" onClick={() => setModal(true)}>
                  Delete
                </Button>
                <Button disabled>Disabled</Button>
              </div>
            )}
          </div>
        </Card>
        <Card title="Interactive dialog">
          <div className="component-preview">
            <p className="muted">
              Dialog, focus management and keyboard dismissal.
            </p>
            <Button onClick={() => setModal(true)}>Open dialog</Button>
          </div>
        </Card>
      </div>
      <Modal
        title="Example dialog"
        open={modal}
        onClose={() => setModal(false)}
      >
        <p>Make changes to your profile here. Click save when you're done.</p>
        <Field label="Name">
          <input defaultValue="Cameron" />
        </Field>
        <div className="form-actions">
          <Button onClick={() => setModal(false)}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => {
              setModal(false);
              toast("Saved");
            }}
          >
            Save changes
          </Button>
        </div>
      </Modal>
    </>
  );
}
