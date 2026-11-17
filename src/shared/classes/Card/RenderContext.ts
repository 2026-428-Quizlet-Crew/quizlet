/**
 * The surroundings every render needs to know about. Custom cards run in an
 * iframe and can't see the app, so the host passes this in on every render.
 */
export type RenderContext = {
  theme: "light" | "dark";
  seed: number;
};
