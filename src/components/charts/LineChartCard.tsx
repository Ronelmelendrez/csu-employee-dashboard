import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

interface LineChartCardProps {
  title: string;
  data: { year: string; count: number }[];
  color?: string;
}

export const LineChartCard = ({ title, data, color = '#10b981' }: LineChartCardProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke={color} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};