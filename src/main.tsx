import { createRoot } from "react-dom/client";
import App from "./apps/App.tsx";
import "./apps/index.css";

createRoot(document.getElementById("root")!).render(<App />);
