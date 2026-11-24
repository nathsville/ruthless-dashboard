import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Lottie from "lottie-react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Icon,
  Menu,
  Modal,
  Select,
  Stars,
  Tabs,
} from "../ui";
import { DataTable, type Column } from "../components/DataTable";
import {
  FacebookIcon,
  GoogleIcon,
  InstagramIcon,
  XIcon,
} from "../components/BrandIcons";
import {
  GenericChart,
  Legend,
  MiniChart,
  SalesChart,
  TickRing,
  chartColors,
} from "../components/Charts";
import { money, orders, people, products } from "../data";
import { downloadText, useWorkspace } from "../state";
export function greeting() {
  const h = new Date().getHours();
  return h >= 5 && h < 12
    ? "Good Morning"
    : h < 17 && h >= 12
      ? "Good Afternoon"
      : h >= 17 && h < 21
        ? "Good Evening"
        : "Good Night";
}
function Emoji() {
  const [data, setData] = useState<object | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(
      "/animations/emoji/" +
        (/Morning|Afternoon/.test(greeting()) ? "sun" : "moon") +
        ".json",
      { signal: controller.signal },
    )
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return (
    <span className="greeting-emoji">
      {data && <Lottie animationData={data} loop />}
    </span>
  );
}
export function KPI({
  label,
  value,
  change = "40%",
  icon = "ShoppingBag",
  button = false,
}: {
  label: string;
  value: string;
  change?: string;
  icon?: string;
  button?: boolean;
}) {
  const { toast } = useWorkspace();
  return (
    <Card className="kpi-card">
      <div className="kpi-heading">
        <div>
          <p>{label}</p>
          <div className="kpi-value">
            <strong>{value}</strong>
            {button && <Badge>{change}</Badge>}
          </div>
        </div>
        <span className="kpi-icon">
          <Icon name={icon} size={16} />
        </span>
      </div>
      {button ? (
        <Button
          onClick={() =>
            toast(
              `${label}: ${value}, ${change} compared with the previous period.`,
            )
          }
        >
          See Statistics <Icon name="ArrowRight" size={16} />
        </Button>
      ) : (
        <p className="kpi-change">
          <span className={change.startsWith("-") ? "negative" : "positive"}>
            {change}
          </span>{" "}
          <span className="muted">vs last month</span>
        </p>
      )}
    </Card>
  );
}
export function Analytics() {
  const [range, setRange] = useState("Last 30 Days");
  const [showReport, setShowReport] = useState(false);
  const { toast } = useWorkspace();
  const [rows, setRows] = useState([
    {
      id: 1,
      name: "AeroBeat X9 Earbuds",
      description: "High resolution drone",
      price: 1499,
      status: "High Demand",
    },
    {
      id: 2,
      name: "DataDrive Secure X",
      description: "External SSD 2TB",
      price: 199,
      status: "Low Demand",
    },
    {
      id: 3,
      name: "FlexBook Infinity",
      description: "Convertible laptop",
      price: 1499,
      status: "High Demand",
    },
    {
      id: 4,
      name: "PulseFit Tracker 2",
      description: "Advanced fitness watch",
      price: 1499,
      status: "Low Demand",
    },
  ]);
  const cols: Column<(typeof rows)[number]>[] = [
    {
      key: "name",
      label: "Item",
      render: (r) => (
        <div className="product-name">
          <strong>{r.name}</strong>
          <span>{r.description}</span>
        </div>
      ),
    },
    { key: "rating", label: "Rating", render: () => <Stars /> },
    {
      key: "price",
      label: "Price",
      render: (r) => <span className="muted">{money(r.price)}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (r) => <Badge>{r.status}</Badge>,
    },
  ];
  return (
    <>
      <div className="dashboard-grid analytics-grid">
        <div className="span-8">
          <Card className="welcome-card">
            <div className="welcome-copy">
              <h1>
                {greeting()}, Cameron <Emoji />
              </h1>
              <p>
                Stay informed with today’s analytics. Get a quick snapshot of
                key statistics.
              </p>
              <Link
                to="/react-tables/order-datatable"
                className="btn btn-primary"
              >
                View Full Report <Icon name="ArrowRight" size={16} />
              </Link>
            </div>
            <img
              className="welcome-illustration dark-illustration"
              src="/images/backgrounds/analytic-user-dark.svg"
              alt="Person working at a desk"
            />
            <img
              className="welcome-illustration light-illustration"
              src="/images/backgrounds/analytic-user.svg"
              alt=""
            />
          </Card>
        </div>
        <div className="span-4">
          <Card title="Key Insights" icon="Lightbulb" className="insight-card">
            <div className="insight-content">
              <strong className="insight-number">$20,320</strong>
              <p>
                <span className="positive">+40%</span>
                <span className="muted">vs last month</span>
              </p>
              <div
                className="segmented-bars"
                aria-label="Asia 60%, USA 25%, Europe 15%"
              >
                {Array.from({ length: 52 }, (_, i) => (
                  <span
                    key={i}
                    title={
                      i < 31 ? "Asia: 60%" : i < 44 ? "USA: 25%" : "Europe: 15%"
                    }
                    style={{
                      background: chartColors[i < 31 ? 0 : i < 44 ? 1 : 2],
                      animationDelay: `${200 + 12 * i}ms`,
                    }}
                  />
                ))}
              </div>
              <Legend labels={["Asia", "USA", "Europe"]} />
            </div>
          </Card>
        </div>
        <div className="span-8">
          <Card
            title="Sales Overview"
            icon="Activity"
            action={
              <span className="positive growth">
                <Icon name="CircleArrowUp" size={14} /> +18.0%
              </span>
            }
            className="sales-overview"
          >
            <div className="sales-content">
              <div className="sales-controls">
                <div>
                  <p>Revenue Overview</p>
                  <div className="sales-number">
                    <strong>$640,000</strong>
                    <span className="positive">+18.0%</span>
                    <span className="muted">vs last month</span>
                  </div>
                </div>
                <div className="sales-filter">
                  <Legend />
                  <Select
                    value={range}
                    options={["Last 7 Days", "Last 30 Days", "Last 90 Days"]}
                    onChange={setRange}
                    label="Sales date range"
                  />
                </div>
              </div>
              <SalesChart range={range} />
            </div>
          </Card>
        </div>
        <div className="span-4">
          <Card
            title="Sales Distribution"
            icon="HardDrive"
            className="sales-distribution"
          >
            <TickRing />
          </Card>
        </div>
        {[
          ["Weekly sales", "714k", "40%", "Handbag"],
          ["New users", "1.35m", "20%", "Users"],
          ["Purchase Orders", "1.72m", "40%", "Box"],
        ].map(([label, value, change, icon]) => (
          <div className="span-4 kpi-span" key={label}>
            <KPI
              label={label}
              value={value}
              change={change}
              icon={icon}
              button
            />
          </div>
        ))}
        <div className="span-4">
          <Card
            title="Campaign Performance"
            icon="Megaphone"
            className="campaign-card"
          >
            <div className="campaign-list">
              {[
                ["Instagram", "8.49k", "Completed"],
                ["Google", "9.12k", "Running"],
                ["Facebook", "6.98k", "Stopped"],
                ["X/Twiter", "8.92k", "Stopped"],
              ].map(([name, count, status]) => (
                <div className="campaign-row" key={name}>
                  <span className="brand-social">
                    {name === "Instagram" ? (
                      <InstagramIcon />
                    ) : name === "Google" ? (
                      <GoogleIcon />
                    ) : name === "Facebook" ? (
                      <FacebookIcon />
                    ) : (
                      <XIcon />
                    )}
                  </span>
                  <div>
                    <strong>{name}</strong>
                    <p>{count} users</p>
                  </div>
                  <Badge>{status}</Badge>
                </div>
              ))}
            </div>
            <div className="campaign-footer">
              <Button className="full" onClick={() => setShowReport(true)}>
                See Report <Icon name="ArrowRight" size={16} />
              </Button>
            </div>
          </Card>
        </div>
        <div className="span-8">
          <Card
            title="Top Selling Products"
            icon="ShoppingBag"
            className="top-products"
          >
            <DataTable
              rows={rows}
              columns={cols}
              selectable
              defaultSortKey="name"
              pageSize={5}
              pageOptions={["4", "5", "6"]}
              actions={(r) => (
                <Menu
                  label={"Actions for " + r.name}
                  items={[
                    {
                      label: "Add",
                      onClick: () =>
                        toast(
                          "Manage products in Apps → Ecommerce → Add Product.",
                        ),
                    },
                    {
                      label: "Edit",
                      onClick: () =>
                        toast(
                          "Manage product details in the Ecommerce product list.",
                        ),
                    },
                    {
                      label: "Delete",
                      danger: true,
                      onClick: () => setRows(rows.filter((x) => x.id !== r.id)),
                    },
                  ]}
                />
              )}
            />
          </Card>
        </div>
      </div>
      <Modal
        open={showReport}
        onClose={() => setShowReport(false)}
        title="Campaign Performance Report"
      >
        <p className="muted">A snapshot of your demo campaign results.</p>
        {[
          ["Instagram", "8,490"],
          ["Google", "9,120"],
          ["Facebook", "6,980"],
          ["X/Twiter", "8,920"],
        ].map(([n, v]) => (
          <div className="summary-row" key={n}>
            <strong>{n}</strong>
            <span>{v} users</span>
          </div>
        ))}
        <Button
          className="full"
          onClick={() =>
            downloadText(
              "ruthless-campaign-report.csv",
              "Campaign,Users\nInstagram,8490\nGoogle,9120\nFacebook,6980\nX,8920",
              "text/csv",
            )
          }
        >
          Download CSV
        </Button>
      </Modal>
    </>
  );
}
const dashboardConfig: Record<
  string,
  {
    title: string;
    description: string;
    period: string;
    metrics: string[][];
    chart: string;
    chartValue: string;
    ringTitle: string;
    ringValue: string;
    listTitle: string;
    list: string[][];
    tableTitle: string;
  }
