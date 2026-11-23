"use client";

import { useState, useEffect } from "react";

export default function Footer() {
  // Read the year on the client only, so the server prerender stays stable
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer className="mt-auto border-t border-border py-6 text-center text-sm text-muted">
      <p>© {year} PyLearner — Learn Python for free.</p>
    </footer>
  );
}
