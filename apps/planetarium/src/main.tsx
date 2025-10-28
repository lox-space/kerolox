import * as React from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root";
import Keplerian from "./routes/Keplerian";
import WasmDemo from "./routes/WasmDemo";
import "./index.css";

const router = createHashRouter([
  { path: "/", element: <Root /> },
  { path: "/keplerian", element: <Keplerian /> },
  { path: "/wasm-demo", element: <WasmDemo /> },
]);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
