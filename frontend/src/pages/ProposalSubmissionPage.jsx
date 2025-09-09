//frontend/src/pages/ProposalSubmissionPage.jsx
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createProject } from '../services/projectService'; 
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const ProposalSubmissionPage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
    expectedYield: '',
    projectType: '',
    duration: '',
    fundingGoal: '',
    fundingDeadline: '',
    farmSize: ''
  });

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      showNotification('Success', 'Proposal submitted', 'success');
      navigate('/dashboard/farmer');
    },
    onError: (error) => {
      showNotification('Error', error.message || 'Submission failed', 'error');
    }
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="p-6">
      <Card className="max-w-lg mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">New Proposal</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(form).map(([key, val]) => (
            <div key={key}>
              <label className="block text-sm capitalize mb-1">{key}</label>
              <input
                name={key}
                value={val}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
                type={key.toLowerCase().includes('date') ? 'date' : 'text'}
              />
            </div>
          ))}
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ProposalSubmissionPage;
