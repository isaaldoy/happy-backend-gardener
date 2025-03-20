
import { VulnerabilityScanner } from "@/components/VulnerabilityScanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Security Vulnerability Scanner</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <VulnerabilityScanner />
        </div>
      </main>
      <footer className="bg-white shadow mt-10 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            This tool is for educational and authorized security testing purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
