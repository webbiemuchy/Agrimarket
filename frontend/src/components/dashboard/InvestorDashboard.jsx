//frontend/src/components/dashboard/InvestorDashboard.jsx
import { 
  BarChart, 
  ArrowUpRight, 
  PieChart,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Table from '../ui/Table';
import PortfolioChart from '../charts/PortfolioChart';

const InvestorDashboard = ({ investments = [] }) => {
  const stats = {
    totalInvestments: investments.length,
    totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
    expectedReturns: investments.reduce((sum, inv) => sum + inv.expectedReturn, 0),
    actualReturns: investments.reduce((sum, inv) => sum + (inv.actualReturn || 0), 0)
  };

  const portfolio = [
    { type: 'Crop Production', amount: 6500, percentage: 42 },
    { type: 'Livestock', amount: 3200, percentage: 21 },
    { type: 'Irrigation', amount: 4500, percentage: 29 },
    { type: 'Equipment', amount: 1200, percentage: 8 }
  ];

  return (
    <div className="space-y-8 mt-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Investor Dashboard</h1>
        <p className="text-gray-600">Track performance and manage your agricultural investments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-5 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wide text-emerald-700">Total Investments</p>
              <p className="text-3xl font-bold text-emerald-900 mt-1">{stats.totalInvestments}</p>
            </div>
            <div className="bg-emerald-100 text-emerald-700 p-3 rounded-full">
              <PieChart size={20} />
            </div>
          </div>
        </Card>
        
        <Card className="p-5 bg-gradient-to-br from-blue-50 to-white border border-blue-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wide text-blue-700">Total Invested</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">${stats.totalInvested.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 text-blue-700 p-3 rounded-full">
              <DollarSign size={20} />
            </div>
          </div>
        </Card>
        
        <Card className="p-5 bg-gradient-to-br from-purple-50 to-white border border-purple-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wide text-purple-700">Expected Returns</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">${stats.expectedReturns.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 text-purple-700 p-3 rounded-full">
              <TrendingUp size={20} />
            </div>
          </div>
        </Card>
        
        <Card className="p-5 bg-gradient-to-br from-green-50 to-white border border-green-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wide text-green-700">Actual Returns</p>
              <p className="text-3xl font-bold text-green-900 mt-1">${stats.actualReturns.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 text-green-700 p-3 rounded-full">
              <ArrowUpRight size={20} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Portfolio Breakdown</h2>
          <PortfolioChart data={portfolio} />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">ROI Performance</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <BarChart />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your Investments</h2>
          <Button as="a" href="/marketplace">
            Invest in New Project
          </Button>
        </div>
        
        <Table
          columns={[
            { header: 'Project', accessor: 'title' },
            { header: 'Farmer', accessor: 'farmer' },
            { header: 'Amount', accessor: 'amount' },
            { header: 'Date', accessor: 'date' },
            { header: 'Status', accessor: 'status' },
            { header: 'ROI', accessor: 'roi' },
            { header: 'Actions', accessor: 'actions' }
          ]}
          data={investments.map(investment => ({
            ...investment,
            amount: `$${investment.amount.toLocaleString()}`,
            roi: `${investment.roi}%`,
            status: (
              <span className={`px-2 py-1 rounded-full text-xs ${
                investment.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 
                investment.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {investment.status}
              </span>
            ),
            actions: (
              <a 
                href={`/proposals/${investment.projectId}`}
                className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
              >
                View
              </a>
            )
          }))}
        />
      </Card>
    </div>
  );
};

export default InvestorDashboard;