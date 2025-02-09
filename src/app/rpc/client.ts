import {
  InjectionToken,
  TransferState,
  inject,
  makeStateKey,
} from '@angular/core';
import {
  ControllerDefinition,
  RemoteController,
  RpcClient,
  RpcControllerState,
  RpcWebSocketClientAdapter,
} from '@deepkit/rpc';
import { uint8 } from '@deepkit/type';

import { deserializeActionResponse, serializeActionResponse } from './serde';

export const RPC_CLIENT = new InjectionToken<RpcClient>('RPC_CLIENT');

export const provideRpcClient = (url: string) => ({
  provide: RPC_CLIENT,
  useFactory() {
    const client = new NgRpcClient(new RpcWebSocketClientAdapter(url));
    client.setup(true);
    void client.connect();
    return client;
  },
});

export class NgRpcClient extends RpcClient {
  private isBrowser!: boolean;
  private transferState!: TransferState;

  setup(isBrowser: boolean) {
    this.isBrowser = isBrowser;
    this.transferState = inject(TransferState);
  }

  private actionCallIndex = -1;

  override controller<T>(
    nameOrDefinition: string | ControllerDefinition<T>,
    options: {
      timeout?: number;
      dontWaitForConnection?: true;
      typeReuseDisabled?: boolean;
    } = {},
  ): RemoteController<T> {
    const controller = new RpcControllerState(
      'string' === typeof nameOrDefinition
        ? nameOrDefinition
        : nameOrDefinition.path,
    );

    if ('undefined' === typeof options.typeReuseDisabled) {
      options.typeReuseDisabled = this.typeReuseDisabled;
    }

    return new Proxy(this, {
      get: (target, method: string) => {
        return async (...args: any[]) => {
          if (method === 'ngOnInit' || method === 'ngOnDestroy') return;
          const index = ++this.actionCallIndex;

          // TODO: serialize and add to transfer state
          const types =
            controller.getState(method)?.types ||
            (await this.actionClient.loadActionTypes(
              controller,
              method,
              options,
            ));

          const stateKey = makeStateKey<readonly uint8[]>(
            `${controller.controller}${method}${index}`,
          );

          if (this.isBrowser && this.transferState.hasKey(stateKey)) {
            return deserializeActionResponse(
              new Uint8Array(
                this.transferState.get<readonly uint8[]>(stateKey, []),
              ),
              types.resultSchema,
            );
          }

          const response = await this.actionClient.action(
            controller,
            method,
            args,
            options,
          );

          if (!this.isBrowser) {
            this.transferState.set(
              stateKey,
              Array.from(serializeActionResponse(response, types.resultSchema)),
            );
          }

          return response;
        };
      },
    }) as any as RemoteController<T>;
  }
}
