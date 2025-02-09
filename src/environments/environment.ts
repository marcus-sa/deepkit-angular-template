export const environment = {
  production: true,
  server: {
    port: 3030,
  },
  rpc: {
    url: document.location.origin,
  },
} as const;
