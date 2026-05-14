import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

interface LineChartCardProps {
  title: string;
  data: { year: string; count: number }[];
  color?: string;
}

export const LineChartCard = ({ title, data, color = '#10b981' }: LineChartCardProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="year" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }} />
          <Legend />
          <Line type="monotone" dataKey="count" stroke={color} strokeWidth={2} dot={{ fill: color }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};