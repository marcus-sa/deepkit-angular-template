import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
} from '@angular/ssr/node';
import { App } from '@deepkit/app';
import { ApplicationServer, FrameworkModule } from '@deepkit/framework';
import { HttpKernel, HttpRequest, HttpResponse } from '@deepkit/http';

import { setupRpcClient } from '../app/rpc/server';
import { environment } from '../environments/environment';
import { CounterController } from './counter.controller';
import { AngularServerListener } from './listener';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../../browser');

declare global {
  var server: ApplicationServer | undefined;
}

const app = new App({
  imports: [
    new FrameworkModule({
      publicDir: browserDistFolder,
      ...environment.server,
    }),
  ],
  controllers: [CounterController],
  providers: [AngularNodeAppEngine, AngularServerListener],
  listeners: [AngularServerListener],
});

if (global.server) {
  // Handle Vite reload
  global.server.close(true).then(() => app.run(['server:start']));
} else {
  void app.run(['server:start']);
}

const http = app.get<HttpKernel>();
global.server = app.get<ApplicationServer>();

// The request handler used by the Angular CLI (dev-server and during build).
export const reqHandler = createNodeRequestHandler(async (req, res) => {
  await setupRpcClient(global.server!, async () => {
    Object.setPrototypeOf(req, HttpRequest.prototype);
    Object.setPrototypeOf(res, HttpResponse.prototype);
    await http.handleRequest(req as HttpRequest, res as HttpResponse);
  });
});
