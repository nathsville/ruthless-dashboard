import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { money, products as seed, type Product } from "../data";
import { downloadText, usePersisted, useWorkspace } from "../state";
import {
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
  Select,
  Stars,
  Tabs,
} from "../ui";
import { DataTable } from "../components/DataTable";
export function ProductCard({ product }: { product: Product }) {
  const { addCart } = useWorkspace();
  return (
    <Card className="product-card">
      <Link
        to={"/apps/ecommerce/detail/" + product.id}
        className="product-image"
      >
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <div className="product-card-info">
        <Link to={"/apps/ecommerce/detail/" + product.id}>
          <strong>{product.name}</strong>
        </Link>
        <div>
          <span>{money(product.price)}</span>
          <del>{money(product.oldPrice)}</del>
        </div>
        <div>
          <Stars value={product.rating} />
          <IconButton
            name="ShoppingCart"
            label={"Add " + product.name + " to cart"}
            onClick={() => addCart(product)}
          />
        </div>
      </div>
    </Card>
  );
}
export function CommercePage() {
  const path = useLocation().pathname;
  if (path.includes("/detail/")) return <ProductDetail />;
  if (path.endsWith("/checkout")) return <Checkout />;
  if (path.endsWith("/addproduct") || path.endsWith("/editproduct"))
    return <ProductEditor edit={path.endsWith("/editproduct")} />;
  if (path.endsWith("/list")) return <ProductList />;
  return <Shop />;
}
function Shop() {
  const [products] = usePersisted("products", seed);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [gender, setGender] = useState("All");
  const [price, setPrice] = useState("All");
  const [query, setQuery] = useState("");
  const [color, setColor] = useState("");
  const ranges = price === "All" ? [0, Infinity] : price.split("-").map(Number);
  const filtered = products
    .filter(
      (p) =>
        (category === "All" || p.category === category.toLowerCase()) &&
        p.name.toLowerCase().includes(query.toLowerCase()) &&
        p.price >= ranges[0] &&
        p.price <= ranges[1] &&
        (gender === "All" ||
          (gender === "Women" && p.category === "fashion") ||
          (gender === "Kids" && p.category === "toys") ||
          (gender === "Men" && p.category !== "toys")),
    )
    .sort((a, b) =>
      sort === "Price: High-Low"
        ? b.price - a.price
        : sort === "Price: Low-High"
          ? a.price - b.price
          : sort === "Discounted"
            ? b.oldPrice - b.price - (a.oldPrice - a.price)
            : a.id - b.id,
    );
  return (
    <>
      <PageTitle title="Shop App" />
      <div className="shop-layout">
        <aside className="card shop-filters">
          {[
            [
              "Filter By Category",
              ["All", "Fashion", "Books", "Toys", "Electronics"],
              category,
              setCategory,
            ],
            [
              "Sort By",
              ["Newest", "Price: High-Low", "Price: Low-High", "Discounted"],
              sort,
              setSort,
            ],
            ["By Gender", ["All", "Men", "Women", "Kids"], gender, setGender],
            [
              "By Pricing",
              ["All", "0-50", "50-100", "100-200", "200-99999"],
              price,
              setPrice,
            ],
          ].map(([label, options, value, onChange]) => (
            <div className="filter-section" key={String(label)}>
              <h3>{String(label)}</h3>
              {(options as string[]).map((s) => (
                <label className="radio-row" key={s}>
                  <input
                    type="radio"
                    name={String(label)}
                    checked={value === s}
                    onChange={() => (onChange as (s: string) => void)(s)}
                  />
                  {s}
                </label>
              ))}
            </div>
          ))}
          <div className="filter-section">
            <h3>By Colors</h3>
            <div className="color-dots">
              {[
                "#ffffff",
                "#1890ff",
                "#94d82d",
                "#ff4842",
                "#ffc107",
                "#00ab55",
                "#000000",
              ].map((c) => (
                <button
                  key={c}
                  aria-label={"Select color " + c}
                  aria-pressed={color === c}
                  style={{
                    background: c,
                    outline: color === c ? "2px solid var(--primary)" : "",
                  }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
          <Button
            className="full"
            onClick={() => {
              setCategory("All");
              setSort("Newest");
              setPrice("All");
              setGender("All");
              setColor("");
              setQuery("");
            }}
          >
            Reset Filter
          </Button>
        </aside>
        <div>
          <div className="detail-heading">
            <h2>Products</h2>
            <Search
              value={query}
              onChange={setQuery}
              placeholder="Search Product..."
            />
          </div>
          {filtered.length ? (
            <div className="product-grid">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </div>
    </>
  );
}
function ProductDetail() {
  const { id } = useParams();
  const [products] = usePersisted("products", seed);
  const p = products.find((p) => p.id === Number(id)) || products[3];
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(0);
  const [tab, setTab] = useState("Description");
  const { addCart } = useWorkspace();
  const nav = useNavigate();
  return (
    <>
      <PageTitle title="Shop Detail" />
      <Card className="product-detail">
        <div className="product-detail-image">
          <img src={p.image} alt={p.name} />
          <div className="product-thumbnails">
            {products.slice(0, 4).map((item) => (
              <Link key={item.id} to={"/apps/ecommerce/detail/" + item.id}>
                <img src={item.image} alt={item.name} />
              </Link>
            ))}
          </div>
        </div>
        <div className="product-detail-copy">
          <div className="button-group">
            <Badge>{p.stock === "InStock" ? "In Stock" : p.stock}</Badge>
            <span className="muted">{p.category}</span>
          </div>
          <h1>{p.name}</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ex
            arcu, tincidunt bibendum felis.
          </p>
          <div className="large-number">
            <del>{money(p.oldPrice)}</del> {money(p.price)}
          </div>
          <div className="button-group">
            <Stars value={p.rating} />
            <span className="muted">(236 reviews)</span>
          </div>
          <div className="variant-row">
            <strong>Colors:</strong>
            <div className="color-dots">
              {["#202020", "#947b5b", "#d8c6a1"].map((c, i) => (
                <button
                  key={c}
                  style={{ background: c }}
                  className={color === i ? "selected" : ""}
                  aria-label={"Color " + (i + 1)}
                  aria-pressed={color === i}
                  onClick={() => setColor(i)}
                />
              ))}
            </div>
          </div>
          <div className="variant-row">
            <strong>QTY:</strong>
            <div className="quantity">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
          <div className="button-group">
            <Button
              variant="primary"
              onClick={() => {
                addCart(p, quantity);
                nav("/apps/ecommerce/checkout");
              }}
            >
              Buy now
            </Button>
            <Button onClick={() => addCart(p, quantity)}>Add to Cart</Button>
          </div>
          <p className="small muted">Dispatched in 2–3 weeks</p>
          <Link to="/theme-pages/faq">Why the longer time for delivery?</Link>
        </div>
      </Card>
      <Card className="section-space">
        <Tabs
          items={["Description", "Reviews"]}
          value={tab}
          onChange={setTab}
        />
        <div className="card-body prose">
          {tab === "Description" ? (
            <>
              <h3>
                Sed at diam elit. Vivamus tortor odio, pellentesque eu tincidunt
                a, aliquet sit amet lorem.
              </h3>
              <p>
                Cras eget elit semper, congue sapien id, pellentesque diam.
                Nulla faucibus diam nec fermentum ullamcorper. Praesent sed
                ipsum ut augue vestibulum malesuada. Duis vitae volutpat odio.
                Integer sit amet elit ac justo sagittis dignissim.
              </p>
              <p>
                Thoughtfully selected materials and reliable everyday
                performance. Check the product details and availability before
                completing your demo order.
              </p>
            </>
          ) : (
            ["Arlene McCoy", "Jerome Bell", "Jacob Jones"].map((name) => (
              <div className="review" key={name}>
                <Stars />
                <strong>{name}</strong>
                <p>
                  Excellent quality and a thoughtful design. A great addition to
                  my workspace.
                </p>
              </div>
            ))
          )}
        </div>
      </Card>
      <h2 className="section-space">Related Products</h2>
      <div className="product-grid four">
        {products
          .filter((x) => x.id !== p.id)
          .slice(0, 4)
          .map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
      </div>
    </>
  );
}
function ProductList() {
  const [products, setProducts] = usePersisted("products", seed);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const nav = useNavigate();
  return (
    <>
      <PageTitle title="Product list">
        <Link className="btn btn-primary" to="/apps/ecommerce/addproduct">
          <Icon name="Plus" size={16} />
          Add Product
        </Link>
      </PageTitle>
      <Card>
        <DataTable
          rows={products}
          columns={[
            {
              key: "name",
              label: "Products",
              render: (p) => (
                <div className="person-cell">
                  <img className="small-product" src={p.image} alt="" />
                  <div>
                    <strong>{p.name}</strong>
                    <small>{p.category}</small>
                  </div>
                </div>
              ),
            },
            {
              key: "date",
              label: "Date",
              render: (p) => (
                <span className="muted">Nov {17 - (p.id % 9)}, 2026</span>
              ),
            },
            {
              key: "stock",
              label: "Status",
              render: (p) => <Badge>{p.stock}</Badge>,
            },
            {
              key: "price",
              label: "Price",
              render: (p) => money(p.price),
              sort: (p) => p.price,
            },
          ]}
          searchable
          pagination={false}
          selectable
          onEdit={(p) => nav("/apps/ecommerce/editproduct?id=" + p.id)}
          onDelete={setDeleting}
        />
      </Card>
      <Confirm
        open={!!deleting}
        title="Delete product?"
        onClose={() => setDeleting(null)}
        onConfirm={() =>
          setProducts(products.filter((p) => p.id !== deleting?.id))
        }
      />
    </>
  );
}
export function Upload({
  onChange,
  label = "Upload file",
}: {
  onChange: (value: string) => void;
  label?: string;
}) {
  const { toast } = useWorkspace();
  return (
    <label className="upload-zone">
      <Icon name="CloudUpload" size={28} />
      <strong>{label}</strong>
      <span>Drag or drop your files here or click to upload</span>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 3 * 1024 * 1024) {
            toast("Choose an image smaller than 3MB for local storage.");
            return;
          }
          const reader = new FileReader();
          reader.onload = () => onChange(String(reader.result));
          reader.readAsDataURL(file);
        }}
      />
    </label>
  );
}
function ProductEditor({ edit }: { edit: boolean }) {
  const [products, setProducts] = usePersisted("products", seed);
  const id = Number(new URLSearchParams(location.search).get("id") || 3);
  const base = edit
    ? products.find((p) => p.id === id) || products[0]
    : {
        id: Date.now(),
        name: "",
        category: "fashion",
        price: 0,
        oldPrice: 0,
        image: "/images/products/beauty-product.png",
        stock: "InStock",
        rating: 4.5,
      };
  const [p, setP] = useState<Product>(base);
  const [variation, setVariation] = useState([""]);
  const [description, setDescription] = useState(
    edit ? "A carefully designed product for your everyday essentials." : "",
  );
  const [discount, setDiscount] = useState("No Discount");
  const nav = useNavigate();
  const { toast } = useWorkspace();
  return (
    <>
      <PageTitle title={edit ? "Edit Product" : "Add Product"} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setProducts(
            edit
              ? products.map((x) => (x.id === p.id ? p : x))
              : [...products, p],
          );
          toast("Product saved locally");
          nav("/apps/ecommerce/list");
        }}
      >
        <div className="editor-layout">
          <div>
            <Card title="General">
              <div className="card-body">
                <Field
                  label="Product Name *"
                  hint="A product name is required and recommended to be unique."
                >
                  <input
                    required
                    placeholder="Product Name"
                    value={p.name}
                    onChange={(e) => setP({ ...p, name: e.target.value })}
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    rows={7}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Field>
              </div>
            </Card>
            <Card title="Media" className="section-space">
              <div className="card-body">
                <Upload onChange={(image) => setP({ ...p, image })} />
              </div>
            </Card>
            <Card title="Variation" className="section-space">
              <div className="card-body">
                {variation.map((v, i) => (
                  <div className="button-group" key={i}>
                    <select aria-label="Variation type">
                      <option>Size</option>
                      <option>Color</option>
                    </select>
                    <input
                      placeholder="Variation"
                      value={v}
                      onChange={(e) =>
                        setVariation(
                          variation.map((x, j) =>
                            j === i ? e.target.value : x,
                          ),
                        )
                      }
                    />
                    <IconButton
                      type="button"
                      name="Trash2"
                      label="Remove variation"
                      onClick={() =>
                        setVariation(variation.filter((_, j) => j !== i))
                      }
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => setVariation([...variation, ""])}
                >
                  <Icon name="Plus" size={15} />
                  Add another variation
                </Button>
              </div>
            </Card>
            <Card title="Pricing" className="section-space">
              <div className="card-body">
                <Field label="Base Price *" hint="Set the product price.">
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={p.price}
                    onChange={(e) =>
                      setP({
                        ...p,
                        price: Number(e.target.value),
                        oldPrice: Number(e.target.value) * 1.15,
                      })
                    }
                  />
                </Field>
                <h4>Discount Type</h4>
                <Tabs
                  items={["No Discount", "Percentage", "Fixed Amount"]}
                  value={discount}
                  onChange={setDiscount}
                />
                {discount !== "No Discount" && (
                  <Field label="Discount value">
                    <input type="number" min="0" />
                  </Field>
                )}
                <div className="form-grid">
                  <Field label="Tax Class *">
                    <select>
                      <option>Tax Free</option>
                      <option>Taxable Goods</option>
                    </select>
                  </Field>
                  <Field label="VAT Amount (%) *">
                    <input type="number" min="0" max="100" defaultValue={0} />
                  </Field>
                </div>
              </div>
            </Card>
          </div>
          <div>
            <Card title="Thumbnail">
              <div className="card-body">
                <img
                  className="editor-thumbnail"
                  src={p.image}
                  alt="Product thumbnail"
                />
                <Upload
                  label="Drop Thumbnail here to upload"
                  onChange={(image) => setP({ ...p, image })}
                />
              </div>
            </Card>
            <Card title="Status" className="section-space">
              <div className="card-body">
                <select
                  value={p.stock}
                  onChange={(e) => setP({ ...p, stock: e.target.value })}
                >
                  <option>InStock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
            </Card>
            <Card title="Product Details" className="section-space">
              <div className="card-body">
                <Field label="Categories *">
                  <select
                    value={p.category}
                    onChange={(e) => setP({ ...p, category: e.target.value })}
                  >
                    {["fashion", "books", "toys", "electronics"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Tags">
                  <input placeholder="Add tags for products" />
                </Field>
              </div>
            </Card>
            <Card title="Product Template" className="section-space">
              <div className="card-body">
                <Field label="Select a product template *">
                  <select>
                    <option>Default Template</option>
                    <option>Full width</option>
                  </select>
                </Field>
              </div>
            </Card>
          </div>
        </div>
        <div className="form-actions">
          <Button type="button" onClick={() => nav("/apps/ecommerce/list")}>
            Cancel
          </Button>
          <Button variant="primary">Save changes</Button>
        </div>
      </form>
    </>
  );
}
function Checkout() {
  const { cart, setCart, toast } = useWorkspace();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState(0);
  const [complete, setComplete] = useState(false);
  const [order, setOrder] = useState("");
  const total = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const [paidTotal, setPaidTotal] = useState(0);
  const finish = () => {
    setPaidTotal(total * 0.95);
    setOrder("RTH-" + Date.now().toString().slice(-8));
    setComplete(true);
    setCart([]);
    toast("Demo order created. No payment was collected.");
  };
  return (
    <>
      <PageTitle title="Checkout" />
      <Card className="checkout">
        <div className="checkout-steps">
          {["Cart", "Billing & address", "Payment"].map((name, i) => (
            <button
              disabled={complete || i > step}
              className={step === i ? "active" : ""}
              key={name}
              onClick={() => setStep(i)}
            >
              <span>{i + 1}</span>
              {name}
            </button>
          ))}
        </div>
        {complete ? (
          <Empty
            title="Thank you for your order!"
            text={`Demo order ${order} has been recorded locally. No payment was collected.`}
            action={
              <div className="button-group">
                <Link to="/apps/ecommerce/shop" className="btn btn-primary">
                  Continue Shopping
                </Link>
                <Button
                  onClick={() =>
                    downloadText(
                      order + "-receipt.txt",
                      `RUTHLESS dashboard\nDemo receipt\nOrder ${order}\nTotal ${money(paidTotal)}\nNo payment collected.`,
                    )
                  }
                >
                  Download Receipt
                </Button>
              </div>
            }
          />
        ) : (
          <>
            <div className="checkout-layout">
              <div>
                {step === 0 ? (
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map(({ product, quantity }) => (
                          <tr key={product.id}>
                            <td>
                              <div className="person-cell">
                                <img
                                  className="small-product"
                                  src={product.image}
                                  alt=""
                                />
                                <strong>{product.name}</strong>
                              </div>
                            </td>
                            <td>
                              <div className="quantity">
                                <button
                                  aria-label="Decrease quantity"
                                  onClick={() =>
                                    setCart(
                                      cart.map((i) =>
                                        i.product.id === product.id
                                          ? {
                                              ...i,
                                              quantity: Math.max(
                                                1,
                                                quantity - 1,
                                              ),
                                            }
                                          : i,
                                      ),
                                    )
                                  }
                                >
                                  −
                                </button>
                                <span>{quantity}</span>
                                <button
                                  aria-label="Increase quantity"
                                  onClick={() =>
                                    setCart(
                                      cart.map((i) =>
                                        i.product.id === product.id
                                          ? { ...i, quantity: quantity + 1 }
                                          : i,
                                      ),
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td>{money(product.price * quantity)}</td>
                            <td>
                              <IconButton
                                name="Trash2"
                                label={"Remove " + product.name}
                                onClick={() =>
                                  setCart(
                                    cart.filter(
                                      (i) => i.product.id !== product.id,
                                    ),
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!cart.length && (
                      <Empty
                        title="Your cart is empty"
                        action={
                          <Link
                            className="btn btn-primary"
                            to="/apps/ecommerce/shop"
                          >
                            Continue Shopping
                          </Link>
                        }
                      />
                    )}
                  </div>
                ) : step === 1 ? (
                  <div className="address-cards">
                    {["Home", "Office", "Family"].map((name, i) => (
                      <button
                        className={
                          "card address-card " +
                          (address === i ? "selected" : "")
                        }
                        onClick={() => setAddress(i)}
                        key={name}
                      >
                        <h3>{name}</h3>
                        <strong>Cameron</strong>
                        <p>
                          {
                            [
                              "814 Howard Street, San Francisco, CA",
                              "123 Market Street, San Francisco, CA",
                              "456 Innovation Ave, Austin, TX",
                            ][i]
                          }
                        </p>
                        <p>+1 415 123 4567</p>
                        <span className="btn btn-secondary">
                          Deliver To this address{" "}
                          {address === i && <Icon name="Check" size={15} />}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="payment-options">
                    <h2>Payment details</h2>
                    <p className="muted">
                      This is a local checkout demonstration. Do not enter real
                      card information.
                    </p>
                    <label className="radio-row">
                      <input type="radio" name="payment" defaultChecked />
                      Demo payment (no charge)
                    </label>
                    <div className="card card-body">
                      <Icon name="ShieldCheck" size={30} />
                      <p>
                        No payment provider is connected. Your order is saved
                        locally only.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="card order-summary">
                <h3>Order Summary</h3>
                {[
                  ["Sub Total", money(total)],
                  ["Discount 5%", "−" + money(total * 0.05)],
                  ["Shipping", "Free"],
                  ["Total", money(total * 0.95)],
                ].map(([label, value]) => (
                  <div className="summary-row" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-actions spread">
              <Button disabled={step === 0} onClick={() => setStep(step - 1)}>
                Previous
              </Button>
              <Button
                variant="primary"
                disabled={!cart.length}
                onClick={() => (step === 2 ? finish() : setStep(step + 1))}
              >
                {step === 2 ? "Place demo order" : "Next"}
              </Button>
            </div>
          </>
        )}
      </Card>
    </>
  );
}
