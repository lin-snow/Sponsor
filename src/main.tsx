import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { Sponsor } from "./Sponsor";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Sponsor />
  </StrictMode>,
);
