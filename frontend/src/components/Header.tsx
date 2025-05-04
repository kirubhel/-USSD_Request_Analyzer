export default function Header() {
    return (
        <header className="text-center mb-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <img
            src="/matrix.jpeg" // Make sure this path points to your logo
            alt="USSD Logo"
            className="w-24 h-24 rounded-full object-cover border-4 border-primary shadow-md"
     
          />
          <h1 className="text-5xl font-bold text-primary">USSD Request Analyzer</h1>
          <p className="text-gray-600 text-lg">
            Monitor, analyze, and prevent fraudulent USSD transactions
          </p>
        </div>
      </header>
    );
  }
  