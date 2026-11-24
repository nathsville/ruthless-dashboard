import { Component, Suspense, lazy, useEffect, type ReactNode } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { WorkspaceProvider } from "./state";
import { Shell } from "./components/Shell";
import { Analytics } from "./pages/Dashboards";
import { allLinks } from "./data";
import { Button, Icon } from "./ui";
const Dashboard = lazy(() =>
  import("./pages/Dashboards").then((m) => ({ default: m.DashboardPage })),
);
const Work = lazy(() =>
  import("./pages/WorkApps").then((m) => ({ default: m.WorkApp })),
);
const Commerce = lazy(() =>
  import("./pages/Commerce").then((m) => ({ default: m.CommercePage })),
);
const Invoices = lazy(() =>
  import("./pages/Invoices").then((m) => ({ default: m.InvoicesPage })),
);
const Profile = lazy(() =>
  import("./pages/Content").then((m) => ({ default: m.ProfilePage })),
);
const Blogs = lazy(() =>
  import("./pages/Content").then((m) => ({ default: m.BlogsPage })),
);
const Tables = lazy(() =>
  import("./pages/Tables").then((m) => ({ default: m.TablesPage })),
);
const Theme = lazy(() =>
  import("./pages/ThemePages").then((m) => ({ default: m.ThemePage })),
);
const Auth = lazy(() =>
  import("./pages/Auth").then((m) => ({ default: m.AuthPage })),
);
const Library = lazy(() =>
  import("./pages/Library").then((m) => ({ default: m.LibraryPage })),
);
const ImageAI = lazy(() =>
  import("./pages/Library").then((m) => ({ default: m.ImageAI })),
);
function titleFor(pathname: string) {
  if (pathname === "/apps/invoice/list") return "Invoice List";
  if (pathname === "/apps/invoice/create") return "Invoice Create";
  if (pathname.startsWith("/apps/invoice/detail/")) return "Invoice Details";
  if (pathname.startsWith("/apps/invoice/edit/")) return "Invoice Edit";
  if (pathname.startsWith("/apps/ecommerce/detail/")) return "Shop Detail";
  if (pathname.startsWith("/apps/blog/detail/")) return "Blog Details";
  return allLinks.find((i) => i.path === pathname)?.label || "Workspace";
}
function Titles() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = titleFor(pathname) + " | RUTHLESS dashboard";
  }, [pathname]);
  return null;
}
function Loading() {
  return (
    <div className="page-loading" role="status">
      <Icon name="LoaderCircle" size={30} className="spin" />
      <span className="visually-hidden">Loading workspace</span>
    </div>
  );
}
class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="auth-error">
        <Icon name="CircleAlert" size={48} />
        <h1>Something went wrong</h1>
        <p>Your data is still saved in this browser. Reload to try again.</p>
        <Button onClick={() => window.location.reload()}>
          Reload dashboard
        </Button>
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <WorkspaceProvider>
          <Titles />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/auth/*" element={<Auth />} />
              <Route element={<Shell />}>
                <Route index element={<Analytics />} />
                <Route path="dashboards/:kind" element={<Dashboard />} />
                <Route path="apps/image-ai" element={<ImageAI />} />
                <Route path="apps/invoice/:action" element={<Invoices />} />
                <Route
                  path="apps/invoice/:action/:key"
                  element={<Invoices />}
                />
                <Route path="apps/user-profile/:kind" element={<Profile />} />
                <Route path="apps/blog/:action" element={<Blogs />} />
                <Route path="apps/blog/detail/:slug" element={<Blogs />} />
                <Route path="apps/ecommerce/:action" element={<Commerce />} />
                <Route
                  path="apps/ecommerce/detail/:id"
                  element={<Commerce />}
                />
                <Route path="apps/:kind" element={<Work />} />
                <Route path="react-tables/:kind" element={<Tables />} />
                <Route path="shadcn-tables/:kind" element={<Tables />} />
                <Route path="theme-pages/*" element={<Theme />} />
                <Route path="components/:kind" element={<Library />} />
                <Route path="ui-blocks/:kind" element={<Library />} />
                <Route path="forms/:kind" element={<Library />} />
                <Route path="icons/:kind" element={<Library />} />
              </Route>
              <Route path="*" element={<Auth />} />
            </Routes>
          </Suspense>
        </WorkspaceProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
