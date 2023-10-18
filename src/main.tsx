import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

const supabase = createClient(
  "https://lgrmifmqxxkzyvmvecxq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxncm1pZm1xeHhrenl2bXZlY3hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1OTc2NjMsImV4cCI6MjAxMzE3MzY2M30.5WNOzC-6pmLWpEYObjUxJZZoJmjPOVtrVpwHaYvwu3s"
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);
