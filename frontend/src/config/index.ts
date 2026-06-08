// Frontend environment configuration
export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'AmaniYield',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Agricultural marketplace',
    version: '1.0.0',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export default config;
