import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  money,
  navigation,
  searchLinks,
  type NavItem,
} from "../data";
import { usePersisted, useWorkspace } from "../state";
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  Icon,
  IconButton,
  Menu,
  Search,
} from "../ui";
const horizontalNavMeta = [
  { group: "Dashboard", label: "Dashboard", icon: "House" },
  { group: "Apps", label: "Apps", icon: "Briefcase" },
  { group: "UI Elements", label: "UI", icon: "LayoutGrid" },
  { group: "Widgets", label: "Widgets", icon: "Blocks" },
  { group: "Pages", label: "Pages", icon: "FileText" },
  { group: "Form Elements", label: "Forms", icon: "ClipboardList" },
  { group: "Charts", label: "Charts", icon: "PieChart" },
  { group: "Tables", label: "Tables", icon: "Table" },
];
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="brand" aria-label="RUTHLESS dashboard home">
      <img src="/favicon.svg" width="32" height="32" alt="" />
      {!compact && (
        <span>
          <strong>RUTHLESS</strong>
          <small>dashboard</small>
        </span>
      )}
    </Link>
  );
}
function NavEntry({
  item,
  collapsed = false,
  onNavigate,
}: {
  item: NavItem;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const { pathname } = useLocation();
  if (item.children)
    return (
      <details
        className="nav-group"
        open={item.children.some((x) => x.path === pathname) || undefined}
      >
        <summary title={collapsed ? item.label : undefined}>
          <Icon name={item.icon} className="nav-icon-draw" />
          <span>{item.label}</span>
          <Icon name="ChevronRight" size={14} />
        </summary>
        <div className="nav-submenu">
          {item.children.map((child) => (
            <NavLink
              onClick={onNavigate}
              key={child.path}
              to={child.path!}
              className={({ isActive }) =>
                "nav-link " + (isActive ? "active" : "")
              }
            >
              <i className="submenu-dot" />
              {child.label}
            </NavLink>
          ))}
        </div>
      </details>
    );
  return (
    <NavLink
      end={item.path === "/"}
      onClick={onNavigate}
      to={item.path!}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) => "nav-link " + (isActive ? "active" : "")}
    >
      <Icon name={item.icon} className="nav-icon-draw" />
      <span>{item.label}</span>
    </NavLink>
  );
}
function SidebarContent({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const { toast } = useWorkspace();
  return (
    <>
      <div className="sidebar-brand">
        <Brand compact={collapsed} />
        {!collapsed && <span className="version">V.1.0</span>}
      </div>
      <nav className="sidebar-scroll" aria-label="Main navigation">
        {navigation.map((section) => (
          <div className="nav-section" key={section.label}>
            <div className="nav-section-title">{section.label}</div>
            {section.items.map((i) => (
              <NavEntry
                key={i.label}
                item={i}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-bottom">
        {!collapsed && (
          <div className="plan">
            <div>
              <strong>
                <Icon name="Rocket" /> Basic Plan
              </strong>
              <strong>70%</strong>
            </div>
            <div className="progress">
              <span style={{ width: "70%" }} />
            </div>
            <p>68/100 monthly limit used</p>
            <Link
              className="btn turquoise"
              to="/theme-pages/pricing"
              onClick={onNavigate}
            >
              Upgrade
            </Link>
          </div>
        )}
        <NavLink
          to="/theme-pages/faq"
          className="nav-link"
          onClick={onNavigate}
        >
          <Icon name="LifeBuoy" />
          <span>Help Center</span>
        </NavLink>
        <button
          className="nav-link"
          onClick={() =>
            toast(
              "Project setup and route details are in the included README.md.",
            )
          }
        >
          <Icon name="BookOpen" />
          <span>Documentation</span>
        </button>
      </div>
    </>
  );
}
export function Shell() {
  const [collapsed, setCollapsed] = usePersisted("sidebar", false);
  const [mobile, setMobile] = useState(false);
  const [panel, setPanel] = useState("");
  const [headerMenu, setHeaderMenu] = useState("");
  const [query, setQuery] = useState("");
  const [language, setLanguage] = usePersisted("language", "English (UK)");
  const { theme, setTheme, cart, setCart, toast } = useWorkspace();
  const loc = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setMobile(false);
    setPanel("");
    setHeaderMenu("");
    setQuery("");
    window.scrollTo(0, 0);
  }, [loc.pathname]);
  const total = cart.reduce((n, x) => n + x.product.price * x.quantity, 0);
  const searchItems = searchLinks
    .filter((i) =>
      (i.label + " " + (i.path || ""))
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .slice(0, 10);
  return (
    <div
      className={`workspace ${collapsed ? "collapsed" : ""} ${theme.layout === "horizontal" ? "horizontal" : ""}`}
    >
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside className="sidebar">
        <SidebarContent collapsed={collapsed} />
      </aside>
      <Drawer
        open={mobile}
        onClose={() => setMobile(false)}
        title="Sidebar"
        side={theme.direction === "ltr" ? "left" : "right"}
        className="mobile-sidebar"
      >
        <SidebarContent onNavigate={() => setMobile(false)} />
      </Drawer>
      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            {theme.layout === "horizontal" && (
              <div className="horizontal-brand">
                <Brand />
              </div>
            )}
            <div className="mobile-brand">
              <Brand compact />
            </div>
            <IconButton
              name="PanelLeft"
              label="Toggle sidebar"
              onClick={() =>
                window.innerWidth < 1280
                  ? setMobile(!mobile)
                  : setCollapsed(!collapsed)
              }
            />
            <span className="header-separator" />
            <div className="header-search">
              <Search
                value={query}
                onChange={setQuery}
                placeholder="Search...."
              />
              {query && (
                <div className="popover search-results">
                  {searchItems.length ? (
                    searchItems.map((i, n) => (
                      <Link key={i.path! + n} to={i.path!}>
                        <Icon name={i.icon} />
                        <span>
                          {i.label}
                          <small>{i.path}</small>
                        </span>
                      </Link>
                    ))
                  ) : (
                    <p>No Components Found!</p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="topbar-right">
            <IconButton
              name={theme.mode === "dark" ? "Sun" : "Moon"}
              label="Toggle color theme"
              onClick={() =>
                setTheme({
                  ...theme,
                  mode: theme.mode === "dark" ? "light" : "dark",
                })
              }
            />
            <Menu
              label="Choose language"
              trigger={
                <img
                  src="/images/flag/icon-flag-en.svg"
                  width="20"
                  height="20"
                  alt="language"
                />
              }
              items={[
                "English (UK)",
                "中国人 (Chinese)",
                "français (French)",
                "عربي (Arabic)",
              ].map((label) => ({
                label: label + (label === language ? " ✓" : ""),
                onClick: () => {
                  setLanguage(label);
                  toast(
                    "Language preference saved. Demo content is in English.",
                  );
                },
              }))}
            />
            <button
              className="icon-button cart-button"
              aria-label="Open shopping cart"
              onClick={() => setPanel("cart")}
            >
              <Icon name="ShoppingCart" size={20} />
            </button>
            <div className="header-menu-wrap">
              <button
                className="icon-button notification-button"
                aria-label="Open notifications"
                onClick={() =>
                  setHeaderMenu(
                    headerMenu === "notifications" ? "" : "notifications",
                  )
                }
              >
                <span className="ping-dot" />
                <Icon name="Bell" size={20} />
              </button>
            </div>
            <IconButton
              name="Mail"
              label="Open inbox"
              onClick={() =>
                setHeaderMenu(headerMenu === "inbox" ? "" : "inbox")
              }
            />
            <button
              className="avatar-trigger"
              aria-label="Open profile"
              onClick={() => setPanel("profile")}
            >
              <Avatar size={32} />
            </button>
          </div>
          {headerMenu && (
            <>
              <button
                className="menu-dismiss"
                aria-label="Close menu"
                onClick={() => setHeaderMenu("")}
              />
              <div className="popover header-popover">
                <div className="popover-heading">
                  <h3>{headerMenu === "inbox" ? "Inbox" : "Notifications"}</h3>
                  <Badge>{headerMenu === "inbox" ? "3" : "5"} new</Badge>
                </div>
                <div className="notification-list">
                  {(headerMenu === "inbox"
                    ? [
                        "Michell Flintoff",
                        "Bianca Anderson",
                        "Andrew Johnson",
                        "Jolly Cummins",
                        "Josh Macklow",
                      ]
                    : [
                        "Event Today",
                        "Settings",
                        "Launch Admin",
                        "Launch Admin",
                        "Event Today",
                        "Settings",
                      ]
                  ).map((name, i) => (
                    <Link
                      key={name + i}
                      to={
                        headerMenu === "inbox"
                          ? "/apps/chats"
                          : "/apps/calendar"
                      }
                      className="notification-item"
                      onClick={() => setHeaderMenu("")}
                      style={{ animationDelay: `${40 + i * 35}ms` }}
                    >
                      {headerMenu === "inbox" ? (
                        <Avatar i={i + 1} />
                      ) : (
                        <span className="notification-icon">
                          <Icon name={i % 2 ? "Settings" : "CalendarDays"} />
                        </span>
                      )}
                      <span>
                        <strong>{name}</strong>
                        <small>
                          {headerMenu === "inbox"
                            ? [
                                "You: Yesterday was great...",
                                "Nice looking dress you...",
                                "Sent a photo",
                                "If I don't like something",
                                "$230 deducted from account",
                              ][i]
                            : [
                                "Just a reminder that you have event",
                                "You can customize this template as you want",
                                "Just see the my new admin!",
                              ][i % 3]}
                        </small>
                      </span>
                      <small>{i ? "4:36 PM" : "9:15 AM"}</small>
                    </Link>
                  ))}
                </div>
                <Link
                  className="btn btn-secondary full"
                  to={headerMenu === "inbox" ? "/apps/chats" : "/apps/calendar"}
                >
                  See All{" "}
                  {headerMenu === "inbox" ? "Messages" : "Notifications"}
                </Link>
              </div>
            </>
          )}
        </header>
        {theme.layout === "horizontal" && (
          <nav className="horizontal-nav">
            {horizontalNavMeta.map((meta) => {
              const group = navigation.find((g) => g.label === meta.group);
              if (!group) return null;
              return (
                <Menu
                  key={meta.group}
                  label={meta.group}
                  trigger={
                    <span>
                      <Icon name={meta.icon} size={16} />
                      {meta.label}
                      <Icon name="ChevronDown" size={13} />
                    </span>
                  }
                  items={group.items.flatMap((i) =>
                    i.children
                      ? i.children.map((child) => ({
                          label: i.label + " · " + child.label,
                          onClick: () => {
                            navigate(child.path!);
                          },
                        }))
                      : [
                          {
                            label: i.label,
                            onClick: () => {
                              navigate(i.path!);
                            },
                          },
                        ],
                  )}
                />
              );
            })}
          </nav>
        )}
        <div className="main-content" id="main-content">
          <div className="content-container">
            <div className="page-transition" key={loc.pathname}>
              <Outlet />
            </div>
            <footer>
              <p>
                © {new Date().getFullYear()} by{" "}
                <Link to="/">RUTHLESS dashboard</Link>, creating a better web
                for you.
              </p>
              <div>
                <Link to="/theme-pages/faq">About Us</Link>
                <Link to="/apps/blog/post">Blog</Link>
                <button
                  onClick={() =>
                    toast(
                      "Reference assets retain their original licensing. See README.md and ASSET-PROVENANCE.json.",
                    )
                  }
                >
                  License
                </button>
              </div>
            </footer>
          </div>
        </div>
      </main>
      <div className="floating-actions">
        <Link to="/theme-pages/pricing" className="btn turquoise">
          Buy Now
        </Link>
        <button
          className="customizer-trigger"
          aria-label="Open customizer"
          onClick={() => setPanel("customizer")}
        >
          <Icon name="Settings" size={20} />
        </button>
      </div>
      <Drawer
        open={panel === "customizer"}
        onClose={() => setPanel("")}
        title="Customizer"
      >
        <p className="muted customizer-intro">
          Make changes to your customizer here.
        </p>
        <div className="customizer">
          <h3>Theme Style</h3>
          <div className="theme-styles">
            {["Vega", "Nova", "Maia", "Lyra", "Mira", "Luma", "Rhea"].map(
              (s, i) => (
                <button
                  key={s}
                  className={theme.style === s.toLowerCase() ? "selected" : ""}
                  onClick={() => setTheme({ ...theme, style: s.toLowerCase() })}
                >
                  <span style={{ borderRadius: [4, 6, 99, 0, 3, 99, 8][i] }} />
                  {s}
                </button>
              ),
            )}
          </div>
          <h3>Theme Option</h3>
          <div className="button-group">
            {(["light", "dark"] as const).map((s) => (
              <Button
                key={s}
                className={theme.mode === s ? "selected" : ""}
                onClick={() => setTheme({ ...theme, mode: s })}
              >
                <Icon name={s === "dark" ? "Moon" : "Sun"} />
                {s}
              </Button>
            ))}
          </div>
          <h3>Theme Direction</h3>
          <div className="button-group">
            {(["ltr", "rtl"] as const).map((s) => (
              <Button
                key={s}
                className={theme.direction === s ? "selected" : ""}
                onClick={() => setTheme({ ...theme, direction: s })}
              >
                <Icon name="AlignLeft" />
                {s.toUpperCase()}
              </Button>
            ))}
          </div>
          <h3>Choose Your Theme Colors</h3>
          <div className="color-pickers">
            <label className="color-picker">
              <span
                className="color-picker-dot"
                style={{ background: theme.primary || "#e5e5e5" }}
              />
              <Icon name="Pencil" size={14} />
              <input
                aria-label="Primary color"
                type="color"
                value={theme.primary || "#e5e5e5"}
                onChange={(e) =>
                  setTheme({ ...theme, primary: e.target.value })
                }
              />
            </label>
            <label className="color-picker">
              <span
                className="color-picker-dot"
                style={{ background: theme.secondary || "#262626" }}
              />
              <Icon name="Pencil" size={14} />
              <input
                aria-label="Secondary color"
                type="color"
                value={theme.secondary || "#262626"}
                onChange={(e) =>
                  setTheme({ ...theme, secondary: e.target.value })
                }
              />
            </label>
          </div>
          <h3>Layout Type</h3>
          <div className="button-group">
            {(["vertical", "horizontal"] as const).map((s) => (
              <Button
                key={s}
                className={theme.layout === s ? "selected" : ""}
                onClick={() => setTheme({ ...theme, layout: s })}
              >
                <Icon name={s === "vertical" ? "PanelLeft" : "PanelsTopLeft"} />
                {s}
              </Button>
            ))}
          </div>
          <h3>Container Option</h3>
          <div className="button-group">
            {(["boxed", "full"] as const).map((s) => (
              <Button
                key={s}
                className={theme.container === s ? "selected" : ""}
                onClick={() => setTheme({ ...theme, container: s })}
              >
                <Icon name="Columns2" />
                {s}
              </Button>
            ))}
          </div>
        </div>
      </Drawer>
      <Drawer
        open={panel === "profile"}
        onClose={() => setPanel("")}
        title="My Profile"
      >
        <div className="profile-identity">
          <Avatar size={64} />
          <div>
            <h3>Cameron</h3>
            <p className="muted">info@ruthless.dashboard</p>
          </div>
        </div>
        <div className="profile-links">
          {[
            ["Home", "/", "House"],
            ["Profile", "/apps/user-profile/profile", "UserRound"],
            ["Invoice", "/apps/invoice/list", "FileText"],
            ["Subscription", "/theme-pages/pricing", "CreditCard"],
            ["Account Settings", "/theme-pages/account-settings", "Settings"],
          ].map(([name, path, icon]) => (
            <Link key={name} to={path}>
              <Icon name={icon} />
              {name}
              <Icon name="ChevronRight" size={15} />
            </Link>
          ))}
        </div>
        <CardPromo />
        <Link className="btn btn-primary full" to="/auth/auth1/login">
          Log Out
        </Link>
      </Drawer>
      <Drawer
        open={panel === "cart"}
        onClose={() => setPanel("")}
        title="Shopping Cart"
        className="cart-drawer"
      >
        {cart.length ? (
          cart.map((item) => (
            <div className="cart-item" key={item.product.id}>
              <img src={item.product.image} alt={item.product.name} />
              <div>
                <strong>{item.product.name}</strong>
                <p className="muted">{item.product.category} Item</p>
                <b>{money(item.product.price)}</b>
                <div className="quantity">
                  <button
                    aria-label={"Decrease " + item.product.name}
                    onClick={() =>
                      setCart(
                        cart.map((x) =>
                          x.product.id === item.product.id
                            ? { ...x, quantity: Math.max(1, x.quantity - 1) }
                            : x,
                        ),
                      )
                    }
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    aria-label={"Increase " + item.product.name}
                    onClick={() =>
                      setCart(
                        cart.map((x) =>
                          x.product.id === item.product.id
                            ? { ...x, quantity: x.quantity + 1 }
                            : x,
                        ),
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <IconButton
                name="X"
                label={"Remove " + item.product.name}
                onClick={() =>
                  setCart(cart.filter((x) => x.product.id !== item.product.id))
                }
              />
            </div>
          ))
        ) : (
          <div className="empty">
            <Icon name="ShoppingBag" size={40} />
            <h3>Your cart is empty</h3>
            <p>Add products from the shop to get started.</p>
            <Link className="btn btn-primary" to="/apps/ecommerce/shop">
              Browse products
            </Link>
          </div>
        )}
        <div className="cart-total">
          <p>
            <span>Sub Total</span>
            <strong>{money(total)}</strong>
          </p>
          <p>
            <span>Total</span>
            <strong>{money(total)}</strong>
          </p>
        </div>
        <Link className="btn btn-primary full" to="/apps/ecommerce/checkout">
          Go to shopping cart
        </Link>
      </Drawer>
    </div>
  );
}
function CardPromo() {
  return (
    <div className="card-promo">
      <Icon name="Sparkles" size={32} />
      <h3>RUTHLESS dashboard</h3>
      <p>Customize your dashboard</p>
    </div>
  );
}
