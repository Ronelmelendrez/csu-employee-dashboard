import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';

interface PieChartCardProps {
  title: string;
  data: { name: string; value: number }[];
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/95 backdrop-blur-md border border-slate-200/50 rounded-xl p-4 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full shadow-sm"
            style={{ backgroundColor: data.payload.fill }}
          />
          <div>
            <p className="text-sm font-semibold text-slate-700">{data.name}</p>
            <p className="text-sm text-slate-600">
              Count: <span className="font-bold text-slate-900">{data.value}</span>
            </p>
            <p className="text-xs text-slate-500">
              {((data.value / data.payload.total) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </motion.div>
    );
  }
  return null;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize="12"
      fontWeight="bold"
      style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.7))' }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const PieChartCard = ({ title, data, colors = DEFAULT_COLORS }: PieChartCardProps) => {
  // Calculate total for percentage calculations
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map(item => ({ ...item, total }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card variant="gradient" className="p-8 overflow-hidden relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/5 to-accent-500/5" />

        {/* Content */}
        <div className="relative z-10">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-black mb-8 bg-gradient-to-r from-secondary-600 to-accent-600 bg-clip-text text-transparent"
          >
            {title}
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {colors.map((_, index) => (
                    <filter key={`glow-${index}`} id={`glow-${index}`}>
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  ))}
                </defs>

                <Pie
                  data={dataWithTotal}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={110}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={400}
                  animationDuration={800}
                >
                  {dataWithTotal.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                      filter={`url(#glow-${index % colors.length})`}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};