//frontend/src/components/charts/RiskMeter.jsx
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const RiskMeter = ({ value }) => {
  const data = [{ value, fill: value < 30 ? '#10B981' : value < 60 ? '#F59E0B' : '#EF4444' }];
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart 
        innerRadius="70%" 
        outerRadius="100%" 
        barSize={10} 
        data={data}
        startAngle={180} 
        endAngle={0}
      >
        <RadialBar background dataKey="value" />
        <text 
          x="50%" 
          y="50%" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          className="text-xl font-bold"
        >
          {value}%
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export default RiskMeter;