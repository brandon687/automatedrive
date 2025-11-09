// Simple hook to parse URL parameters without react-router
export function useParams() {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);

  // For routes like /submission/:ticketNumber
  if (segments[0] === 'submission' && segments[1]) {
    return { ticketNumber: segments[1] };
  }

  return {};
}
