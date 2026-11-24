import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { invoices as seed, money, type Invoice } from "../data";
import { downloadText, usePersisted, useWorkspace } from "../state";
import {
  Badge,
  Button,
  Card,
  Confirm,
  Field,
  Icon,
  IconButton,
  Modal,
  PageTitle,
  Tabs,
} from "../ui";
import { DataTable } from "../components/DataTable";
const total = (r: Invoice) =>
  r.items.reduce((n, i) => n + i.price * i.units, 0);
export function InvoicesPage() {
  const { pathname } = useLocation();
  const { key } = useParams();
  const [rows, setRows] = usePersisted("invoices", seed);
  const [tab, setTab] = useState("All Invoice");
  const [deleting, setDeleting] = useState<Invoice | null>(null);
  const nav = useNavigate();
  const { toast } = useWorkspace();
  const r = rows.find((r) => r.key === key) || rows[0];
  const editing = pathname.includes("/create") || pathname.includes("/edit/");
  const detail = pathname.includes("/detail/");
  if (editing)
    return (
      <InvoiceEditor
        key={pathname}
        invoice={pathname.includes("/edit/") ? r : undefined}
        onSave={(invoice) => {
          setRows(
            rows.some((r) => r.id === invoice.id)
              ? rows.map((r) => (r.id === invoice.id ? invoice : r))
              : [invoice, ...rows],
          );
          toast("Invoice saved locally");
          nav("/apps/invoice/detail/" + invoice.key);
        }}
        nextId={Math.max(100, ...rows.map((r) => r.id)) + 1}
      />
    );
  if (detail && r)
    return (
      <>
        <PageTitle title="Invoice Details" />
        <div className="invoice-toolbar">
          <Link
            to={"/apps/invoice/edit/" + r.key}
            className="btn btn-secondary"
          >
            Edit Invoice
          </Link>
          <Button onClick={() => window.print()}>View Invoice</Button>
          <Button
            onClick={() =>
              downloadText(
                "ruthless-invoice-" + r.id + ".txt",
                `RUTHLESS dashboard\nInvoice #${r.id}\nBill From: ${r.from}\nBill To: ${r.to}\n${r.items.map((i) => `${i.name} x ${i.units}: ${money(i.price * i.units)}`).join("\n")}\nTax: ${r.tax}%\nGrand Total: ${money(total(r) * (1 + r.tax / 100))}`,
              )
            }
          >
            Download Invoice
          </Button>
          <Button onClick={() => window.print()}>Print Invoice</Button>
          <Link className="btn btn-primary" to="/apps/email">
            Send Invoice
          </Link>
        </div>
        <InvoiceDocument invoice={r} />
      </>
    );
  return (
    <>
      <PageTitle title="Invoice List" />
      <div className="summary-metrics four">
        {[
          ["$2,050", "Overdue amount"],
          ["$4,600", "Drafted totals"],
          ["$2,050", "Unpaid totals"],
          ["7 days", "Average paid time"],
        ].map(([v, l]) => (
          <div key={l}>
            <strong>{v}</strong>
            <span>{l}</span>
          </div>
        ))}
      </div>
      <Card>
        <div className="table-titlebar">
          <Tabs
            items={["All Invoice", "Paid", "Overdue", "Pending", "Draft"]}
            value={tab}
            onChange={setTab}
          />
          <Link className="btn btn-primary" to="/apps/invoice/create">
            New Invoice
          </Link>
        </div>
        <DataTable
          rows={rows.filter((r) => tab === "All Invoice" || r.status === tab)}
          columns={[
            {
              key: "id",
              label: "Id",
              render: (r) => (
                <Link to={"/apps/invoice/detail/" + r.key}>{r.id}</Link>
              ),
            },
            { key: "from", label: "Bill From" },
            { key: "to", label: "Bill To" },
            {
              key: "total",
              label: "Total Cost",
              render: (r) => money(total(r)),
              sort: (r) => total(r),
            },
            {
              key: "status",
              label: "Status",
              render: (r) => <Badge>{r.status}</Badge>,
            },
            { key: "created", label: "Created" },
            { key: "due", label: "Due" },
          ]}
          searchable
          selectable
          onEdit={(r) => nav("/apps/invoice/edit/" + r.key)}
          onDelete={setDeleting}
        />
      </Card>
      <Confirm
        open={!!deleting}
        title="Delete invoice?"
        onClose={() => setDeleting(null)}
        onConfirm={() => setRows(rows.filter((r) => r.id !== deleting?.id))}
      />
    </>
  );
}
function InvoiceDocument({ invoice: r }: { invoice: Invoice }) {
  return (
    <Card className="invoice-document">
      <div className="invoice-top">
        <h2># {r.id}</h2>
        <Badge>{r.status}</Badge>
      </div>
      <div className="invoice-parties">
        {[
          [
            "Bill From",
            r.from,
            "first@xabz.com",
            "Ganesh glory,Godrej garden city,Ahmedabad.",
            "979796786",
            "Create date",
            r.created,
          ],
          [
            "Bill To",
            r.to,
            "toFirst@agth.com",
            "Godrej garden city,Ahmedabad.",
            "757575233",
            "Due date",
            r.due,
          ],
        ].map(([label, name, email, address, phone, dateLabel, date]) => (
          <div key={label}>
            <h3>{label}</h3>
            <p>
              <strong>{name}</strong>
            </p>
            <p>{email}</p>
            <p>{address}</p>
            <p>{phone}</p>
            <h4>{dateLabel}</h4>
            <p>{date}</p>
          </div>
        ))}
      </div>
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Unit Price</th>
            <th>Unit</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {r.items.map((i, n) => (
            <tr key={n}>
              <td>{i.name}</td>
              <td>{money(i.price)}</td>
              <td>{i.units}</td>
              <td>{money(i.price * i.units)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="invoice-totals">
        <div className="summary-row">
          <span>Sub Total:</span>
          <strong>{money(total(r))}</strong>
        </div>
        <div className="summary-row">
          <span>Tax:</span>
          <strong>{r.tax}%</strong>
        </div>
        <div className="summary-row">
          <span>Grand Total:</span>
          <strong>{money(total(r) * (1 + r.tax / 100))}</strong>
        </div>
      </div>
      <p className="invoice-note">
        Notes: Thank you for your business. If you have any questions regarding
        this invoice, feel free to contact us.
      </p>
    </Card>
  );
}
function InvoiceEditor({
  invoice,
  nextId,
  onSave,
}: {
  invoice?: Invoice;
  nextId: number;
  onSave: (r: Invoice) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [r, setR] = useState<Invoice>(
    invoice || {
      id: nextId,
      key: "invoice-" + nextId,
      from: "Acme Corp",
      to: "Globex Industries",
      status: "Pending",
      created: today,
      due: today,
      items: [{ name: "", price: 0, units: 1 }],
      tax: 0,
    },
  );
  const nav = useNavigate();
  const updateItem = (
    index: number,
    k: "name" | "price" | "units",
    v: string,
  ) =>
    setR({
      ...r,
      items: r.items.map((i, n) =>
        n === index ? { ...i, [k]: k === "name" ? v : Number(v) } : i,
      ),
    });
  return (
    <>
      <PageTitle title={invoice ? "Invoice Edit" : "Create A New Invoice"} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(r);
        }}
      >
        <Card className="invoice-document">
          <div className="invoice-top">
            <h2># {r.id}</h2>
            <select
              aria-label="Invoice status"
              value={r.status}
              onChange={(e) => setR({ ...r, status: e.target.value })}
            >
              {["Pending", "Paid", "Overdue", "Draft"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="invoice-parties">
            <div>
              <Field label="Bill From">
                <input
                  required
                  value={r.from}
                  onChange={(e) => setR({ ...r, from: e.target.value })}
                />
              </Field>
              <p>accounts@acmecorp.com</p>
              <p>123 Market Street, San Francisco, CA 94103</p>
              <p>4151234567</p>
              <Field label="Create date">
                <input
                  type="date"
                  required
                  value={r.created}
                  onChange={(e) => setR({ ...r, created: e.target.value })}
                />
              </Field>
            </div>
            <div>
              <Field label="Bill To">
                <input
                  required
                  value={r.to}
                  onChange={(e) => setR({ ...r, to: e.target.value })}
                />
              </Field>
              <p>finance@globex.com</p>
              <p>456 Innovation Ave, Austin, TX 73301</p>
              <p>7379876543</p>
              <Field label="Due date">
                <input
                  type="date"
                  required
                  min={r.created}
                  value={r.due}
                  onChange={(e) => setR({ ...r, due: e.target.value })}
                />
              </Field>
            </div>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Unit Price</th>
                  <th>Units</th>
                  <th>Total Cost</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {r.items.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        required
                        placeholder="Item Name"
                        value={item.name}
                        onChange={(e) => updateItem(i, "name", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        aria-label={"Unit Price " + (i + 1)}
                        value={item.price}
                        onChange={(e) => updateItem(i, "price", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        required
                        aria-label={"Units " + (i + 1)}
                        value={item.units}
                        onChange={(e) => updateItem(i, "units", e.target.value)}
                      />
                    </td>
                    <td>{money(item.price * item.units)}</td>
                    <td>
                      <IconButton
                        type="button"
                        name="Trash2"
                        label="Remove invoice item"
                        disabled={r.items.length === 1}
                        onClick={() =>
                          setR({
                            ...r,
                            items: r.items.filter((_, n) => n !== i),
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button
            type="button"
            onClick={() =>
              setR({
                ...r,
                items: [...r.items, { name: "", price: 0, units: 1 }],
              })
            }
          >
            <Icon name="Plus" size={15} />
            Add item
          </Button>
          <div className="invoice-totals">
            <div className="summary-row">
              <span>Sub Total:</span>
              <strong>{money(total(r))}</strong>
            </div>
            <Field label="Tax (%)">
              <input
                type="number"
                min="0"
                max="100"
                value={r.tax}
                onChange={(e) => setR({ ...r, tax: Number(e.target.value) })}
              />
            </Field>
            <div className="summary-row">
              <span>Grand Total:</span>
              <strong>{money(total(r) * (1 + r.tax / 100))}</strong>
            </div>
          </div>
          <div className="form-actions">
            <Button type="button" onClick={() => nav("/apps/invoice/list")}>
              Cancel
            </Button>
            <Button variant="primary">
              {invoice ? "Update" : "Create"} Invoice
            </Button>
          </div>
        </Card>
      </form>
    </>
  );
}
