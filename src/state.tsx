import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { products, type Product } from "./data";
export function usePersisted<T>(
  key: string,
  initial: T,
): [T, Dispatch<SetStateAction<T>>] {
  const storageKey = "ruthless." + key;
  const [value, change] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  const ref = useRef(value);
  ref.current = value;
  const set = useCallback<Dispatch<SetStateAction<T>>>(
    (next) => {
      const v =
        typeof next === "function" ? (next as (v: T) => T)(ref.current) : next;
      ref.current = v;
      change(v);
      try {
        localStorage.setItem(storageKey, JSON.stringify(v));
      } catch {
        window.dispatchEvent(
          new CustomEvent("ruthless-toast", {
            detail:
              "Storage is full. Your latest changes are available until this page is closed.",
          }),
        );
      }
    },
    [storageKey],
  );
  return [value, set];
}
export interface Theme {
  mode: "dark" | "light";
  style: string;
  direction: "ltr" | "rtl";
  layout: "vertical" | "horizontal";
  container: "boxed" | "full";
  primary: string;
  secondary: string;
}
export interface CartItem {
  product: Product;
  quantity: number;
}
interface Workspace {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  addCart: (p: Product, q?: number) => void;
  toast: (text: string) => void;
}
const Context = createContext<Workspace>(null!);
export const useWorkspace = () => useContext(Context);
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const params = new URLSearchParams(location.search);
  const [theme, setTheme] = usePersisted<Theme>("theme", {
    mode: params.get("mode") === "light" ? "light" : "dark",
    style: "vega",
    direction: "ltr",
    layout: "vertical",
    container: "boxed",
    primary: "",
    secondary: "",
  });
  const [cart, setCart] = usePersisted<CartItem[]>("cart", []);
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useCallback((text: string) => {
    setMessage(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 4000);
  }, []);
  useEffect(() => {
    const handler = (e: Event) => toast((e as CustomEvent<string>).detail);
    window.addEventListener("ruthless-toast", handler);
    return () => {
      window.removeEventListener("ruthless-toast", handler);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [toast]);
  useEffect(() => {
    const root = document.documentElement;
    root.className = theme.mode + " style-" + theme.style;
    root.dir = theme.direction;
    root.style.colorScheme = theme.mode;
    if (theme.primary) root.style.setProperty("--primary", theme.primary);
    else root.style.removeProperty("--primary");
    if (theme.secondary) root.style.setProperty("--secondary", theme.secondary);
    else root.style.removeProperty("--secondary");
    root.dataset.layout = theme.layout;
    root.dataset.container = theme.container;
  }, [theme]);
  const addCart = (product: Product, quantity = 1) => {
    setCart((old) => {
      const found = old.find((i) => i.product.id === product.id);
      return found
        ? old.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          )
        : [...old, { product, quantity }];
    });
    toast(`${product.name} added to cart`);
  };
  return (
    <Context.Provider
      value={{ theme, setTheme, cart, setCart, addCart, toast }}
    >
      {children}
      {message && (
        <div className="toast" role="status">
          <span className="toast-dot" />
          {message}
          <button
            aria-label="Dismiss notification"
            onClick={() => setMessage("")}
          >
            ×
          </button>
        </div>
      )}
    </Context.Provider>
  );
}
export const exampleCart = products.slice(0, 3);
export function downloadText(name: string, text: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
