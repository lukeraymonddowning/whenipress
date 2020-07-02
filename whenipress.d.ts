declare module 'whenipress' {
    type Handler = (event?: Event) => void;

    type WhenIPressPlugin = Partial<{
      mounted: (globalInstance: PendingKeyboardEventManager) => void;
      bindingRegistered: (binding: string[], globalInstance: PendingKeyboardEventManager) => void;
      bindingStopped: (binding: string[], globalInstance: PendingKeyboardEventManager) => void;
      allBindingsStopped: (globalInstance: PendingKeyboardEventManager) => void;
      beforeBindingHandled: (binding: string[], globalInstance: PendingKeyboardEventManager) => boolean | void;
      afterBindingHandled: (binding: string[], globalInstance: PendingKeyboardEventManager) => void;
    }>
    
    class PendingKeyboardEvent {
      constructor(manager: PendingKeyboardEventManager, ...keys: string[]);
      then(handler: Handler): this;
      do(handler: Handler): this;
      run(handler: Handler): this;
      whenReleased(handler: Handler): this;
      once(): this;
      twiceRapidly(timeout?: number): this;
      evenOnForms(): this;
      whileFocusIsWithin(element: string | Element): this;
      stop(): void;
      createKeyDownHandler(handler: Handler): void;
      createKeyUpHandler(handler: Handler): void;
    }

    class PendingKeyboardEventManager {
      registerFocusListeners(): void;
      register(...keys: string[]): PendingKeyboardEvent;
      group(keys: string | string[], handler: Handler): void;
      use(...plugins: WhenIPressPlugin[]): void;
      pluginWithOptions<T extends object>(plugin: WhenIPressPlugin, options: T): {
        plugin: WhenIPressPlugin;
        options: T;
      }
      flushPlugins(): void;
      bindings(): string[][];
      stopAll(): void;
    }
    
    export default function whenipress(): PendingKeyboardEventManager;
    export default function whenipress(...keys: string[]): PendingKeyboardEvent;
}
