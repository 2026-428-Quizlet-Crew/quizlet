export abstract class Observable {
  private readonly listeners = new Set<() => void>();

  /** Arrow property so it can be passed around without losing `this`. Returns an unsubscribe function. */
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  protected notify(): void {
    for (const listener of this.listeners) listener();
  }
}
