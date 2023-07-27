import "@src/styles/global.css";

import React from "react";
import ReactDOM from "react-dom/client";
import Index from "@pages/index";
import { Toaster } from "@ui/toster";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Index />
    <Toaster />
  </React.StrictMode>
);
