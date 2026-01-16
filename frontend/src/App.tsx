// App.tsx
// Main router container for the Farcaster Mini-App.
// Defines routes and wraps everything with the shared Layout.

import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { sdk } from "@farcaster/miniapp-sdk";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Guestbook from "./pages/Guestbook";
import HowItWorks from "./pages/HowItWorks";

export default function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="guestbook" element={<Guestbook />} />
        <Route path="howitworks" element={<HowItWorks />} />
      </Route>
    </Routes>
  );
}