> = {
  "saas-ai": {
    title: "Welcome back, David",
    description: "Track your AI business growth with real-time intelligence.",
    period: "Last 30 Days",
    metrics: [
      ["AI Revenue", "$148,320", "+24.8%", "TrendingUp"],
      ["Active AI Users", "84,230", "+18.2%", "UsersRound"],
      ["AI Automations", "12,405", "-23.4%", "Cpu"],
      ["MRR Growth", "$52,890", "+12.6%", "Wallet"],
    ],
    chart: "Sales Overview",
    chartValue: "$1,284,920",
    ringTitle: "Revenue Distribution",
    ringValue: "$8,420,000",
    listTitle: "Ask AI",
    list: [
      ["Text Assistance", "Generate useful text", "ListChecks"],
      ["Process Automation", "Organize your workflow", "Settings"],
      ["Schedule Optimize", "Plan your day", "Clock"],
      ["Smart Response", "Get a quick answer", "MessageCircle"],
    ],
    tableTitle: "Best Performing AI Products",
  },
  school: {
    title: "School Management",
    description:
      "Track student performance, attendance, and school activities.",
    period: "Spring 2026",
    metrics: [
      ["Total Students", "2,450", "+12.3%", "GraduationCap"],
      ["Total Teachers", "148", "+5.2%", "UsersRound"],
      ["Attendance Rate", "92.4%", "-1.2%", "UserCheck"],
      ["Active Classes", "64", "+3.1%", "School"],
    ],
    chart: "Attendance Overview",
    chartValue: "92.4%",
    ringTitle: "Grade Distribution",
    ringValue: "2,235",
    listTitle: "Upcoming Events",
    list: [
      ["Mid-term Examinations", "Jun 20, 2026 · 9:00 AM", "CalendarDays"],
      ["Science Fair", "Jun 25, 2026 · 10:00 AM", "FlaskConical"],
      ["Parent-Teacher Meeting", "Jun 28, 2026 · 2:00 PM", "UsersRound"],
      ["Annual Sports Day", "Jul 5, 2026 · 8:00 AM", "Trophy"],
      ["Final Examinations", "Jul 15, 2026 · 9:00 AM", "CalendarDays"],
    ],
    tableTitle: "Recent Enrollments",
  },
  health: {
    title: "Health Management",
    description:
      "Monitor patient care, appointments, and hospital performance.",
    period: "This Month",
    metrics: [
      ["Total Patients", "3,842", "+8.4%", "HeartPulse"],
      ["Monthly Revenue", "$275K", "+14.2%", "Wallet"],
      ["Weekly Appointments", "762", "+6.2%", "CalendarDays"],
      ["Recovery Rate", "94%", "+1.8%", "Activity"],
    ],
    chart: "Patient Flow Overview",
    chartValue: "1,240",
    ringTitle: "Department Stats",
    ringValue: "755",
    listTitle: "Doctor Performance",
    list: [
      ["Dr. Sarah Mitchell", "Cardiology · 148 patients", "Available"],
      ["Dr. James Carter", "Neurology · 132 patients", "On Duty"],
      ["Dr. Priya Sharma", "Pediatrics · 121 patients", "Available"],
      ["Dr. Robert Chen", "Orthopedics · 115 patients", "On Leave"],
      ["Dr. Emily Walsh", "Oncology · 98 patients", "On Duty"],
    ],
    tableTitle: "Recent Patients",
  },
  logistics: {
    title: "Logistics & Supply Chain Command",
    description:
      "Real-time fleet tracking, shipment SLA monitoring, hub storage, and route efficiency.",
    period: "Global Network",
    metrics: [
      ["Active Fleet Vehicles", "184 Units", "+8.4%", "Truck"],
      ["On-Time Delivery Rate", "96.8%", "+2.1%", "Timer"],
      ["Freight Volume", "3,420 Cargo", "+14.2%", "Package"],
      ["Fleet Fuel Efficiency", "94.2%", "-0.8%", "Fuel"],
    ],
    chart: "Freight Volume & SLA Performance",
    chartValue: "3,150 Cargo",
    ringTitle: "Shipment Status Distribution",
    ringValue: "3,420",
    listTitle: "Active Fleet Drivers",
    list: [
      ["Marcus Vance", "Volvo FH16 (#402)", "Active"],
      ["Elena Rostova", "Scania R500 (#218)", "Standby"],
      ["David Kim", "MAN TGX (#512)", "Active"],
      ["Sarah Jenkins", "Freightliner (#109)", "Off Duty"],
      ["Alexander Wright", "Kenworth T680 (#305)", "Active"],
      ["Chloe Bennett", "Peterbilt 579 (#812)", "Active"],
    ],
    tableTitle: "Active Freight Shipments",
  },
  restaurant: {
    title: "DineCore Bistro POS",
    description:
      "Main Dining Branch · POS Register Terminal #01 · Cashier: Elena R.",
    period: "Last 30 days",
    metrics: [
      ["Today's Gross Sales", "$5,840.50", "+14.5%", "Wallet"],
      ["Total Orders Served", "176", "-8.3%", "UtensilsCrossed"],
      ["Occupied Tables", "18 / 24", "75%", "Armchair"],
      ["Avg Guest Check", "$33.18", "-4.2%", "Receipt"],
    ],
    chart: "Daily Dining Revenue",
    chartValue: "$5,840.50",
    ringTitle: "POS Order Channels",
    ringValue: "176",
    listTitle: "Top Selling Dishes",
    list: [
      ["Pepperoni Pizza", "$1,890.00 · 45 orders", "pepperoni-pizza"],
      [
        "Truffle Mushroom Burger",
        "$1,420.00 · 71 orders",
        "truffle-mushroom-burger",
      ],
      [
        "Woodfired Margherita Pizza",
        "$1,176.00 · 84 orders",
        "woodfired-margherita-pizza",
      ],
      ["Avocado Caesar Bowl", "$648.00 · 54 orders", "avocado-caesar-bowl"],
      [
        "Iced Caramel Macchiato",
        "$520.00 · 104 orders",
        "iced-caramel-macchiato",
      ],
    ],
    tableTitle: "Live POS Kitchen & Order Queue",
  },
};
export function DashboardPage() {
  const { kind = "modern" } = useParams();
  const [range, setRange] = useState("Last 30 Days");
  const { toast } = useWorkspace();
  if (kind === "ecommerce") return <EcommerceDashboard />;
  if (kind === "modern") return <ModernDashboard />;
  const c = dashboardConfig[kind];
  if (!c) return <Analytics />;
  const tableRows =
    kind === "school"
      ? [
          "Emma Johnson",
          "Liam Martinez",
          "Olivia Chen",
          "Noah Williams",
          "Ava Thompson",
          "James Carter",
        ].map((name, i) => ({
          id: i,
          name,
          category: ["10th", "8th", "11th", "9th", "12th"][i % 5],
          detail: [
            "Science",
            "Mathematics",
            "Literature",
            "History",
            "Physics",
          ][i % 5],
          status: [
            "Active",
            "Active",
            "Pending",
            "Active",
            "Inactive",
            "Pending",
          ][i],
          value: "2026",
        }))
      : kind === "health"
        ? [
            "Alice Morgan",
            "David Kim",
            "Rachel Patel",
            "Tom Nguyen",
            "Sophie Brown",
          ].map((name, i) => ({
            id: i,
            name,
            category: [
              "Cardiology",
              "Neurology",
              "Orthopedics",
              "Oncology",
              "Pediatrics",
            ][i],
            detail: [
              "Hypertension",
              "Migraine",
              "Fracture",
              "Follow-up",
              "Fever",
            ][i],
            status: [
              "Admitted",
              "Outpatient",
              "Admitted",
              "Discharged",
              "Outpatient",
            ][i],
            value: [42, 58, 34, 67, 29][i] + " yrs",
          }))
        : kind === "logistics"
          ? [
              "TRK-8921-US",
              "TRK-7412-EU",
              "TRK-9043-AP",
              "TRK-6155-US",
              "TRK-3389-EU",
              "TRK-4821-AP",
            ].map((name, i) => ({
              id: i,
              name,
              category: [
                "Chicago → Dallas",
                "Berlin → Warsaw",
                "Tokyo → Osaka",
                "New York → Atlanta",
                "Rotterdam → Paris",
              ][i % 5],
              detail: c.list[i][0],
              status: [
                "In Transit",
                "Out for Delivery",
                "Delivered",
                "Delayed",
                "Customs Hold",
              ][i % 5],
              value: "Aug 28, 14:00",
            }))
          : kind === "restaurant"
            ? [
                "#ORD-2849",
                "#ORD-2848",
                "#ORD-2847",
                "#ORD-2846",
                "#ORD-2845",
              ].map((name, i) => ({
                id: i,
                name,
                category: [
                  "Dine-in · Table 12",
                  "Takeout · Counter #1",
                  "Dine-in · Table 4",
                  "Delivery · UberEats",
                  "Dine-in · VIP Booth 2",
                ][i],
                detail: c.list[i][0],
                status: [
                  "Served & Paid",
                  "Ready for Pickup",
                  "Cooking (KDS)",
                  "Driver Pickup",
                  "Served & Paid",
                ][i],
                value: ["$88.50", "$42.00", "$36.75", "$62.30", "$96.00"][i],
              }))
            : [
                "AI Sales Copilot",
                "Smart CRM Assistant",
                "AI Analytics Pro",
                "AI Support Agent",
                "Workflow Automator",
                "AI Meeting Notes",
                "Predictive Insights",
              ].map((name, i) => ({
                id: i,
                name,
                category: (12430 - i * 1300).toLocaleString(),
                detail: "$" + (428.9 - i * 39.4).toFixed(1) + "K",
                status: "Active",
                value: "4." + (9 - (i % 3)),
              }));
  const columns: Column<(typeof tableRows)[number]>[] = [
    {
      key: "name",
      label:
        kind === "logistics"
          ? "Tracking ID"
          : kind === "school"
            ? "Student"
            : kind === "health"
              ? "Patient"
              : kind === "restaurant"
                ? "Order & Location"
                : "Product",
      render: (r) => (
        <div className="person-cell">
          {["school", "health"].includes(kind) && (
            <Avatar i={r.id + 1} size={32} />
          )}
          <strong>{r.name}</strong>
        </div>
      ),
    },
    {
      key: "category",
      label:
        kind === "school"
          ? "Grade"
          : kind === "health"
            ? "Department"
            : kind === "logistics"
              ? "Route / Terminal"
              : kind === "restaurant"
                ? "Location"
                : "Users",
    },
    {
      key: "detail",
      label:
        kind === "school"
          ? "Subject"
          : kind === "health"
            ? "Diagnosis"
            : kind === "logistics"
              ? "Assigned Driver"
              : kind === "restaurant"
                ? "Items Ordered"
                : "Revenue",
    },
    {
      key: "status",
      label: "Status",
      render: (r) => <Badge>{r.status}</Badge>,
    },
    {
      key: "value",
      label:
        kind === "health"
          ? "Age"
          : kind === "logistics"
            ? "Est. Delivery / ETA"
            : kind === "restaurant"
              ? "Amount"
              : "Rating",
    },
  ];
  return (
    <>
      <div className="dashboard-heading">
        <div>
          <h1>{c.title}</h1>
          <p>{c.description}</p>
        </div>
        <Select
          value={
            c.period === range
              ? range
              : range === "Last 30 Days"
                ? c.period
                : range
          }
          options={[c.period, "Last 7 Days", "Last 30 Days", "Last 90 Days"]}
          onChange={setRange}
        />
      </div>
      {kind === "restaurant" && (
        <div className="status-line">
          <Badge>Shift #2 Active</Badge>
          <Badge>KDS Kitchen Connected</Badge>
          <Badge>POS Sync Online</Badge>
        </div>
      )}
      <div className="dashboard-grid">
        <div className="span-12 metrics-strip">
          {c.metrics.map(([label, value, change, icon]) => (
            <KPI
              key={label}
              label={label}
              value={value}
              change={change}
              icon={icon}
            />
          ))}
        </div>
        <div className="span-8">
          <Card
            title={c.chart}
            icon="Activity"
            action={<span className="positive">↗ +18.0%</span>}
          >
            <div className="card-body">
              <div className="chart-head">
                <div>
                  <p className="muted">
                    {kind === "saas-ai" ? "Total Platform Revenue" : c.chart}
                  </p>
                  <strong className="large-number">{c.chartValue}</strong>
                </div>
                <Tabs
                  items={
                    kind === "school"
                      ? ["Week", "Month", "Term"]
                      : ["7D", "30D", "90D", "1Y"]
                  }
                  value={range}
                  onChange={setRange}
                />
              </div>
              <Legend
                labels={
                  kind === "school"
                    ? ["Present", "Absent"]
                    : kind === "logistics"
                      ? ["Freight Volume", "SLA Met Rate"]
                      : ["Revenue", "Previous Period"]
                }
              />
              <SalesChart
                range={range}
                type={kind === "school" ? "bar" : "area"}
              />
            </div>
          </Card>
        </div>
        <div className="span-4">
          <Card title={c.ringTitle} icon="ChartPie">
            <TickRing
              title={
                kind === "saas-ai"
                  ? "TOTAL ARR"
                  : kind === "school"
                    ? "STUDENTS"
                    : kind === "logistics"
                      ? "SHIPMENTS"
                      : "TOTAL"
              }
              value={c.ringValue}
              items={(kind === "saas-ai"
                ? [
                    ["AI Subscriptions", "$2.4M", "+8.2%"],
                    ["Enterprise SaaS", "$3.1M", "+12.4%"],
                    ["API Usage", "$1.8M", "+6.7%"],
                  ]
                : kind === "school"
                  ? [
                      ["Grade A", "485", "22%"],
                      ["Grade B", "820", "37%"],
                      ["Grade C", "640", "29%"],
                    ]
                  : kind === "health"
                    ? [
                        ["Cardiology", "320", "+5.2%"],
                        ["Neurology", "240", "+3.8%"],
                        ["Orthopedics", "195", "-1.4%"],
                      ]
                    : kind === "restaurant"
                      ? [
                          ["Dine-in Tables", "108 orders", "61%"],
                          ["Counter Takeout", "48 orders", "27%"],
                          ["Delivery Apps", "20 orders", "12%"],
                        ]
                      : [
                          ["In Transit", "1,240", "36%"],
                          ["Out for Delivery", "890", "26%"],
                          ["Delivered", "980", "29%"],
                        ]
              ).map(([name, value, growth]) => ({ name, value, growth }))}
            />
          </Card>
        </div>
        {kind === "school" &&
          [
            ["Fees Paid", "$2,97,000", "+14.2%"],
            ["Fees Pending", "$41,400", "-8.5%"],
            ["Staff Salary", "$5,77,500", "+6.1%"],
          ].map(([name, value, change], i) => (
            <div className="span-4 kpi-span" key={name}>
              <Card title={name}>
                <div className="card-body">
                  <strong className="large-number">{value}</strong>
                  <p className="muted">
                    Total{" "}
                    {i === 0
                      ? "collected"
                      : i === 1
                        ? "outstanding"
                        : "disbursed"}{" "}
                    this term <span className="positive">{change}</span>
                  </p>
                  <MiniChart kind={i === 0 ? "line" : "bar"} height={120} />
                </div>
              </Card>
            </div>
          ))}
        <div className="span-4">
          <Card
            title={c.listTitle}
            icon={kind === "saas-ai" ? "Sparkles" : "UsersRound"}
          >
            {kind === "saas-ai" ? (
              <AskAI />
            ) : (
              <div className="detail-list">
                {c.list.map(([name, detail, status], i) => (
                  <div className="detail-list-row" key={name}>
                    {kind === "restaurant" ? (
                      <img
                        className="dish-thumb"
                        src={`/images/dishes/${status}.webp`}
                        alt={name}
                      />
                    ) : kind === "school" ? (
                      <span className="kpi-icon">
                        <Icon name={status} />
                      </span>
                    ) : (
                      <Avatar i={i + 1} />
                    )}
                    <div>
                      <strong>{name}</strong>
                      <p>{detail}</p>
                    </div>
                    {!["restaurant", "school"].includes(kind) && (
                      <Badge>{status}</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
        <div className="span-8">
          <Card title={c.tableTitle} icon="Table2">
            <DataTable
              rows={tableRows}
              columns={columns}
              pagination={false}
              onEdit={(r) =>
                toast(
                  `${r.name}: ${r.status}. This is a local demonstration record.`,
                )
              }
            />
          </Card>
        </div>
        {kind === "logistics" && (
          <>
            <div className="span-6">
              <Card title="Warehouse Storage Capacity" icon="Warehouse">
                <div className="card-body">
                  <strong className="large-number">79.4% Avg</strong>
                  <p className="muted">Global hub storage utilization index</p>
                  {["NA Hub", "EU Hub", "APAC", "LATAM", "MEA", "AFR"].map(
                    (n, i) => (
                      <div className="storage-row" key={n}>
                        <span>{n}</span>
                        <div className="progress">
                          <span
                            style={{ width: [88, 65, 94, 55, 78, 62][i] + "%" }}
                          />
                        </div>
                        <strong>{[88, 65, 94, 55, 78, 62][i]}%</strong>
                      </div>
                    ),
                  )}
                </div>
              </Card>
            </div>
            <div className="span-6">
              <Card title="Vehicle Telemetry Overview" icon="Truck">
                <div className="card-body">
                  <strong className="large-number">184 Vehicles</strong>
                  {[
                    "Heavy Semi-Trucks",
                    "Local Box Trucks",
                    "Refrigerated Vans",
                    "Electric Delivery Vans",
                  ].map((n, i) => (
                    <div className="summary-row" key={n}>
                      <span>{n}</span>
                      <strong>{[82, 48, 34, 20][i]} vehicles</strong>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}
        {kind === "health" && (
          <div className="span-12">
            <Card title="Upcoming Appointments" icon="CalendarDays">
              <div className="appointment-grid">
                {[
                  "Marcus Lee",
                  "Nina Patel",
                  "Oscar Davis",
                  "Laura Hughes",
                  "Chris Evans",
                  "Amy Turner",
                ].map((name, i) => (
                  <div key={name}>
                    <strong>{name}</strong>
                    <p className="muted">{c.list[i % 5][0]}</p>
                    <Badge>
                      {
                        [
                          "09:00 AM",
                          "10:30 AM",
                          "11:15 AM",
                          "01:00 PM",
                          "02:30 PM",
                          "04:00 PM",
                        ][i]
                      }
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
function AskAI() {
  const [provider, setProvider] = useState("Claude");
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  return (
    <div className="ask-ai card-body">
      <div className="ask-greeting">
        Hi, David 👋<h2>How can I help you?</h2>
      </div>
      <Tabs
        items={["Claude", "ChatGPT", "Gemini"]}
        value={provider}
        onChange={setProvider}
      />
      <div className="ask-options">
        {[
          "Text Assistance",
          "Process Automation",
          "Schedule Optimize",
          "Smart Response",
        ].map((s, i) => (
          <button key={s} onClick={() => setPrompt(s)}>
            <Icon
              name={["ListChecks", "Settings", "Clock", "MessageCircle"][i]}
            />
            {s}
          </button>
        ))}
      </div>
      {reply && (
        <p className="demo-response" role="status">
          {reply}
        </p>
      )}
      <form
        className="chat-composer"
        onSubmit={(e) => {
          e.preventDefault();
          if (!prompt.trim()) return;
          setReply(
            "Local demo: open the AI Chat application to explore your prompt. No request was sent to " +
              provider +
              ".",
          );
          setPrompt("");
        }}
      >
        <input
          aria-label="Ask AI"
          placeholder="Ask anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button aria-label="Send prompt">
          <Icon name="ArrowUp" />
        </button>
      </form>
    </div>
  );
}
function ModernDashboard() {
  const [range, setRange] = useState("Last 30 Days");
  const { toast } = useWorkspace();
  return (
    <>
      <div className="dashboard-heading">
        <div>
          <h1>
            {greeting()}, Cameron <Icon name="Moon" />
          </h1>
          <p>Stay informed with today’s analytics</p>
        </div>
        <div className="button-group">
          <Button onClick={() => toast("Dashboard data refreshed.")}>
            <Icon name="RefreshCw" />
          </Button>
          <Select
            value="Monthly"
            options={["Monthly", "Weekly", "Yearly"]}
            onChange={(r) => toast(r + " view selected")}
          />
          <Button
            variant="primary"
            onClick={() =>
              downloadText(
                "ruthless-projects.csv",
                "Project,Status\nModernize,Processing\nSpike Admin,Delayed",
                "text/csv",
              )
            }
          >
            <Icon name="Download" size={16} />
            Export
          </Button>
        </div>
      </div>
      <Card className="update-banner">
        <div>
          <strong>
            <span className="orange-dot" />
            Update <span className="muted">· Nov 25th, 2024</span>
          </strong>
          <p>
            Sales revenue increased <span className="positive">40%</span> in 1
            week
          </p>
        </div>
        <Link className="btn btn-secondary" to="/react-tables/order-datatable">
          See Statistics <Icon name="ArrowRight" size={16} />
        </Link>
      </Card>
      <div className="dashboard-grid">
        <div className="span-7">
          <Card title="Sales Overview" icon="TrendingUp">
            <div className="card-body">
              <div className="chart-head">
                <div>
                  <p>Total Sales</p>
                  <strong className="large-number">$12,450.00</strong>{" "}
                  <span className="positive">+22%</span>{" "}
                  <span className="muted">vs last month</span>
                </div>
                <Select
                  value={range}
                  options={["Last 7 Days", "Last 30 Days", "Last 90 Days"]}
                  onChange={setRange}
                />
              </div>
              <SalesChart type="line" range={range} />
            </div>
          </Card>
        </div>
        <div className="span-5">
          <Card title="Total Assets" icon="Package">
            <div className="asset-grid">
              {[
                ["96", "Employees", "UsersRound"],
                ["356", "Projects", "File"],
                ["3,650", "Clients", "BriefcaseBusiness"],
                ["86", "Events", "Bookmark"],
              ].map(([n, label, icon]) => (
                <div key={label}>
                  <span className="kpi-icon">
                    <Icon name={icon} />
                  </span>
                  <strong>{n}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        {[
          ["Weekly sales", "714k", "40%"],
          ["New users", "1.35m", "20%"],
          ["Purchase Orders", "1.72m", "40%"],
        ].map(([label, value, change]) => (
          <div className="span-4 kpi-span" key={label}>
            <KPI label={label} value={value} change={change} button />
          </div>
        ))}
        <div className="span-12">
          <Card title="Projects & Orders" icon="Table">
            <DataTable
              rows={[
                "Modernize",
                "Spike Admin",
                "Material Pro",
                "Xtreme Admin",
                "Nova Suite",
                "Pulse CRM",
                "Vertex UI",
              ].map((name, i) => ({
                id: i,
                name,
                person: [
                  "Emily Carter",
                  "Jason Miller",
                  "Ryan Scott",
                  "Olivia Williams",
                  "Lisa Park",
                  "David Kim",
                  "Anna Martinez",
                ][i],
                status: [
                  "Processing",
                  "Delayed",
                  "Delivered",
                  "Delivered",
                  "Cancelled",
                  "Processing",
                  "Delivered",
                ][i],
                price: [2499, 1348, 1198, 799, 599, 5498, 1199][i],
                date: "Jun 14, 2026",
              }))}
              columns={[
                {
                  key: "name",
                  label: "Project",
                  render: (r) => (
                    <div>
                      <small className="muted">SD-2026-00{r.id + 1}</small>
                      <p>{r.name}</p>
                    </div>
                  ),
                },
                {
                  key: "person",
                  label: "Item",
                  render: (r) => (
                    <div className="person-cell">
                      <Avatar i={r.id + 1} />
                      <div>
                        {r.person}
                        <small>Web Developer</small>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "status",
                  label: "Status",
                  render: (r) => <Badge>{r.status}</Badge>,
                },
                { key: "price", label: "Price", render: (r) => money(r.price) },
                { key: "date", label: "Deadline" },
              ]}
              onEdit={(r) => toast("Selected project: " + r.name)}
              pagination={false}
            />
          </Card>
        </div>
      </div>
    </>
  );
}
function EcommerceDashboard() {
  const [range, setRange] = useState("Last 30 Days");
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % 3), 6000);
    return () => clearInterval(t);
  }, []);
  const { toast } = useWorkspace();
  return (
    <div className="dashboard-grid ecommerce-dashboard">
      <div className="span-5">
        <Card className="big-stat">
          <p>Total Sales</p>
          <h3>RUTHLESS Space</h3>
          <div>
            <strong className="large-number">$98,452.76</strong>
            <p>
              <span className="positive">+32.8%</span>{" "}
              <span className="muted">vs last month</span>
            </p>
          </div>
        </Card>
      </div>
      {[
        ["Monthly Sales", "$36,890", "+32.8%"],
        ["Revenue Growth", "+24%", "+32.8%"],
      ].map(([label, value, change], i) => (
        <div className={i ? "span-3" : "span-4"} key={label}>
          <Card title={label}>
            <div className="card-body mini-stat">
              <div>
                <strong className="large-number">{value}</strong>
                <p>
                  <span className="positive">{change}</span>{" "}
                  <span className="muted">vs last month</span>
                </p>
              </div>
              <MiniChart kind="matrix" />
            </div>
          </Card>
        </div>
      ))}
      <div className="span-3">
        <Card title="Customer Segmentation" icon="Layers">
          <TickRing
            title="Total"
            value="3,420"
            icon="UsersRound"
            items={[
              { name: "Startup", value: "2,310", growth: "+32.8%" },
              { name: "Enterprise", value: "800", growth: "+32.8%" },
              { name: "Individuals", value: "310", growth: "-1.7%" },
            ]}
          />
        </Card>
      </div>
      <div className="span-6">
        <Card
          title="Order Overview"
          icon="ShoppingCart"
          action={<span className="positive">17.0%</span>}
        >
          <div className="card-body">
            <div className="chart-head">
              <div>
                <p className="muted">
                  Total Sales <span className="inline-spacer" />
                  Orders
                </p>
                <strong className="large-number">
                  $22,560 <span className="inline-spacer" />
                  1,540
                </strong>
              </div>
              <Select
                value={range}
                options={["Last 7 Days", "Last 30 Days", "Last 90 Days"]}
                onChange={setRange}
              />
            </div>
            <SalesChart range={range} type="area" />
          </div>
        </Card>
      </div>
      <div className="span-3">
        <Card title="User Activity" icon="Activity">
          <div className="card-body">
            <MiniChart height={235} />
            <div className="week-labels">M　 T　 W　 T　 F　 S　 S</div>
            <div className="two-column">
              <div>
                <p className="muted">Viewed</p>
                <strong>678,900</strong>
              </div>
              <div>
                <p className="muted">Checkout</p>
                <strong>312,420</strong>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="span-12 four-kpis">
        {[
          ["Total Orders", "1920", "+32.8%", "Package"],
          ["Orders Shipped", "1785", "-2.5%", "Truck"],
          ["Revenue Generated", "$88,900", "+32.8%", "ChartNoAxesColumn"],
          ["Customer Satisfaction", "4.9 / 5.0", "+32.8%", "Star"],
        ].map(([label, value, change, icon]) => (
          <KPI
            key={label}
            label={label}
            value={value}
            change={change}
            icon={icon}
          />
        ))}
      </div>
      <div className="span-12">
        <Card
          title="Recent Sales Orders"
          icon="ShoppingBag"
          action={
            <Link to="/react-tables/order-datatable">View all orders</Link>
          }
        >
          <DataTable
            rows={[
              "LuxeSoft Memory Foam Pillow Set",
              "Solar Desk Lamp with Matte Finish",
              "Artisan Coffee Maker with Wood Finish",
              "Wireless Noise Canceling Earbuds",
              "Minimalist Glass Coffee Table",
            ].map((name, i) => ({
              id: i,
              name,
              image: [
                "luxesoft",
                "solardesk",
                "artisan",
                "wireless",
                "minimalist",
              ][i],
              customer: [
                "Emma Watson",
                "Michael Brown",
                "Olivia Johnson",
                "Daniel Lee",
                "Sophia Garcia",
              ][i],
              qty: [3, 2, 1, 2, 1][i],
              status: [
                "Pending",
                "Shipped",
                "Delivered",
                "Shipped",
                "Delivered",
              ][i],
              method: [
                "Credit Card",
                "UPI",
                "Cash on Delivery",
                "UPI",
                "Cash on Delivery",
              ][i],
              total: [180, 120, 250, 200, 450][i],
            }))}
            columns={[
              {
                key: "name",
                label: "Product",
                render: (r) => (
                  <div className="person-cell">
                    <img
                      className="small-product"
                      src={`/images/products/recent-sales/${r.image}.webp`}
                      alt=""
                    />
                    <strong>{r.name}</strong>
                  </div>
                ),
              },
              { key: "customer", label: "Customer" },
              { key: "qty", label: "Qty", render: (r) => r.qty + " Pcs" },
              {
                key: "status",
                label: "Status",
                render: (r) => <Badge>{r.status}</Badge>,
              },
              { key: "method", label: "Payment Method" },
              {
                key: "total",
                label: "Total Price",
                render: (r) => money(r.total),
              },
            ]}
            reportedTotal={4}
          />
        </Card>
      </div>
      <div className="span-4">
        <Card title="Latest Products" icon="ShoppingBag">
          <div className="detail-list">
            {[
              "Wireless Charging Pad",
              "Ergonomic Office Chair",
              "Smart Home Camera",
              "Bluetooth Soundbar",
            ].map((name, i) => (
              <Link
                to="/apps/ecommerce/shop"
                className="detail-list-row"
                key={name}
              >
                <img
                  className="small-product"
                  src={`/images/products/latest/${["wirelessPad", "ergonomic", "smartHome", "bluetooth"][i]}.webp`}
                  alt=""
                />
                <div>
                  <strong>{name}</strong>
                  <p>8.49k users</p>
                </div>
                <strong>${[75, 350, 180, 200][i]}.00</strong>
              </Link>
            ))}
          </div>
        </Card>
      </div>
      <div className="span-5">
        <Card title="Total Assets" icon="Wallet">
          <div className="card-body">
            <strong className="large-number">$478,230.90</strong>
            <p>
              <span className="positive">+15.7%</span>{" "}
              <span className="muted">+$65,000 vs last month</span>
            </p>
            <h3 className="section-space">Distribution</h3>
            <div className="segmented-bars">
              {Array.from({ length: 52 }, (_, i) => (
                <span
                  key={i}
                  style={{
                    background: chartColors[i < 34 ? 0 : i < 47 ? 1 : 2],
                  }}
                />
              ))}
            </div>
            {[
              ["Product Sales", "$312,500.45 (65%)"],
              ["Service Revenue", "$125,000.25 (26%)"],
              ["Other Income", "$40,730.20 (9%)"],
            ].map(([name, value]) => (
              <div className="summary-row" key={name}>
                <span>{name}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="span-3">
        <div
          className="promo-slide"
          style={{
            backgroundImage: `url(/images/promos/laptop-desk${slide ? "-" + (slide + 1) : ""}.png)`,
          }}
        >
          <div className="slide-dots">
            {[0, 1, 2].map((n) => (
              <button
                key={n}
                aria-label={"Slide " + (n + 1)}
                aria-pressed={slide === n}
                onClick={() => setSlide(n)}
              />
            ))}
          </div>
          <div>
            <h3>A laptop on a desk with minimal desk</h3>
            <Button
              variant="primary"
              onClick={() =>
                toast("Explore subscription options on the Pricing page.")
              }
            >
              Get Premium
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
