import { createRoot } from "react-dom/client";
import { Helmet } from 'react-helmet';
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <>
    <Helmet>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Montserrat:wght@500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet" />
    </Helmet>
    <App />
  </>
);
