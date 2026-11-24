import { useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  articleText,
  blogPosts,
  followerNames,
  products,
  slug,
  type Post,
} from "../data";
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
  Search,
  Switch,
  Tabs,
} from "../ui";
import { DataTable } from "../components/DataTable";
import { Upload } from "./Commerce";
export function ProfilePage() {
  const kind = useLocation().pathname.split("/").at(-1)!;
  const title =
    kind === "profile"
      ? "User Profile"
      : kind.charAt(0).toUpperCase() + kind.slice(1);
  const [query, setQuery] = useState("");
  const [following, setFollowing] = usePersisted<number[]>(
    "following",
    [0, 2, 3, 4, 8, 9, 11, 12, 15, 16, 17, 18],
  );
  const [image, setImage] = useState("");
  const [draft, setDraft] = useState("");
  const [posts, setPosts] = usePersisted("social-posts", [
    {
      id: 1,
      name: "Macky Dawn",
      text: "Gimug nevfep zamri jihibo sa gen mufcukuz orco ogtid haku efefa coegu oczir webirid ji be dej. Ege tob par ug noawazim pazbedim jojog zappo somos uhako ifebizga voatmu pajob sin.",
      likes: 67,
      liked: false,
      comments: ["Beautiful work!"],
      image: "/images/blog/blog-img4.png",
    },
    {
      id: 2,
      name: "Deran Mac",
      text: "Afovuflog ceajiaje ehiciwoda zu fihos vebaged ihotun ref fo ap etfu ozopik. Esmeore zouz momeb fa tuvoc forov leefe posig jud igvine ci edibeprat ho dog dor ke ta utarewah.",
      likes: 55,
      liked: false,
      comments: [] as string[],
      image: "",
    },
    {
      id: 3,
      name: "Jonathan Bg",
      text: "A new perspective can change everything. Here is a little inspiration from this week’s creative work.",
      likes: 68,
      liked: false,
      comments: [] as string[],
      image: "/images/blog/blog-img1.png",
    },
  ]);
  const [comment, setComment] = useState<Record<number, string>>({});
  const { toast } = useWorkspace();
  return (
    <>
      <PageTitle title={title} />
      <Card className="profile-banner">
        <img
          className="profile-cover"
          src="/images/backgrounds/profilebg.png"
          alt="Profile cover"
        />
        <div className="profile-summary">
          <div className="profile-stats">
            {[
              ["938", "Posts"],
              ["3,586", "Followers"],
              ["2,659", "Following"],
            ].map(([v, l]) => (
              <div key={l}>
                <strong>{v}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
          <div className="profile-name">
            <Avatar size={108} />
            <h2>Cameron</h2>
            <span className="muted">Designer</span>
          </div>
          <div className="profile-social">
            <IconButton
              name="Instagram"
              label="Instagram"
              onClick={() => toast("Social links are demo profiles.")}
            />
            <IconButton
              name="Facebook"
              label="Facebook"
              onClick={() => toast("Social links are demo profiles.")}
            />
            <Button
              variant="primary"
              onClick={() =>
                toast(
                  "Write a post below to share an update in your local feed.",
                )
              }
            >
              Add To Story
            </Button>
          </div>
        </div>
        <div className="profile-tabs">
          {["Profile", "Followers", "Friends", "Gallery"].map((s) => (
            <NavLink key={s} to={"/apps/user-profile/" + s.toLowerCase()}>
              {s}
            </NavLink>
          ))}
        </div>
      </Card>
      {kind === "profile" ? (
        <div className="profile-feed-layout">
          <div>
            <Card title="Introduction">
              <div className="card-body">
                <p>
                  Hello, I am Cameron. I love making websites and graphics.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                {[
                  ["GraduationCap", "Sir, P P Institute Of Science"],
                  ["Mail", "cameron@ruthless.dashboard"],
                  ["Globe", "www.ruthless.dashboard"],
                  ["MapPin", "Newyork, USA - 100001"],
                ].map(([icon, text]) => (
                  <p className="person-cell" key={text}>
                    <Icon name={icon} />
                    {text}
                  </p>
                ))}
              </div>
            </Card>
            <Card title="Photos" className="section-space">
              <div className="photo-grid">
                {products.slice(0, 6).map((p) => (
                  <button key={p.id} onClick={() => setImage(p.image)}>
                    <img src={p.image} alt={p.name} />
                  </button>
                ))}
              </div>
            </Card>
          </div>
          <div>
            <Card className="post-composer">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!draft.trim()) return;
                  setPosts([
                    {
                      id: Date.now(),
                      name: "Cameron",
                      text: draft,
                      likes: 0,
                      liked: false,
                      comments: [],
                      image: "",
                    },
                    ...posts,
                  ]);
                  setDraft("");
                }}
              >
                <textarea
                  required
                  placeholder="Share your thoughts..."
                  aria-label="Write a post"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <div className="detail-heading">
                  <div className="button-group">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        toast(
                          "Use the Blog editor to create a post with uploaded media.",
                        )
                      }
                    >
                      <Icon name="Image" size={16} />
                      Photos / Video
                    </Button>
                    <Link to="/apps/blog/create">Article</Link>
                  </div>
                  <Button variant="primary">Post</Button>
                </div>
              </form>
            </Card>
            {posts.map((p, i) => (
              <Card className="feed-post section-space" key={p.id}>
                <div className="person-cell">
                  <Avatar i={i + 1} />
                  <div>
                    <strong>{p.name}</strong>
                    <small>15 min ago</small>
                  </div>
                </div>
                <p>{p.text}</p>
                {p.image && (
                  <img
                    className="feed-image"
                    src={p.image}
                    alt="Shared creative work"
                  />
                )}
                <div className="post-reactions">
                  <button
                    onClick={() =>
                      setPosts(
                        posts.map((x) =>
                          x.id === p.id
                            ? {
                                ...x,
                                liked: !x.liked,
                                likes: x.likes + (x.liked ? -1 : 1),
                              }
                            : x,
                        ),
                      )
                    }
                    aria-label="Like post"
                    aria-pressed={p.liked}
                  >
                    <Icon name="Heart" size={17} />
                    {p.likes}
                  </button>
                  <span>
                    <Icon name="MessageCircle" size={17} />
                    {p.comments.length}
                  </span>
                </div>
                {p.comments.map((c, j) => (
                  <p className="comment-bubble" key={j}>
                    {c}
                  </p>
                ))}
                <form
                  className="button-group"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!comment[p.id]?.trim()) return;
                    setPosts(
                      posts.map((x) =>
                        x.id === p.id
                          ? { ...x, comments: [...x.comments, comment[p.id]] }
                          : x,
                      ),
                    );
                    setComment({ ...comment, [p.id]: "" });
                  }}
                >
                  <input
                    placeholder="Comment"
                    aria-label={"Comment on " + p.name + " post"}
                    value={comment[p.id] || ""}
                    onChange={(e) =>
                      setComment({ ...comment, [p.id]: e.target.value })
                    }
                  />
                  <Button>Comment</Button>
                </form>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="detail-heading section-space">
            <h2>
              {title}{" "}
              <Badge tone="neutral">{kind === "gallery" ? 12 : 21}</Badge>
            </h2>
            <Search
              value={query}
              onChange={setQuery}
              placeholder={"Search " + title + "..."}
            />
          </div>
          {kind === "gallery" ? (
            <div className="gallery-grid">
              {products
                .filter((p) =>
                  p.name.toLowerCase().includes(query.toLowerCase()),
                )
                .map((p, i) => (
                  <Card key={p.id}>
                    <button
                      className="gallery-image"
                      onClick={() => setImage(p.image)}
                    >
                      <img src={p.image} alt={p.name} loading="lazy" />
                    </button>
                    <div className="card-body">
                      <strong>{p.name}.jpg</strong>
                      <p className="muted">Tue, Nov {10 + (i % 8)}, 2026</p>
                    </div>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="followers-grid">
              {followerNames
                .map((name, id) => ({ name, id }))
                .filter((x) =>
                  x.name.toLowerCase().includes(query.toLowerCase()),
                )
                .map(({ name, id }) => (
                  <Card
                    className={
                      kind === "friends" ? "friend-card" : "follower-card"
                    }
                    key={name}
                  >
                    <Avatar i={id + 1} size={kind === "friends" ? 80 : 48} />
                    <div>
                      <strong>{name}</strong>
                      <p className="muted">
                        {kind === "friends"
                          ? [
                              "Auditor",
                              "Benefits Manager",
                              "Electronics Engineer",
                              "Call Center Manager",
                              "Bankruptcy Attorney",
                              "Public Safety Director",
                            ][id % 6]
                          : [
                              "Democratic Republic of the Congo",
                              "Kyrgyzstan",
                              "South Georgia and the South Sandwich Islands",
                              "South Sudan",
                              "Morocco",
                              "Sierra Leone",
                            ][id % 6]}
                      </p>
                    </div>
                    {kind === "followers" ? (
                      <Button
                        variant={
                          following.includes(id) ? "secondary" : "primary"
                        }
                        onClick={() =>
                          setFollowing(
                            following.includes(id)
                              ? following.filter((x) => x !== id)
                              : [...following, id],
                          )
                        }
                      >
                        {following.includes(id) ? "Following" : "Follow"}
                      </Button>
                    ) : (
                      <div className="button-group">
                        <IconButton
                          name="MessageCircle"
                          label={"Message " + name}
                          onClick={() =>
                            toast(
                              "Open Chats to start a local demo conversation.",
                            )
                          }
                        />
                        <IconButton
                          name="UserCheck"
                          label={"Friend " + name}
                          onClick={() =>
                            toast(name + " is in your friends list.")
                          }
                        />
                      </div>
                    )}
                  </Card>
                ))}
            </div>
          )}
        </>
      )}
      <Modal
        open={!!image}
        wide
        title="Image preview"
        onClose={() => setImage("")}
      >
        <img
          className="image-preview"
          src={image || undefined}
          alt="Selected gallery image"
        />
      </Modal>
    </>
  );
}
export function BlogsPage() {
  const path = useLocation().pathname;
  const { slug: postSlug } = useParams();
  const [posts, setPosts] = usePersisted("blog-posts", blogPosts);
  const [tab, setTab] = useState("All");
  const [deleting, setDeleting] = useState<Post | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = usePersisted<string[]>("blog-comments", [
    "A thoughtful perspective. Thank you for sharing!",
    "This was really helpful.",
    "Looking forward to the next article.",
  ]);
  const nav = useNavigate();
  const detail = path.includes("/detail/");
  const current =
    posts.find((p) => slug(p.title) === postSlug) || posts[4] || posts[0];
  if (path.endsWith("/create") || path.endsWith("/edit"))
    return (
      <BlogEditor
        edit={path.endsWith("/edit")}
        posts={posts}
        onSave={(p) => {
          setPosts(
            posts.some((x) => x.id === p.id)
              ? posts.map((x) => (x.id === p.id ? p : x))
              : [p, ...posts],
          );
          nav("/apps/blog/manage-blog");
        }}
      />
    );
  if (path.endsWith("/manage-blog"))
    return (
      <>
        <PageTitle title="Manage Blog">
          <Link className="btn btn-primary" to="/apps/blog/create">
            Create Blog
          </Link>
        </PageTitle>
        <Card>
          <Tabs
            items={["All", "Design", "Lifestyle", "Gadget", "Social", "Health"]}
            value={tab}
            onChange={setTab}
          />
          <DataTable
            rows={posts.filter((p) => tab === "All" || p.category === tab)}
            columns={[
              {
                key: "title",
                label: "Title",
                render: (p) => (
                  <Link to={"/apps/blog/detail/" + slug(p.title)}>
                    {p.title}
                  </Link>
                ),
              },
              { key: "category", label: "Category" },
              {
                key: "author",
                label: "Author",
                render: (p) => (
                  <div className="person-cell">
                    <Avatar i={p.id + 1} />
                    {p.author}
                  </div>
                ),
              },
              { key: "date", label: "Created At" },
              {
                key: "published",
                label: "Published",
                render: (p) => (
                  <Switch
                    label={"Publish " + p.title}
                    checked={p.published}
                    onChange={(v) =>
                      setPosts(
                        posts.map((x) =>
                          x.id === p.id ? { ...x, published: v } : x,
                        ),
                      )
                    }
                  />
                ),
              },
            ]}
            selectable
            pageSize={7}
            pageOptions={["7", "10", "20"]}
            onEdit={(p) => nav("/apps/blog/edit?id=" + p.id)}
            onDelete={setDeleting}
          />
        </Card>
        <Confirm
          open={!!deleting}
          title="Delete blog post?"
          onClose={() => setDeleting(null)}
          onConfirm={() => setPosts(posts.filter((p) => p.id !== deleting?.id))}
        />
      </>
    );
  if (detail && current)
    return (
      <>
        <PageTitle title="Blog Detail" />
        <Card className="article">
          <div className="article-cover">
            <img src={current.image} alt={current.title} />
            <span>2 min Read</span>
          </div>
          <div className="article-body">
            <Avatar i={current.id + 1} />
            <Badge tone="neutral">{current.category}</Badge>
            <h1>{current.title}</h1>
            <div className="article-meta">
              <span>
                <Icon name="Eye" size={15} />
                7,442
              </span>
              <span>
                <Icon name="MessageCircle" size={15} />
                {comments.length}
              </span>
              <span>Sat, Nov 14</span>
            </div>
            <hr />
            <div className="prose">
              <h2>Title of the paragraph</h2>
              <p>{current.content}</p>
              <p>{articleText}</p>
              <p>
                <strong>This is strong text.</strong>
              </p>
              <p>
                <em>This is italic text.</em>
              </p>
              <h3>Unorder list</h3>
              <ul>
                <li>Figure out what it is or what it can do.</li>
                <li>The links it currently has.</li>
                <li>It allows you to start your bid.</li>
              </ul>
              <h3>Order list</h3>
              <ol>
                <li>Explore the possibilities.</li>
                <li>Review the details.</li>
                <li>Make your next move.</li>
              </ol>
              <h3>Quotes</h3>
              <blockquote>
                Life is short, Smile while you still have teeth!
              </blockquote>
            </div>
            <h2>Post Comments</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!comment.trim()) return;
                setComments([...comments, comment]);
                setComment("");
              }}
            >
              <textarea
                required
                aria-label="Write a comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button variant="primary">Post Comment</Button>
            </form>
            <h2 className="section-space">
              Comments <Badge>{comments.length}</Badge>
            </h2>
            {comments.map((c, i) => (
              <div className="article-comment" key={i}>
                <Avatar i={i + 1} />
                <div>
                  <strong>{followerNames[i % 21]}</strong>
                  <small>8 min ago</small>
                  <p>{c}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  return (
    <>
      <PageTitle title="Blog app">
        <Link className="btn btn-secondary" to="/apps/blog/manage-blog">
          Manage Blog
        </Link>
      </PageTitle>
      <div className="blog-grid">
        {posts
          .filter((p) => p.published)
          .map((p, i) => (
            <Card
              className={"blog-card " + (i < 2 ? "featured" : "")}
              key={p.id}
            >
              <Link
                to={"/apps/blog/detail/" + slug(p.title)}
                className="blog-cover"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  loading={i < 2 ? "eager" : "lazy"}
                />
                <span>2 min Read</span>
              </Link>
              <div className="blog-card-copy">
                <Avatar i={p.id + 1} />
                <Badge tone="neutral">{p.category}</Badge>
                <Link to={"/apps/blog/detail/" + slug(p.title)}>
                  <h2>{p.title}</h2>
                </Link>
                <div className="article-meta">
                  <span>
                    <Icon name="Eye" size={15} />
                    {[604, 3576, 8839, 4794, 7442][i % 5]}
                  </span>
                  <span>
                    <Icon name="MessageCircle" size={15} />3
                  </span>
                  <span>Nov {10 + (i % 8)}</span>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </>
  );
}
function BlogEditor({
  edit,
  posts,
  onSave,
}: {
  edit: boolean;
  posts: Post[];
  onSave: (p: Post) => void;
}) {
  const id = Number(new URLSearchParams(location.search).get("id") || 4);
  const [p, setP] = useState<Post>(
    edit
      ? posts.find((p) => p.id === id) || posts[0]
      : {
          id: Date.now(),
          title: "",
          category: "Gadget",
          image: "/images/blog/blog-img4.png",
          author: "Cameron",
          content: "",
          published: true,
          date: new Date().toISOString().slice(0, 10),
        },
  );
  const nav = useNavigate();
  return (
    <>
      <PageTitle title={edit ? "Blog Edit" : "Blog Create"} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(p);
        }}
      >
        <div className="editor-layout">
          <div>
            <Card title="Blog Details">
              <div className="card-body">
                <Field
                  label="Blog Title *"
                  hint="A blog title is required and recommended to be unique."
                >
                  <input
                    required
                    placeholder="Blog Title"
                    value={p.title}
                    onChange={(e) => setP({ ...p, title: e.target.value })}
                  />
                </Field>
                <Field label="Content">
                  <textarea
                    required
                    rows={14}
                    placeholder="Start typing..."
                    value={p.content}
                    onChange={(e) => setP({ ...p, content: e.target.value })}
                  />
                </Field>
                <Field label="Cover Image">
                  <Upload onChange={(image) => setP({ ...p, image })} />
                </Field>
                <img
                  className="editor-thumbnail"
                  src={p.image}
                  alt="Cover image preview"
                />
              </div>
            </Card>
          </div>
          <div>
            <Card title="Blog Status">
              <div className="card-body">
                <select
                  aria-label="Blog status"
                  value={p.published ? "Publish" : "Draft"}
                  onChange={(e) =>
                    setP({ ...p, published: e.target.value === "Publish" })
                  }
                >
                  <option>Publish</option>
                  <option>Draft</option>
                </select>
                <p className="muted">Set the blog status.</p>
              </div>
            </Card>
            <Card title="Blog Category" className="section-space">
              <div className="card-body">
                <Field label="Categories *">
                  <select
                    value={p.category}
                    onChange={(e) => setP({ ...p, category: e.target.value })}
                  >
                    {["Gadget", "Design", "Lifestyle", "Social", "Health"].map(
                      (s) => (
                        <option key={s}>{s}</option>
                      ),
                    )}
                  </select>
                </Field>
                <Field label="Tags">
                  <input placeholder="Add tags for blog" />
                </Field>
              </div>
            </Card>
            <Card title="Publish Date" className="section-space">
              <div className="card-body">
                <Field label="Select publish date *">
                  <input
                    type="date"
                    required
                    value={p.date}
                    onChange={(e) => setP({ ...p, date: e.target.value })}
                  />
                </Field>
                <p className="muted">
                  Choose the date when this blog post should be published.
                </p>
              </div>
            </Card>
          </div>
        </div>
        <div className="form-actions">
          <Button type="button" onClick={() => nav("/apps/blog/manage-blog")}>
            Cancel
          </Button>
          <Button variant="primary">Save changes</Button>
        </div>
      </form>
    </>
  );
}
