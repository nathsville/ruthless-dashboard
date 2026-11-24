import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { initialSales } from "../data";
import { Icon } from "../ui";
export const chartColors = [
  "var(--primary)",
  "var(--series-b)",
  "var(--series-c)",
];
const axes = {
  tick: { fontSize: 12, fill: "var(--muted-foreground)" },
  axisLine: false,
  tickLine: false,
};
const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  color: "var(--foreground)",
  fontSize: 12,
};
export function SalesChart({
  range = "Last 30 Days",
  type = "bar",
  height = 260,
}: {
  range?: string;
  type?: "bar" | "area" | "line";
  height?: number;
}) {
  const rows =
    range === "Last 7 Days"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((date, i) => ({
          date,
          teamA: [4200, 5800, 4900, 6200, 7100, 3800, 3200][i],
          teamB: [2800, 3200, 2900, 3800, 4200, 2400, 2000][i],
          teamC: [2100, 2600, 2400, 3100, 3500, 1800, 1600][i],
        }))
      : range === "Last 90 Days"
        ? Array.from({ length: 12 }, (_, i) => ({
            date: "W" + (i + 1),
            teamA: 6200 + i * 550 + (i % 2) * 1100,
            teamB: 3800 + i * 280,
            teamC: 3200 + i * 220,
          }))
        : initialSales;
  const common = {
    data: rows,
    margin: { top: 4, right: 0, bottom: 0, left: 0 },
  };
  const content = (
    <>
      <CartesianGrid
        vertical={false}
        stroke="var(--border)"
        strokeDasharray="4 4"
      />
      <XAxis {...axes} dataKey="date" tickMargin={8} interval={0} />
      <YAxis
        {...axes}
        width={33}
        domain={[0, 30000]}
        ticks={[0, 5000, 10000, 15000, 20000, 25000, 30000]}
        tickFormatter={(n) => (n === 0 ? "0" : n / 1000 + "k")}
      />
      <Tooltip
        cursor={false}
        contentStyle={tooltipStyle}
        formatter={(v) => Number(v).toLocaleString()}
      />
    </>
  );
  return (
    <div
      className="chart"
      style={{ height }}
      aria-label={`${range} sales chart`}
    >
      <ResponsiveContainer width="100%" height="100%">
        {type === "bar" ? (
          <BarChart {...common}>
            {content}
            {["teamA", "teamB", "teamC"].map((key, i) => (
              <Bar
                key={key}
                name={["Team A", "Team B", "Team C"][i]}
                dataKey={key}
                stackId="sales"
                barSize={30}
                fill={chartColors[i]}
                radius={i === 0 ? [0, 0, 6, 6] : i === 2 ? [6, 6, 0, 0] : 0}
                animationDuration={700}
                animationBegin={i * 120}
                animationEasing="ease-out"
              />
            ))}
          </BarChart>
        ) : type === "area" ? (
          <AreaChart {...common}>
            {content}
            <Area
              name="Revenue"
              type="monotone"
              dataKey="teamA"
              stroke="var(--primary)"
              fill="var(--series-c)"
              animationDuration={700}
            />
            <Area
              name="Orders"
              type="monotone"
              dataKey="teamB"
              stroke="var(--series-b)"
              fill="transparent"
              animationDuration={700}
            />
          </AreaChart>
        ) : (
          <LineChart {...common}>
            {content}
            <Line
              name="Revenue"
              type="linear"
              dataKey="teamA"
              stroke="var(--primary)"
              dot={false}
              strokeWidth={2}
              animationDuration={700}
            />
            <Line
              name="Previous period"
              type="linear"
              dataKey="teamB"
              stroke="var(--series-b)"
              strokeDasharray="4 4"
              dot={false}
              animationDuration={700}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
export function Legend({
  labels = ["Team A", "Team B", "Team C"],
}: {
  labels?: string[];
}) {
  return (
    <div className="legend">
      {labels.map((x, i) => (
        <span key={x}>
          <i style={{ background: chartColors[i % 3] }} />
          {x}
        </span>
      ))}
    </div>
  );
}
export function TickRing({
  title = "TOTAL REVENUE",
  value = "$284,920.00",
  items = [
    { name: "Website", value: "$4,385", growth: "+4.7%" },
    { name: "Marketplace", value: "$4,590", growth: "+2.1%" },
    { name: "Affiliate", value: "$18,356", growth: "+1.7%" },
  ],
  icon = "Wallet",
}: {
  title?: string;
  value?: string;
  items?: { name: string; value: string; growth: string }[];
  icon?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="ring-block">
      <div className="ring-holder">
        <svg
          className="tick-ring"
          viewBox="0 0 200 200"
          role="img"
          aria-label={`${title} ${value}`}
        >
          {Array.from({ length: 60 }, (_, i) => {
            const a = ((i * 6 - 90) * Math.PI) / 180;
            const group = i < 9 ? 0 : i < 19 ? 1 : i < 45 ? 2 : 3;
            return (
              <line
                key={i}
                className="tick-in"
                x1={100 + 90 * Math.cos(a)}
                y1={100 + 90 * Math.sin(a)}
                x2={100 + 100 * Math.cos(a)}
                y2={100 + 100 * Math.sin(a)}
                stroke={group === 3 ? "var(--border)" : chartColors[group]}
                strokeWidth={2.8}
                strokeLinecap="round"
                opacity={hover !== null && hover !== group ? 0.25 : 1}
                style={{ animationDelay: `${200 + i * 12}ms` }}
                onMouseEnter={() => setHover(group)}
                onMouseLeave={() => setHover(null)}
              />
            );
          })}
        </svg>
        <div className="ring-center">
          <span className="ring-icon">
            <Icon name={icon} size={16} />
          </span>
          <small>{title}</small>
          <strong>{value}</strong>
        </div>
        {hover !== null && hover < 3 && (
          <div className="ring-tooltip">
            {items[hover].name} · {items[hover].value}
          </div>
        )}
      </div>
      <div className="ring-legend">
        {items.map((r, i) => (
          <div
            className={hover === i ? "hovered" : ""}
            key={r.name}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span
              className="ring-mark"
              style={{ background: chartColors[i % 3] }}
            />
            <span>{r.name}</span>
            <strong>{r.value}</strong>
            <span className="positive">{r.growth}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
export function MiniChart({
  kind = "bar",
  height = 80,
}: {
  kind?: "bar" | "line" | "matrix";
  height?: number;
}) {
  if (kind === "matrix")
    return (
      <div className="matrix-chart" style={{ height }}>
        {[2, 3, 5, 4, 7, 3, 2].map((n, i) => (
          <div key={i}>
            {Array.from({ length: 7 }, (_, j) => (
              <i
                key={j}
                style={{
                  background:
                    j < 7 - n
                      ? "transparent"
                      : j === 7 - n
                        ? "var(--primary)"
                        : "var(--series-b)",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  return (
    <div className="chart mini-chart" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {kind === "bar" ? (
          <BarChart data={[4, 6, 5, 8, 7, 9, 6].map((v, i) => ({ v, i }))}>
            <Bar
              dataKey="v"
              fill="var(--series-b)"
              radius={[2, 2, 0, 0]}
              animationDuration={700}
            />
          </BarChart>
        ) : (
          <LineChart data={[4, 6, 5, 8, 5, 9, 7].map((v) => ({ v }))}>
            <Line
              type="monotone"
              dataKey="v"
              stroke="var(--primary)"
              dot={false}
              animationDuration={700}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
export function GenericChart({ kind }: { kind: string }) {
  if (kind === "radar")
    return (
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart
          data={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((name, i) => ({
            name,
            value: [65, 90, 75, 95, 60, 80][i],
          }))}
        >
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fill: "var(--muted-foreground)" }}
          />
          <Radar
            dataKey="value"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    );
  if (kind === "pie")
    return (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={[
              { name: "Desktop", value: 60 },
              { name: "Mobile", value: 25 },
              { name: "Other", value: 15 },
            ]}
            dataKey="value"
            innerRadius={70}
            outerRadius={110}
          >
            {chartColors.map((c) => (
              <Cell key={c} fill={c} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    );
  return (
    <SalesChart
      type={kind === "area" ? "area" : kind === "line" ? "line" : "bar"}
    />
  );
}
