export interface NavItem {
  label: string;
  path?: string;
  icon: string;
  children?: NavItem[];
}
const group = (
  label: string,
  icon: string,
  children: [string, string][],
): NavItem => ({
  label,
  icon,
  children: children.map(([label, path]) => ({ label, path, icon: "Circle" })),
});
export const navigation: { label: string; items: NavItem[] }[] = [
  {
    label: "Dashboard",
    items: [
      ["Analytics", "/", "ChartBar"],
      ["eCommerce", "/dashboards/ecommerce", "ShoppingCart"],
      ["Modern", "/dashboards/modern", "House"],
      ["SaaS + AI Dashboard", "/dashboards/saas-ai", "Sparkles"],
      ["School Management", "/dashboards/school", "GraduationCap"],
      ["Health Management", "/dashboards/health", "HeartPulse"],
      ["Restaurant", "/dashboards/restaurant", "UtensilsCrossed"],
      ["Logistics", "/dashboards/logistics", "Truck"],
    ].map(([label, path, icon]) => ({ label, path, icon })),
  },
  {
    label: "Apps",
    items: [
      group("AI", "Sparkles", [
        ["Chat", "/apps/chat-ai"],
        ["Image", "/apps/image-ai"],
      ]),
      ...[
        ["Calendar", "calendar", "Calendar"],
        ["Chats", "chats", "MessageCircle"],
        ["Email", "email", "Mail"],
        ["Notes", "notes", "NotebookText"],
        ["Contacts", "contacts", "Contact"],
      ].map(([label, path, icon]) => ({ label, path: "/apps/" + path, icon })),
      group("Invoice", "Receipt", [
        ["List", "/apps/invoice/list"],
        ["Details", "/apps/invoice/detail/PineappleInc"],
        ["Create", "/apps/invoice/create"],
        ["Edit", "/apps/invoice/edit/PineappleInc"],
      ]),
      group("User Profile", "UserRound", [
        ["Profile", "/apps/user-profile/profile"],
        ["Followers", "/apps/user-profile/followers"],
        ["Friends", "/apps/user-profile/friends"],
        ["Gallery", "/apps/user-profile/gallery"],
      ]),
      group("Blogs", "Newspaper", [
        ["Blog Listing", "/apps/blog/post"],
        [
          "Blog Detail",
          "/apps/blog/detail/streaming-video-way-before-it-was-cool-go-dark-tomorrow",
        ],
        ["Blog Edit", "/apps/blog/edit"],
        ["Blog Create", "/apps/blog/create"],
        ["Manage Blog", "/apps/blog/manage-blog"],
      ]),
      group("Ecommerce", "ShoppingBag", [
        ["Shop", "/apps/ecommerce/shop"],
        ["Details", "/apps/ecommerce/detail/3"],
        ["List", "/apps/ecommerce/list"],
        ["Checkout", "/apps/ecommerce/checkout"],
        ["Add Product", "/apps/ecommerce/addproduct"],
        ["Edit Product", "/apps/ecommerce/editproduct"],
      ]),
      ...[
        ["Kanban", "kanban", "PanelsTopLeft"],
        ["Tickets", "tickets", "Ticket"],
      ].map(([label, path, icon]) => ({ label, path: "/apps/" + path, icon })),
      {
        label: "Customers",
        path: "/react-tables/user-datatable",
        icon: "UsersRound",
      },
      {
        label: "Orders",
        path: "/react-tables/order-datatable",
        icon: "Package",
      },
    ],
  },
  {
    label: "UI Elements",
    items: [
      group(
        "Components",
        "Shapes",
        [
          "Button",
          "Avatar",
          "Badge",
          "Tooltip",
          "Input",
          "Textarea",
          "Switch",
          "Tab",
          "Select",
          "Checkbox",
          "Accordion",
          "Card",
          "Radio Group",
          "Datepicker",
        ].map((x) => [
          x,
          "/components/" + x.toLowerCase().replaceAll(" ", "-"),
        ]),
      ),
    ],
  },
  {
    label: "Form Elements",
    items: [
      group(
        "Forms Components",
        "TextCursorInput",
        ["Input", "Select", "Checkbox", "Radio Group", "Datepicker"].map(
          (x) => [x, "/components/" + x.toLowerCase().replaceAll(" ", "-")],
        ),
      ),
      group(
        "Form Layouts",
        "PanelsTopLeft",
        [
          "Forms Layouts",
          "Form Validation",
          "Form Examples",
          "Repeater Forms",
          "Form Wizard",
        ].map((x) => [x, "/forms/" + x.toLowerCase().replaceAll(" ", "-")]),
      ),
    ],
  },
  {
    label: "Widgets",
    items: [
      { label: "Cards", path: "/ui-blocks/card", icon: "PanelsTopLeft" },
      {
        label: "Charts",
        path: "/ui-blocks/chart",
        icon: "ChartNoAxesCombined",
      },
    ],
  },
  {
    label: "Tables",
    items: [
      group("Tables", "Table", [
        ["Basic Table", "/shadcn-tables/basic"],
        ["Striped Row Table", "/shadcn-tables/striped-row"],
        ["Hover Table", "/shadcn-tables/hover-table"],
        ["Checkbox Table", "/shadcn-tables/checkbox-table"],
      ]),
      group(
        "Tanstack / React Table",
        "Table2",
        [
          ["Basic", "basic"],
          ["Dense", "dense"],
          ["Sorting", "sorting"],
          ["Filtering", "filtering"],
          ["Pagination", "pagination"],
          ["Row Selection", "row-selection"],
          ["Column Visibility", "columnvisibility"],
          ["Editable", "editable"],
          ["Sticky", "sticky"],
          ["Drag & Drop", "drag-drop"],
          ["Empty", "empty"],
          ["Expanding", "expanding"],
        ].map(([a, b]) => [a, "/react-tables/" + b]),
      ),
    ],
  },
  {
    label: "Charts",
    items: [
      group(
        "Charts",
        "ChartNoAxesCombined",
        ["Area", "Bar", "Line", "Pie", "Radar", "Radialbar"].map((x) => [
          x + " Chart",
          "/components/" + x.toLowerCase() + "-chart",
        ]),
      ),
    ],
  },
  {
    label: "Pages",
    items: [
      ...[
        ["Account Setting", "account-settings", "Settings"],
        ["FAQ", "faq", "CircleHelp"],
        ["Pricing", "pricing", "CreditCard"],
        ["Roll Base Access", "casl", "ShieldCheck"],
        ["Integrations", "inetegration", "Workflow"],
        ["API Keys", "apikey", "KeyRound"],
      ].map(([label, path, icon]) => ({
        label,
        path: "/theme-pages/" + path,
        icon,
      })),
      group(
        "Empty Pages",
        "File",
        [1, 2, 3, 4].map((x) => [
          "Empty Page " + x,
          "/theme-pages/empty-page/empty-" + x,
        ]),
      ),
    ],
  },
  {
    label: "Icons",
    items: [{ label: "Iconify Icons", path: "/icons/iconify", icon: "Smile" }],
  },
  {
    label: "Auth",
    items: [
      { label: "Error", path: "/auth/error", icon: "CircleAlert" },
      ...["Login", "Register", "Forgot Password", "Two Steps"].map((label) =>
        group(label, "LockKeyhole", [
          [
            "Side " + label,
            "/auth/auth1/" + label.toLowerCase().replaceAll(" ", "-"),
          ],
          [
            "Boxed " + label,
            "/auth/auth2/" + label.toLowerCase().replaceAll(" ", "-"),
          ],
        ]),
      ),
      { label: "Maintenance", path: "/auth/maintenance", icon: "Wrench" },
      group("Menu Level", "Layers", [
        ["Level 1.1", "/theme-pages/empty-page/empty-1"],
      ]),
    ],
  },
];
export const allLinks: NavItem[] = navigation.flatMap((g) =>
  g.items.flatMap((i) => i.children || [i]),
);
export const searchLinks: NavItem[] = navigation.flatMap((g) =>
  g.items.flatMap((i) =>
    i.children
      ? i.children.map((child) => ({
          ...child,
          label: i.label + " " + child.label,
        }))
      : [i],
  ),
);
export const profileImage = (i = 2) =>
  `/images/profile/user-${((i - 1) % 9) + 1}.png`;
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  image: string;
  stock: string;
  rating: number;
}
export const products: Product[] = [
  ["Cute Soft Teddybear", "toys", 285, 345, "teddybear"],
  ["MacBook Air Pro", "electronics", 650, 900, "advance-macbook"],
  ["Gaming Console", "electronics", 25, 31, "new-games"],
  ["Beauty Product", "fashion", 125, 137, "beauty-product"],
  ["Boat Headphone", "electronics", 50, 65, "boat-headphone"],
  ["Toy Dino for Fun", "toys", 210, 250, "toy-dino"],
  ["Woman Dress", "fashion", 150, 200, "woman-dress"],
  ["Shoes for Girls", "fashion", 300, 380, "shoes"],
  ["Short & Sweet Purse", "fashion", 175, 200, "short-sweet-purse"],
  ["Super Games", "electronics", 275, 350, "new-games"],
  ["Little Angel Toy", "toys", 5, 10, "little-angel-toy"],
  ["Psalms Book", "books", 89, 99, "new-book"],
].map((p, i) => ({
  id: i,
  name: String(p[0]),
  category: String(p[1]),
  price: Number(p[2]),
  oldPrice: Number(p[3]),
  image: `/images/products/${p[4]}.png`,
  stock: i === 1 || i === 11 ? "Out of Stock" : "InStock",
  rating: 4 + (i % 3) / 2,
}));
export interface Person {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  age: number;
  company: string;
  address: string;
  notes: string;
}
export const people: Person[] = [
  "James Johnson",
  "Maria Hernandez",
  "Clara Mason",
  "Derek White",
  "Eva Carter",
  "Frank Zhou",
  "Grace Lee",
  "Henry Ford",
].map((name, i) => ({
  id: i + 1,
  name,
  role: [
    "Admin",
    "User",
    "Superadmin",
    "Moderator",
    "Author",
    "User",
    "Admin",
    "Superadmin",
  ][i],
  email: [
    "alice@company.com",
    "bobsmith@gmail.com",
    "clara@enterprise.com",
    "derek@forum.com",
    "eva@blogging.com",
    "fzhou@yahoo.com",
    "gracelee@company.com",
    "henry.ford@auto.com",
  ][i],
  phone: [
    "123-456-7890",
    "555-312-8899",
    "402-123-4567",
    "212-321-6789",
    "678-999-8212",
    "504-222-9990",
    "703-301-4444",
    "888-456-1234",
  ][i],
  age: [30, 45, 38, 29, 33, 41, 27, 52][i],
  company: "Muller Inc",
  address: "19214 110th Rd, Saint Albans, NY, 1141",
  notes: "Keep in touch about upcoming projects and team priorities.",
}));
export const contactNames = [
  "Georgeanna Ramero",
  "Cami Macha",
  "Alda Ziemer",
  "Luciano Macpherson",
  "Dalton Paden",
  "Juan Granado",
  "Revan Allen",
  "Juley Huseman",
  "Bridgette Phung",
  "Ernest Cousins",
  "Nicolette Trapani",
  "Virginia Bourdeau",
  "Janit Vogl",
  "Jeneva Bridgeforth",
  "Roselia Principe",
  "Elvir Hylton",
  "Maragaret Pecor",
  "Willena Sugrue",
  "Euran Solley",
  "Velva Brockett",
  "Anay Snapp",
  "Latoria Penaloza",
  "Tamik Inman",
  "Erich Aragon",
  "Johanna Randel",
  "Victorina Heinze",
  "Kimon Light",
  "Sanford Delorenzo",
  "Hansi Strebel",
  "Roger Trinidad",
];
export const contacts: Person[] = contactNames.map((name, i) => ({
  ...people[i % 8],
  id: i + 1,
  name,
  role: [
    "Sales",
    "Support",
    "Engineering",
    "Support",
    "Engineering",
    "Support",
  ][i % 6],
  email:
    i === 0
      ? "qq739v47ggn@claimab.com"
      : name.toLowerCase().replaceAll(" ", ".") + "@example.com",
  phone: i === 0 ? "456-485-5623" : people[i % 8].phone,
}));
export const followerNames = [
  "Frances Gray",
  "Augusta Riley",
  "Nelle Reed",
  "Ricardo Campbell",
  "Rachel Austin",
  "Troy Austin",
  "Pauline Vega",
  "Frederick Huff",
  "Henry Silva",
  "Dustin Collier",
  "Ella Graves",
  "Clayton Roy",
  "Grace Brooks",
  "Marvin Webster",
  "Della Ward",
  "Kyle Quinn",
  "Luis Morrison",
  "Clarence Graves",
  "Mamie Kim",
  "Jeff Jenkins",
  "Elizabeth Clarke",
];
export interface Post {
  id: number;
  title: string;
  category: string;
  image: string;
  author: string;
  content: string;
  published: boolean;
  date: string;
}
export const articleText =
  "But you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for. It allows you to start your bid at the bottom and slowly work your way to the top of the list.";
