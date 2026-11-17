/**
 * Any value that survives `JSON.stringify` and `postMessage`: everything a card
 * stores, exports, or sends across the iframe boundary.
 *
 * Object shapes must be declared with `type`, not `interface`. Interfaces have
 * no index signature, so TypeScript won't accept them as `Json`.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json | undefined };
