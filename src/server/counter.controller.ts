import { rpc } from '@deepkit/rpc';

@rpc.controller('counter')
export class CounterController {
  #value = 0;

  @rpc.action()
  get(): number {
    return this.#value;
  }

  @rpc.action()
  set(value: number): void {
    this.#value = value;
  }

  @rpc.action()
  increment(): number {
    return ++this.#value;
  }

  @rpc.action()
  decrement(): number {
    return --this.#value;
  }
}
