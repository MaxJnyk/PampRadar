// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' ? '/api' : 'https://launch.meme/api',
  WS_URL: 'wss://launch.meme/connection/websocket',
  JWT_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJpYXQiOjE3NTcxNjY4ODh9.VEvlNmvIFS3ARM5R0jlNN4fwDDRz94WnKv8LDmtipNE',
} as const;

// UI Colors
export const COLORS = {
  background: '#0E1422',
  primary: '#674EEA',
  success: '#42BABE',
  danger: '#D53D4C',
  grey: {
    dark: '#1B212F',
    medium: '#2A3646',
    light: '#A4A8B9',
  },
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 50,
  DEFAULT_OFFSET: 0,
} as const;
