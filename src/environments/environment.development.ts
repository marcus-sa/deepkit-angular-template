export const environment = {
  production: false,
  server: {
    port: 3030,
  },
  rpc: {
    url: 'ws://localhost:3030',
  },
} as const;
