//frontend/src/pages/MarketplacePage.jsx

import { useState, useEffect } from 'react';
import { Filter, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ProposalCard from '../components/proposals/ProposalCard';
import {getProjects} from '../services/projectService';
import { useNotification } from '../hooks/useNotification';

const MarketplacePage = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    region: '',
    type: '',
    minRisk: 0,
    maxRisk: 100,
    minROI: 0,
    maxROI: 100,
    search: ''
  });
  const [proposals, setProposals] = useState([]);
  const { showNotification } = useNotification();

  
  useEffect(() => {
    (async () => {
      try {
        const data = await getProjects();
       
        setProposals(data.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          farmer: p.farmer,
          location: p.location,
          type: p.project_type,
          riskScore: p.ai_risk_score,
          roiScore:  p.ai_roi_score,
          funding_goal: p.funding_goal,
          current_funding: p.current_funding,

        })));
      } catch (error) {
        console.error('Failed to load proposals:', error)
        showNotification('Error','Failed to load proposals','error');
      }
    })();
  }, [showNotification]);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      region: '',
      type: '',
      minRisk: 0,
      maxRisk: 100,
      minROI: 0,
      maxROI: 100,
      search: ''
    });
  };

  const filtered = proposals.filter(p =>
    (!filters.region || p.location.includes(filters.region)) &&
    (!filters.type || p.type === filters.type) &&
    p.riskScore >= filters.minRisk &&
    p.riskScore <= filters.maxRisk &&
    p.roiScore >= filters.minROI &&
    p.roiScore <= filters.maxROI &&
    (!filters.search ||
      p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      p.farmer.toLowerCase().includes(filters.search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Marketplace</h1>
          <p className="text-gray-600">Browse and invest in agricultural projects</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setFiltersOpen(o => !o)}
            className="flex items-center"
          >
            <Filter size={16} className="mr-1" /> Filters
          </Button>
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search proposals..."
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {filtersOpen && (
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div>
              <label className="block text-sm font-medium mb-1">Region</label>
              <select
                name="region"
                value={filters.region}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">All Regions</option>
                <option>Nairobi</option>
                <option>Central</option>
                <option>Rift Valley</option>
                <option>Western</option>
                <option>Coastal</option>
              </select>
            </div>

           
            <div>
              <label className="block text-sm font-medium mb-1">Project Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">All Types</option>
                <option>Crop Production</option>
                <option>Livestock</option>
                <option>Irrigation</option>
                <option>Equipment</option>
              </select>
            </div>

            
            <div>
              <label className="block text-sm font-medium mb-1">
                Risk Score: {filters.minRisk}% - {filters.maxRisk}%
              </label>
              <input
                type="range"
                name="minRisk"
                min="0"
                max="100"
                value={filters.minRisk}
                onChange={handleFilterChange}
                className="w-full"
              />
              <input
                type="range"
                name="maxRisk"
                min="0"
                max="100"
                value={filters.maxRisk}
                onChange={handleFilterChange}
                className="w-full"
              />
            </div>

            {/* ROI */}
            <div>
              <label className="block text-sm font-medium mb-1">
                ROI Estimate: {filters.minROI}% - {filters.maxROI}%
              </label>
              <input
                type="range"
                name="minROI"
                min="0"
                max="100"
                value={filters.minROI}
                onChange={handleFilterChange}
                className="w-full"
              />
              <input
                type="range"
                name="maxROI"
                min="0"
                max="100"
                value={filters.maxROI}
                onChange={handleFilterChange}
                className="w-full"
              />
            </div>
          </div>
        </Card>
      )}

      {!filtered.length ? (
        <Card className="p-12 text-center">
          <h3 className="text-xl font-medium mb-2">No proposals found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters</p>
          <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <ProposalCard key={p.id} proposal={p} />
          ))}
        </div>
      )}
    </div>
  );

 };

export default MarketplacePage;
