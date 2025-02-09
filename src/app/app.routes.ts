import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { IndexPage } from './pages';
import { COUNTER_CONTROLLER } from './rpc/providers';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    resolve: {
      counter: () => inject(COUNTER_CONTROLLER).get(),
    },
    component: IndexPage,
  },
];
