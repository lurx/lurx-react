import 'react';

declare module 'react' {
  interface CSSProperties {
    // Allows any property key starting with '--'
    [key: `--${string}`]: Optional<string | number>;
  }
}
