//frontend/src/components/proposals/ProposalTable.jsx
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Table from '../ui/Table';

const ProposalTable = ({ proposals = [] }) => {
  const columns = [
    { header: 'Project', accessor: 'title' },
    { header: 'Status', accessor: 'status' },
    { header: 'Funded', accessor: 'funded' },
    { header: 'Goal', accessor: 'goal' },
    { header: 'Progress', accessor: 'progress' },
    { header: 'Actions', accessor: 'actions' }
  ];
  
  const data = proposals.map(proposal => ({
    ...proposal,
    funded: `$${proposal.funded.toLocaleString()}`,
    goal: `$${proposal.fundingGoal.toLocaleString()}`,
    progress: (
      <div className="flex items-center">
        <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-3">
          <div 
            className={`h-2.5 rounded-full ${
              proposal.progress === 100 ? 'bg-emerald-500' : 'bg-yellow-500'
            }`} 
            style={{ width: `${proposal.progress}%` }}
          ></div>
        </div>
        <span>{proposal.progress}%</span>
      </div>
    ),
    status: (
      <Badge 
        variant={
          proposal.status === 'approved' ? 'success' : 
          proposal.status === 'pending' ? 'warning' : 
          proposal.status === 'rejected' ? 'danger' : 'primary'
        }
      >
        {proposal.status}
      </Badge>
    ),
    actions: (
      <Link 
        to={`/proposals/${proposal.id}`}
        className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
      >
        View
      </Link>
    )
  }));
  
  return <Table columns={columns} data={data} />;
};

export default ProposalTable;