//frontend/src/components/charts/RoiChart.jsx

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RoiChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value}%`, 'ROI']} />
        <Legend />
        <Bar dataKey="roi" name="ROI" fill="#10B981" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RoiChart;