export const blogPosts: Post[] = [
  [
    "Early Black Friday Amazon deals: cheap TVs, headphones, laptops",
    "Gadget",
    9,
  ],
  [
    "Presented by Max Rushden with Barry Glendenning, Philippe Auclair",
    "Health",
    1,
  ],
  [
    "As yen tumbles, gadget-loving Japan goes for secondhand iPhones",
    "Gadget",
    6,
  ],
  [
    "Intel loses bid to revive antitrust case against patent foe Fortress",
    "Social",
    9,
  ],
  ["Streaming video way before it was cool, go dark tomorrow", "Lifestyle", 5],
  ["COVID outbreak deepens as more lockdowns loom in China", "Health", 8],
  [
    "Apple is apparently working on a new streamlined accessibility for iOS",
    "Design",
    3,
  ],
  ["After Twitter Staff Cuts, Survivors Face Radio Silence", "Lifestyle", 1],
  ["Why Figma is selling to Adobe for $20 billion", "Design", 4],
  ["Discover the Power of Garmin Instinct Crossover Solar", "Lifestyle", 12],
  ["Garmins Instinct Crossover is a rugged hybrid smartwatch", "Gadget", 2],
].map((p, i) => ({
  id: i,
  title: String(p[0]),
  category: String(p[1]),
  image: `/images/blog/blog-img${p[2]}.png`,
  author: followerNames[i],
  content: articleText,
  published: true,
  date: `2026-11-${String(10 + (i % 9)).padStart(2, "0")}`,
}));
export interface Invoice {
  id: number;
  key: string;
  from: string;
  to: string;
  status: string;
  created: string;
  due: string;
  items: { name: string; price: number; units: number }[];
  tax: number;
}
export const invoices: Invoice[] = [
  "PineappleInc.",
  "Pineapple.",
  "Incorporation.",
  "PineappleTimes.",
  "FortuneCreation",
  "Acme Corp",
  "Globex",
].map((from, i) => ({
  id: 101 + i,
  key: i === 0 ? "PineappleInc" : from.replaceAll(".", ""),
  from,
  to: ["Redq Inc.", "ME Inc.", "Redirwed.", "RFc.", "Soft solution."][i % 5],
  status: ["Paid", "Overdue", "Pending", "Paid", "Overdue", "Draft", "Overdue"][
    i
  ],
  created: `2025-04-0${i + 1}`,
  due: `2025-04-${String(i + 5).padStart(2, "0")}`,
  items: [{ name: "Courge", price: 10, units: 9 }],
  tax: 9,
}));
export interface Order {
  id: number;
  order: string;
  customer: string;
  status: string;
  date: string;
  amount: number;
  address: string;
}
export const orders: Order[] = [
  "John Doe",
  "Jane Smith",
  "Bob Johnson",
  "Georgeanna Ramero",
  "Dalton Paden",
  "Cami Macha",
].map((customer, i) => ({
  id: i + 1,
  order: "ORD-00" + (i + 1),
  customer,
  status: [
    "Pending",
    "Completed",
    "Shipped",
    "Cancelled",
    "Processing",
    "Pending",
  ][i],
  date: `2025-06-${10 - i}`,
  amount: [80.5, 814, 407.3, 1127.1, 311, 213][i],
  address: [
    "123 Main St, New York, NY",
    "456 Elm St, Los Angeles, CA",
    "789 Pine St, Chicago, IL",
  ][i % 3],
}));
export const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);
export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const initialSales = [
  ["Jan 1", 7500, 4700, 4700],
  ["Jan 4", 7500, 4300, 4300],
  ["Jan 6", 9200, 5500, 5500],
  ["Jan 8", 8300, 5000, 5000],
  ["Jan 12", 10200, 6300, 6300],
  ["Jan 16", 7100, 4300, 4300],
  ["Jan 20", 8700, 5400, 5400],
  ["Jan 24", 11000, 6800, 6800],
  ["Jan 28", 10300, 6200, 6200],
  ["Feb 1", 9000, 5500, 5500],
  ["Feb 5", 10200, 6700, 5500],
  ["Feb 8", 12000, 8000, 6300],
].map(([date, teamA, teamB, teamC]) => ({
  date: String(date),
  teamA: Number(teamA),
  teamB: Number(teamB),
  teamC: Number(teamC),
}));
