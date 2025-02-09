import { sign } from 'node:crypto';
import {
  Component,
  computed,
  effect,
  inject,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { COUNTER_CONTROLLER } from '../rpc/providers';

@Component({
  selector: 'app-index-page',
  template: `
    <button (click)="decrement()">-</button>
    <input [(ngModel)]="counter" (ngModelChange)="set($any($event))" type="number" />
    <button (click)="increment()">+</button>
  `,
  styles: `
    input {
      width: 30px;
    }
  `,
  imports: [FormsModule],
})
export class IndexPage {
  route = inject(ActivatedRoute);
  counter = model<number>(this.route.snapshot.data.counter);
  #counter = inject(COUNTER_CONTROLLER);

  async set(value: number) {
    await this.#counter.set(value);
  }

  async increment() {
    this.counter.set(await this.#counter.increment());
  }

  async decrement() {
    this.counter.set(await this.#counter.decrement());
  }
}
