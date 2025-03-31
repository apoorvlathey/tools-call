"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ReactNode } from "react";
import { ColorModeProvider } from "../components/ui/color-mode";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider defaultTheme="dark">{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
