import { AsyncLocalStorage } from 'node:async_hooks';
import { ApplicationServer } from '@deepkit/framework';

import { NgRpcClient, RPC_CLIENT } from './client';

declare global {
  var rpcClientStore: AsyncLocalStorage<NgRpcClient>;
}

// we can't add providers to angular in server
global.rpcClientStore ??= new AsyncLocalStorage<NgRpcClient>();

export const provideRpcClient = () => ({
  provide: RPC_CLIENT,
  useFactory() {
    const client = global.rpcClientStore.getStore();
    if (!client) {
      throw new Error('Missing server rpc client');
    }
    client.setup(false);
    return client;
  },
});

export const setupRpcClient = async (
  server: ApplicationServer,
  callback: () => Promise<void>,
) => {
  const rpcClient = server.createClient();
  Object.setPrototypeOf(rpcClient, NgRpcClient.prototype);
  await global.rpcClientStore.run(rpcClient as NgRpcClient, callback);
};
