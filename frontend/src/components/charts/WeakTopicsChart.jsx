import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const colors = ["#739a49", "#243447", "#d97706", "#0f766e"];

const WeakTopicsChart = ({ data = [] }) => (
  <div className="panel p-5">
    <h3 className="text-lg font-semibold">Weak Topics</h3>
    <div className="mt-6 h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="accuracy" nameKey="topic" outerRadius={100}>
            {data.map((entry, index) => (
              <Cell key={entry.topic} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default WeakTopicsChart;
