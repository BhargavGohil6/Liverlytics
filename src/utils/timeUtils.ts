/**
 * Convert timestamp to relative time format
 * @param timestamp - ISO timestamp string (e.g., "2026-01-31 18:35:20")
 * @returns Relative time string (e.g., "2 hours ago", "1 day ago")
 */
export const formatRelativeTime = (timestamp: string): string => {
  if (!timestamp) return 'Just now';
  
  // Parse the timestamp - handle both formats: "2026-01-31 18:35:20" and ISO format
  const date = new Date(timestamp.replace(' ', 'T'));
  
  if (isNaN(date.getTime())) {
    return 'Just now';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Time units in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  // Handle future dates
  if (diffInSeconds < 0) {
    return 'Just now';
  }
  
  // Handle very recent (less than 1 minute)
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  // Handle minutes
  if (diffInSeconds < intervals.hour) {
    const minutes = Math.floor(diffInSeconds / intervals.minute);
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  }
  
  // Handle hours
  if (diffInSeconds < intervals.day) {
    const hours = Math.floor(diffInSeconds / intervals.hour);
    return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  }
  
  // Handle days
  if (diffInSeconds < intervals.week) {
    const days = Math.floor(diffInSeconds / intervals.day);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  // Handle weeks
  if (diffInSeconds < intervals.month) {
    const weeks = Math.floor(diffInSeconds / intervals.week);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  
  // Handle months
  if (diffInSeconds < intervals.year) {
    const months = Math.floor(diffInSeconds / intervals.month);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  
  // Handle years
  const years = Math.floor(diffInSeconds / intervals.year);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

/**
 * Format timestamp to readable date format
 * @param timestamp - ISO timestamp string
 * @returns Formatted date string (e.g., "Jan 31, 2026")
 */
export const formatDateTime = (timestamp: string): string => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp.replace(' ', 'T'));
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};