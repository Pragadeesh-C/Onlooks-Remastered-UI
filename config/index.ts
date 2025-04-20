export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://100.88.129.33:8000',
  env: process.env.NODE_ENV || 'development',
  appName: 'Onlooks',
  appDescription: 'Student Dropout Prediction System',
  defaultLocale: 'en',
} as const;

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_API_URL && process.env.NODE_ENV === 'production') {
  console.warn('Warning: NEXT_PUBLIC_API_URL is not set in production environment');
} 