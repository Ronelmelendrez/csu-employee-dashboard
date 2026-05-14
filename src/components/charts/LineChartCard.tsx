import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';

interface LineChartCardProps {
  title: string;
  data: { year: string; count: number }[];
  color?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/95 backdrop-blur-md border border-slate-200/50 rounded-xl p-4 shadow-xl"
      >
        <p className="text-sm font-semibold text-slate-700 mb-2">{`Year: ${label}`}</p>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: payload[0].color }}
          />
          <p className="text-sm text-slate-600">
            {`Count: `}
            <span className="font-bold text-slate-900">{payload[0].value}</span>
          </p>
        </div>
      </motion.div>
    );
  }
  return null;
};

export const LineChartCard = ({ title, data, color = '#10b981' }: LineChartCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card variant="gradient" className="p-8 overflow-hidden relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5" />

        {/* Content */}
        <div className="relative z-10">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-black mb-8 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
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
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                <CartesianGrid
                  strokeDasharray="2 4"
                  stroke="rgba(148, 163, 184, 0.2)"
                  strokeWidth={1}
                />
                <XAxis
                  dataKey="year"
                  stroke="rgba(71, 85, 105, 0.6)"
                  fontSize={12}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(71, 85, 105, 0.6)"
                  fontSize={12}
                  fontWeight={500}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={color}
                  strokeWidth={3}
                  dot={{
                    fill: color,
                    strokeWidth: 2,
                    stroke: '#ffffff',
                    r: 6,
                    filter: 'url(#glow)'
                  }}
                  activeDot={{
                    r: 8,
                    fill: color,
                    stroke: '#ffffff',
                    strokeWidth: 3,
                    filter: 'url(#glow)'
                  }}
                  filter="url(#glow)"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};