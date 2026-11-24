import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type ButtonHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { profileImage } from "./data";
export function Icon({
  name = "Circle",
  size = 18,
  className = "",
}: {
  name?: string;
  size?: number;
  className?: string;
}) {
  if (name === "Handbag") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <path d="M2.048 18.566A2 2 0 0 0 4 21h16a2 2 0 0 0 1.952-2.434l-2-9A2 2 0 0 0 18 8H6a2 2 0 0 0-1.952 1.566z" />
        <path d="M8 11V6a4 4 0 0 1 8 0v5" />
      </svg>
    );
  }
  const C =
    (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ||
    Icons.Circle;
  return (
    <C
      size={size}
      strokeWidth={2}
      className={className}
      aria-hidden="true"
    />
  );
}
export function Button({
  children,
  className = "",
  variant = "secondary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  return (
    <button {...props} className={`btn btn-${variant} ${className}`}>
      {children}
    </button>
  );
}
export function IconButton({
  name,
  label,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { name: string; label: string }) {
  return (
    <button
      {...props}
      aria-label={label}
      title={label}
      className={`icon-button ${props.className || ""}`}
    >
      <Icon name={name} />
    </button>
  );
}
export function Avatar({
  i = 2,
  name = "Cameron",
  size = 36,
}: {
  i?: number;
  name?: string;
  size?: number;
}) {
  return (
    <img
      className="avatar"
      src={profileImage(i)}
      alt={name}
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  );
}
export function Card({
  title,
  icon,
  action,
  children,
  className = "",
}: {
  title?: ReactNode;
  icon?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card ${className}`}>
      {title && (
        <div className="card-header">
          <h2>
            {icon && <Icon name={icon} size={16} />} {title}
          </h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
export function Badge({
  children,
  tone,
}: {
  children: ReactNode;
  tone?: string;
}) {
  const s = String(tone || children).toLowerCase();
  const color = /stopped|cancel|inactive|disabled|overdue|high priority/.test(s)
    ? "red"
    : /pending|running|low demand|delay|medium/.test(s)
      ? "orange"
      : /draft|standby|leave|normal/.test(s)
        ? "neutral"
        : "green";
  return <span className={`badge badge-${color}`}>{children}</span>;
}
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function Search({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: {
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`search-input ${className}`}>
      <Icon name="Search" size={17} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button aria-label="Clear search" onClick={() => onChange("")}>
          <Icon name="X" size={14} />
        </button>
      )}
    </div>
  );
}
export function Tabs({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <div className="tabs" role="tablist">
      {items.map((x) => (
        <button
          key={x}
          role="tab"
          aria-selected={value === x}
          className={value === x ? "active" : ""}
          onClick={() => onChange(x)}
        >
          {x}
        </button>
      ))}
    </div>
  );
}
function useOutside(
  ref: React.RefObject<HTMLElement | null>,
  close: () => void,
  open: boolean,
) {
  useEffect(() => {
    if (!open) return;
    const click = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("pointerdown", click);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", click);
      document.removeEventListener("keydown", key);
    };
  }, [open, close, ref]);
}
export function Select({
  value,
  options,
  onChange,
  label,
  className = "",
}: {
  value: string;
  options: string[];
  onChange: (s: string) => void;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  useOutside(ref, () => setOpen(false), open);
  return (
    <div ref={ref} className={`select-wrap ${className}`}>
      <button
        className="select-trigger"
        role="combobox"
        aria-label={label}
        aria-controls={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setTimeout(
              () =>
                ref.current
                  ?.querySelector<HTMLElement>("[role=option]")
                  ?.focus(),
              0,
            );
          }
        }}
      >
        {value}
        <Icon name="ChevronDown" size={14} />
      </button>
      {open && (
        <div
          id={id}
          className="popover select-options"
          role="listbox"
          aria-label={label || "Options"}
        >
          {options.map((x, i) => (
            <button
              key={x}
              role="option"
              aria-selected={x === value}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  const buttons =
                    ref.current?.querySelectorAll<HTMLElement>("[role=option]");
                  buttons?.[
                    (i + (e.key === "ArrowDown" ? 1 : options.length - 1)) %
                      options.length
                  ].focus();
                }
              }}
              onClick={() => {
                onChange(x);
                setOpen(false);
                ref.current?.querySelector("button")?.focus();
              }}
            >
              {x}
              {x === value && <Icon name="Check" size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export function Menu({
  items,
  label = "More options",
  trigger,
}: {
  items: { label: string; onClick: () => void; danger?: boolean }[];
  label?: string;
  trigger?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutside(ref, () => setOpen(false), open);
  return (
    <div className="menu-wrap" ref={ref}>
      <button
        className={trigger ? "menu-trigger" : "icon-button"}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {trigger || <Icon name="Ellipsis" />}
      </button>
      {open && (
        <div className="popover menu-options" role="menu">
          {items.map((x, i) => (
            <button
              role="menuitem"
              key={`${x.label}-${i}`}
              className={x.danger ? "danger" : ""}
              style={{ animationDelay: `${40 + i * 35}ms` }}
              onClick={() => {
                x.onClick();
                setOpen(false);
              }}
            >
              {x.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
  description,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
  description?: string;
}) {
  return (
    <Overlay
      open={open}
      onClose={onClose}
      title={title}
      className={wide ? "modal modal-wide" : "modal"}
      description={description}
    >
      {children}
    </Overlay>
  );
}
export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: "left" | "right";
  className?: string;
}) {
  return (
    <Overlay
      open={open}
      onClose={onClose}
      title={title}
      className={`drawer drawer-${side} ${className}`}
    >
      {children}
    </Overlay>
  );
}
function Overlay({
  open,
  onClose,
  title,
  children,
  className,
  description,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className: string;
  description?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeRef.current();
      }
      if (e.key === "Tab") {
        const els = ref.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled),input:not(:disabled),select,textarea,a[href],[tabindex="0"]',
        );
        if (!els?.length) return;
        const first = els[0],
          last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", handle);
      previous?.focus();
    };
  }, [open]);
  if (!open) return null;
  return createPortal(
    <div
      className="overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        tabIndex={-1}
        className={className}
      >
        <div className="overlay-header">
          <div>
            <h2 id={id}>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <IconButton name="X" label="Close" onClick={onClose} />
        </div>
        <div className="overlay-content">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
export function PageTitle({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-title card">
      <div>
        <h1>{title}</h1>
        <div className="breadcrumbs">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{title}</span>
        </div>
      </div>
      {children}
    </div>
  );
}
export function Empty({
  title = "No results found",
  text = "Try another search or clear your filters.",
  action,
}: {
  title?: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <Icon name="Inbox" size={38} />
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}
export function Stars({ value = 4.5 }: { value?: number }) {
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icons.Star
          key={n}
          size={16}
          fill="currentColor"
          strokeWidth={0}
          style={{ opacity: n > value ? 0.4 : 1 }}
        />
      ))}
    </span>
  );
}
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`switch ${checked ? "checked" : ""}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}
export function Confirm({
  open,
  title,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p>This record will be removed from your local demo workspace.</p>
      <div className="form-actions">
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="danger"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}
