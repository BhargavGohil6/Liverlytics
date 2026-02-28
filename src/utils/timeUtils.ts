/**
 * Convert timestamp to relative time format or parse duration string
 * @param timestampOrDuration - Either ISO timestamp string (e.g., "2026-01-31 18:35:20") or duration string (e.g., "00:00:01" or "3 days")
 * @returns Relative time string (e.g., "2 hours ago", "1 day ago", "3 days", etc.)
 */
export const formatRelativeTime = (timestampOrDuration: string): string => {
  if (!timestampOrDuration) return 'Just now';
  
  // Check if it's a duration in format like "00:00:01" or "3 days"
  if (isDurationFormat(timestampOrDuration)) {
    return parseDurationString(timestampOrDuration);
  }
  
  // Parse the timestamp - handle both formats: "2026-01-31 18:35:20" and ISO format
  const date = new Date(timestampOrDuration.replace(' ', 'T'));
  
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
 * Check if the input string is in duration format
 * @param str - String to check
 * @returns True if it matches duration format
 */
const isDurationFormat = (str: string): boolean => {
  // Check for HH:MM:SS format
  if (/^\d{2}:\d{2}:\d{2}$/.test(str)) {
    return true;
  }
  
  // Check for format like "X days", "X hours", etc.
  if (/^\d+\s+(day|days|hour|hours|minute|minutes|second|seconds|week|weeks|month|months|year|years)$/i.test(str)) {
    return true;
  }
  
  return false;
};

/**
 * Parse duration string and return human-readable format
 * @param duration - Duration string in format like "00:00:01" or "3 days"
 * @returns Human-readable duration string
 */
const parseDurationString = (duration: string): string => {
  // Handle HH:MM:SS format
  if (/^\d{2}:\d{2}:\d{2}$/.test(duration)) {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    
    if (hours > 0) {
      return `${hours} hr${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${minutes} min${minutes > 1 ? 's' : ''}`;
    } else {
      return `${seconds} sec${seconds > 1 ? 's' : ''}`;
    }
  }
  
  // Return the duration string as-is if it's in "X days" format
  return duration;
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