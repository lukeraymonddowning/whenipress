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

    type WhenIPressPluginOptions = Partial<{
      urlsToSkip: string[];
      skipAllUrls: boolean;
    }>
    
    class PendingKeyboardEvent {
      constructor(manager: PendingKeyboardEventManager, ...keys: string[]);
      then(handler: Handler): this;
      do(handler: Handler): this;
      run(handler: Handler): this;
      whenReleased(handler: Handler): this;
      once(): this;
      twiceRapidly(timeout?: number): this;
      stop(): void;
      createKeyDownListener(handler: Handler): void;
      removeKeyDownListener(): void;
      createKeyUpListener(handler: Handler): void;
      removeKeyUpListener(): void;
    }

    class PendingKeyboardEventManager {
      registerFocusListeners(): void;
      register(...keys: string[]): PendingKeyboardEvent;
      group(keys: string | string[], handler: Handler): void;
      use(...WhenIPressPlugins: WhenIPressPlugin[]): void;
      pluginWithOptions(WhenIPressPlugin: WhenIPressPlugin, options: WhenIPressPluginOptions): {
        WhenIPressPlugin: WhenIPressPlugin;
        options: WhenIPressPluginOptions;
      }
      flushPlugins(): void;
      bindings(): string[][];
      stopAll(): void;
    }
    
    export default function whenipress(): PendingKeyboardEventManager;
    export default function whenipress(...keys: string[]): PendingKeyboardEvent;
}
