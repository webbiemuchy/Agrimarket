// frontend/src/components/layout/AppShell.jsx
import Header from './Header';
import Footer from './Footer';

const AppShell = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <Header />

     
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className=" top-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      
      <Footer />
    </div>
  );
};

export default AppShell;
