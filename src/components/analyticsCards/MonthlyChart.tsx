"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Props = {
  title: string;
  description: string;
  data: { month: string; [key: string]: string | number }[];
  dataKey: string;
  prefix?: string;
};

const compact = new Intl.NumberFormat("en", { notation: "compact" });

export default function MonthlyChart({ title, description, data, dataKey, prefix = "" }: Props) {
  return (
    <section className="rounded-3xl border border-[#1B1F16]/10 bg-white p-6 sm:p-8">
      <h2 className="text-lg font-extrabold">{title}</h2>
      <p className="mt-1 text-sm text-[#1B1F16]/60">{description}</p>

      <div className="mt-6 h-72 w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-[#1B1F16]/20 text-sm text-[#1B1F16]/60">
            No data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#1B1F16" strokeOpacity={0.08} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                width={44}
                allowDecimals={false}
                tickFormatter={(value) => compact.format(value)}
              />
              <Tooltip
                cursor={{ fill: "#EEF4E0" }}
                formatter={(value) => `${prefix}${Number(value).toLocaleString()}`}
                contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,31,22,0.1)", fontSize: 13 }}
              />
              <Bar dataKey={dataKey} fill="#7CB518" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}