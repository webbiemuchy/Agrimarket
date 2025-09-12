import { useState } from 'react';
import { X } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const CheckoutModal = ({ proposal, onClose }) => {
  const remainingInitial = Math.max(
    0,
    (proposal.funding_goal || 0) - (proposal.current_funding || 0)
  );
  const [amount, setAmount] = useState(remainingInitial);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const remaining = Math.max(
    0,
    (proposal.funding_goal || 0) - (proposal.current_funding || 0)
  );
  
  const handleSubmit = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
      
      const txId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
      window.location.href = `/receipt/${txId}?projectId=${encodeURIComponent(
        proposal.id
      )}`;
    }, 2000);
  };
  
  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="p-6 relative max-w-md">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Fund This Project</h2>
        <p className="text-gray-600 mb-6">Complete your investment in "{proposal.title}"</p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investment Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="10"
                max={remaining}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Remaining funding needed: ${remaining.toLocaleString()}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`border rounded-lg p-3 text-center ${
                  paymentMethod === 'card' 
                    ? 'border-emerald-600 bg-emerald-50' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="text-sm font-medium">Credit/Debit Card</div>
              </button>
              <button
                className={`border rounded-lg p-3 text-center ${
                  paymentMethod === 'bank' 
                    ? 'border-emerald-600 bg-emerald-50' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setPaymentMethod('bank')}
              >
                <div className="text-sm font-medium">Bank Transfer</div>
              </button>
            </div>
          </div>
          
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
          
          {paymentMethod === 'bank' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                Please transfer funds to the following account:
              </p>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Bank:</span> AgriInvest Escrow Bank</p>
                <p><span className="font-medium">Account:</span> 1234567890</p>
                <p><span className="font-medium">Reference:</span> {proposal.id}</p>
              </div>
            </div>
          )}
          
          <div className="bg-emerald-50 p-4 rounded-lg">
            <div className="flex justify-between mb-1">
              <span className="text-emerald-700">Investment Amount:</span>
              <span className="font-medium">${amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-700">Platform Fee (2%):</span>
              <span className="font-medium">${(amount * 0.02).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="border-t border-emerald-200 mt-2 pt-2 flex justify-between font-bold">
              <span className="text-emerald-700">Total:</span>
              <span className="text-emerald-700">${(amount * 1.02).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
          
          <Button 
            variant="primary"
            className="w-full py-3"
            onClick={handleSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing Payment...' : 'Confirm Investment'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CheckoutModal;