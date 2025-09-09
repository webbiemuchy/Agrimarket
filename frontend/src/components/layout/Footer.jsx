// frontend/src/components/layout/Footer.jsx

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">AgriMarket</h3>
            <p className="text-gray-400">
              Connecting farmers with investors to build sustainable agriculture.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/marketplace" className="text-gray-400 hover:text-white">Marketplace</a></li>
              <li><a href="/" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="/" className="text-gray-400 hover:text-white">FAQ</a></li>
              <li><a href="/" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="/" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              <li><a href="/" className="text-gray-400 hover:text-white">Disclaimer</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-3">Subscribe to our newsletter</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-3 py-2 rounded-l-lg text-gray-800 w-full"
              />
              <button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-r-lg"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} AgriMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;