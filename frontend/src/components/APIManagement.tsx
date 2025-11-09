import { useState } from 'react';

interface APIStatus {
  name: string;
  description: string;
  status: 'configured' | 'not-configured' | 'testing';
  envVar: string;
  docUrl: string;
  features: string[];
}

export default function APIManagement() {
  const [showInstructions, setShowInstructions] = useState(false);

  const apis: APIStatus[] = [
    {
      name: 'Global VIN Decode API',
      description: 'Decode VIN to get vehicle specifications',
      status: 'configured',
      envVar: 'Currently using free NHTSA vPIC API',
      docUrl: 'https://api.auto.dev/docs',
      features: ['Year, Make, Model', 'Trim & Body Style', 'Engine & Transmission']
    },
    {
      name: 'Plate-to-VIN API',
      description: 'Convert license plates to VIN numbers',
      status: 'not-configured',
      envVar: 'AUTO_DEV_API_KEY',
      docUrl: 'https://api.auto.dev/docs/plate-to-vin',
      features: ['US License Plate Lookup', '1,000 free calls/month', 'Auto-populate vehicle data']
    },
    {
      name: 'Vehicle Pricing/Valuation',
      description: 'Get market pricing estimates',
      status: 'not-configured',
      envVar: 'AUTO_DEV_API_KEY',
      docUrl: 'https://api.auto.dev/docs/valuation',
      features: ['KBB-style pricing', 'Low/Avg/High values', 'Market insights']
    },
    {
      name: 'Vehicle Photos API',
      description: 'Get stock photos of vehicles',
      status: 'not-configured',
      envVar: 'AUTO_DEV_API_KEY',
      docUrl: 'https://api.auto.dev/docs/photos',
      features: ['Exterior photos', 'Interior photos', 'Multiple angles']
    },
    {
      name: 'Vehicle Specifications API',
      description: 'Detailed vehicle specs and features',
      status: 'not-configured',
      envVar: 'AUTO_DEV_API_KEY',
      docUrl: 'https://api.auto.dev/docs/specs',
      features: ['Technical specs', 'Standard features', 'Safety ratings']
    },
    {
      name: 'Vehicle Recalls API',
      description: 'Check for open recalls and safety issues',
      status: 'not-configured',
      envVar: 'AUTO_DEV_API_KEY',
      docUrl: 'https://api.auto.dev/docs/recalls',
      features: ['Open recalls', 'Safety campaigns', 'TSB information']
    },
    {
      name: 'Total Cost of Ownership',
      description: 'Estimated ownership costs',
      status: 'not-configured',
      envVar: 'AUTO_DEV_API_KEY',
      docUrl: 'https://api.auto.dev/docs/tco',
      features: ['Fuel costs', 'Maintenance estimates', 'Insurance rates']
    },
    {
      name: 'OEM Build Data API',
      description: 'Original factory build information',
      status: 'not-configured',
      envVar: 'AUTO_DEV_API_KEY',
      docUrl: 'https://api.auto.dev/docs/build-data',
      features: ['Factory options', 'Paint codes', 'Production date']
    }
  ];

  const getStatusBadge = (status: APIStatus['status']) => {
    switch (status) {
      case 'configured':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">✓ Active</span>;
      case 'not-configured':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Not Setup</span>;
      case 'testing':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Testing</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">API Management</h2>
        <p className="text-blue-100">
          Manage your Auto.dev API integrations and unlock premium features
        </p>
      </div>

      {/* Setup Instructions */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="flex items-center justify-between w-full text-left"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              How to Setup Auto.dev API
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Click to view step-by-step instructions
            </p>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${showInstructions ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showInstructions && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Free Tier Available</h4>
              <p className="text-sm text-blue-800">
                Auto.dev offers 1,000 free API calls per month - perfect for getting started!
              </p>
            </div>

            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <div>
                  <strong>Sign up for Auto.dev:</strong>
                  <br />
                  Visit <a href="https://www.auto.dev/pricing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.auto.dev/pricing</a> and create a free account
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <div>
                  <strong>Get your API key:</strong>
                  <br />
                  After signup, go to your dashboard and copy your API key
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <div>
                  <strong>Add to backend .env file:</strong>
                  <br />
                  Open <code className="bg-gray-100 px-2 py-1 rounded text-xs">/backend/.env</code> and add:
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded mt-2 text-xs overflow-x-auto">
AUTO_DEV_API_KEY=your_api_key_here
                  </pre>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <div>
                  <strong>Restart the backend server:</strong>
                  <br />
                  Stop the server (Ctrl+C) and restart with <code className="bg-gray-100 px-2 py-1 rounded text-xs">npm start</code>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                <div>
                  <strong>You're all set!</strong>
                  <br />
                  All Auto.dev APIs will now be active and available
                </div>
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* API Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apis.map((api) => (
          <div
            key={api.name}
            className="bg-white rounded-lg shadow border border-gray-200 p-5 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-800 text-lg">{api.name}</h3>
              {getStatusBadge(api.status)}
            </div>

            <p className="text-sm text-gray-600 mb-4">{api.description}</p>

            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Features:</h4>
              <ul className="space-y-1">
                {api.features.map((feature, idx) => (
                  <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                    <svg className="w-3 h-3 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  {api.status === 'configured' ? api.envVar : `Requires: ${api.envVar}`}
                </span>
                <a
                  href={api.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Docs →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">API Status Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {apis.filter(a => a.status === 'configured').length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Active</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-400">
              {apis.filter(a => a.status === 'not-configured').length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Not Setup</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {apis.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Available</div>
          </div>
        </div>
      </div>

      {/* Pricing Info */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 text-lg mb-1">Auto.dev Free Tier</h4>
            <p className="text-sm text-gray-700 mb-2">
              Get started with 1,000 free API calls per month - no credit card required!
            </p>
            <ul className="text-xs text-gray-600 space-y-1 mb-3">
              <li>✓ Access to all APIs listed above</li>
              <li>✓ Real-time vehicle data</li>
              <li>✓ Perfect for up to ~30-50 daily submissions</li>
            </ul>
            <a
              href="https://www.auto.dev/pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Sign Up Free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
