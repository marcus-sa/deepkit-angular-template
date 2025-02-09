import { InjectionToken } from '@angular/core';
import { RemoteController } from '@deepkit/rpc';

import type { CounterController } from '../../server';
import { NgRpcClient, RPC_CLIENT } from './client';

export const COUNTER_CONTROLLER = new InjectionToken<
  RemoteController<CounterController>
>('COUNTER_CONTROLLER');

export const provideCounterController = () => ({
  provide: COUNTER_CONTROLLER,
  useFactory: (client: NgRpcClient) =>
    client.controller<CounterController>('counter'),
  deps: [RPC_CLIENT],
});
