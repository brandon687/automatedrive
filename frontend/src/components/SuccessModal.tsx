interface SuccessModalProps {
  ticketNumber: string;
  vehicleInfo: {
    year?: number;
    make?: string;
    model?: string;
  } | null;
}

export default function SuccessModal({
  ticketNumber,
  vehicleInfo,
}: SuccessModalProps) {
  const shareUrl = `${window.location.origin}${window.location.pathname}`;
  const shareText = `I just got my vehicle appraised with DealerTrade! Get your quote too: ${shareUrl}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center">
        <svg
          className="w-10 h-10 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Submission Received!
        </h2>
        <p className="text-gray-600">
          We've received your vehicle information and will get back to you soon.
        </p>
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <p className="text-sm text-gray-600 mb-2">Your Submission Number</p>
        <p className="text-3xl font-bold text-blue-600 mb-2">{ticketNumber}</p>
        {vehicleInfo && (
          <p className="text-gray-700">
            {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
          </p>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700 mb-3">
          <strong>What happens next?</strong>
        </p>
        <ol className="text-left text-sm text-gray-600 space-y-2">
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-center mr-2 flex-shrink-0">
              1
            </span>
            <span>Our team reviews your submission</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-center mr-2 flex-shrink-0">
              2
            </span>
            <span>We forward to our dealer partners</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-center mr-2 flex-shrink-0">
              3
            </span>
            <span>Dealers submit their best quotes</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-center mr-2 flex-shrink-0">
              4
            </span>
            <span>We'll email you with the offers</span>
          </li>
        </ol>
      </div>

      <div className="border-t pt-6">
        <p className="text-sm text-gray-700 mb-3">
          <strong>Know someone else who wants to sell their car?</strong>
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Share this link and help them get a great quote too!
        </p>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Copy Share Link
          </button>
          <button
            onClick={() => {
              const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                shareText
              )}`;
              window.open(url, '_blank');
            }}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Tweet
          </button>
        </div>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        Submit Another Vehicle
      </button>
    </div>
  );
}
