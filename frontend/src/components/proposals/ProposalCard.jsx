// frontend/src/components/proposals/ProposalCard.jsx
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import investmentService from '../../services/investmentService';
import { useNotification } from '../../hooks/useNotification';
import { useState, useEffect } from 'react';
import { geocodeLocation } from '../../services/geocodeService';

const ProposalCard = ({ proposal }) => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [placeName, setPlaceName] = useState(proposal.location);

  

  
      const {
    current_funding: funded = 0,
    funding_goal: fundingGoal = 0,
    riskScore,
    roiScore,
    title,
    farmer,
    id,
    description, 
  } = proposal;

 
  const progress = fundingGoal
    ? Math.round((funded / fundingGoal) * 100)
    : 0;

  const handleInvest = async (e) => {
    e.preventDefault(); // prevent link navigation
    const input = prompt('Enter investment amount (USD):', '');
    const amount = parseFloat(input);
    if (isNaN(amount) || amount <= 0) {
      return showNotification('Error', 'Please enter a valid amount', 'error');
    }

    try {
      setLoading(true);
      await investmentService.createInvestment({
        projectId: id,
        amount,
        paymentMethod: 'card'
      });
      showNotification('Success', 'Investment created successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to invest';
      showNotification('Error', msg, 'error');
    } finally {
      setLoading(false);
    }

  };
  useEffect(() => {
    if (proposal.location.includes(',')) {
      const [lat, lng] = proposal.location.split(',').map(Number);
      geocodeLocation(lat, lng).then(name => setPlaceName(name));
    }
  }, [proposal.location]);

  return (
    <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link
        to={`/proposals/${id}`}
        className="block bg-gray-200 border-b border-dashed w-full h-48 relative group"
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-sm text-center line-clamp-6">{description}</p>
        </div>
      </Link>
        
      

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
            {title}
          </h3>
          <Badge
            variant={riskScore < 0.3 ? 'success' : riskScore < 0.6 ? 'warning' : 'danger'}
          >
            Risk: {typeof riskScore === 'number' ? `${(riskScore * 100).toFixed(0)}%` : 'N/A'}
          </Badge>
        </div>

        <div className="flex items-center text-sm text-gray-600 mt-2">
          <MapPin size={14} className="mr-1" />
          <span>{placeName}</span>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>${funded.toLocaleString()} raised</span>
            <span>${fundingGoal.toLocaleString()} goal</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">ROI Estimate</p>
            <p className="font-medium text-emerald-600">
              {typeof roiScore === 'number' ? `${(roiScore * 100).toFixed(0)}%` : 'N/A'}
            </p>
          </div>
          <div className="flex items-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-full w-8 h-8" />
            <span className="ml-2 text-sm">{farmer}</span>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <Button
          onClick={handleInvest}
          disabled={loading}
          variant="primary"
          className="w-full"
        >
          {loading ? 'Processing…' : 'Invest'}
        </Button>
      </div>
    </div>
  );
};

export default ProposalCard;
