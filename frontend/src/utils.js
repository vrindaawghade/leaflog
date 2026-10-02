export const daysSince = (date) =>
  Math.floor((Date.now() - new Date(date).getTime()) / 86400000);

export const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();