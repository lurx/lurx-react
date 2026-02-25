import type { LOGO_SIZES } from "./logo.constants";

export type LogoProps = {
  animated?: boolean;
  size?: ExtractObjectKeys<typeof LOGO_SIZES>
}
