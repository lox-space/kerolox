import * as React from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Keplerian from "./routes/Keplerian";

const router = createHashRouter(
  [
    { path: "/", element: <Root /> },
    { path: "/keplerian", element: <Keplerian /> },
  ],
  { basename: "/planetarium" }
);

const theme = extendTheme({
  styles: {
    global: {
      "html, body, #root": {
        height: "100%",
      },
    },
  },
});

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
