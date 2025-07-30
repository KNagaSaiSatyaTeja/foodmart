// ✅ Correct way (define the prop type manually)
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

import type { ThemeProviderProps } from "next-themes";

interface Props extends Omit<ThemeProviderProps, "children"> {
  children: ReactNode;
}

export function ThemeProvider({ children, ...props }: Props) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
