import {
  AngularNodeAppEngine,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import { eventDispatcher } from '@deepkit/event';
import {
  HttpNotFoundError,
  HttpRequest,
  HttpResponse,
  RouteConfig,
  httpWorkflow,
} from '@deepkit/http';
import { InjectorContext } from '@deepkit/injector';

export class AngularServerListener {
  constructor(
    private readonly ngApp: AngularNodeAppEngine,
    private readonly injector: InjectorContext,
  ) {}

  async render(req: HttpRequest, res: HttpResponse) {
    const response = await this.ngApp.handle(req);
    if (!response) throw new HttpNotFoundError();
    await writeResponseToNodeResponse(response, res);
  }

  @eventDispatcher.listen(httpWorkflow.onRoute, 101)
  async onRoute(event: typeof httpWorkflow.onRoute.event): Promise<void> {
    if (event.response.headersSent || event.route) return;
    event.routeFound(
      new RouteConfig('angular', ['GET'], event.url, {
        type: 'controller',
        controller: AngularServerListener,
        module: this.injector.rootModule,
        methodName: 'render',
      }),
      () => ({
        arguments: [event.request, event.response],
        parameters: {},
      }),
    );
  }
}
