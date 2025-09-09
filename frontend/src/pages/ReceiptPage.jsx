import { CheckCircle, Download, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const ReceiptPage = () => {
  const { paymentId } = useParams();
  
  // Mock data 
  const payment = {
    id: paymentId,
    date: '2023-08-15',
    time: '14:30:45',
    amount: 2500,
    project: {
      id: '1',
      title: 'Organic Maize Farming in Nairobi'
    },
    farmer: {
      name: 'John Kamau'
    },
    transactionId: 'TX-789456123',
    status: 'Completed'
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/dashboard/investor" className="inline-flex items-center text-emerald-600 hover:text-emerald-800 mb-6">
        <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
      </Link>
      
      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Your investment in "{payment.project.title}" has been processed successfully.
        </p>
        
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Transaction ID</p>
              <p className="font-medium">{payment.transactionId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date & Time</p>
              <p className="font-medium">{payment.date} at {payment.time}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="font-medium">${payment.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium text-emerald-600">{payment.status}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600">Project</p>
            <p className="font-medium">{payment.project.title}</p>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600">Farmer</p>
            <p className="font-medium">{payment.farmer.name}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="primary"
            className="flex items-center"
          >
            <Download size={18} className="mr-2" />
            Download Receipt (PDF)
          </Button>
          
          <Button 
            variant="outline"
            as={Link}
            to={`/proposals/${payment.project.id}`}
          >
            View Project
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ReceiptPage;