"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import LockScreen from "../components/LockScreen";
import InteractiveMenu from "../components/InteractiveMenu";
import { SeatingChart } from "../components/SeatingChart";

type ViewState = 'locked' | 'menu' | 'seating';

export default function Home() {
  const [view, setView] = useState<ViewState>('locked');

  return (
    <main className="min-h-screen bg-black">
      <AnimatePresence>
        {view === 'locked' && (
          <LockScreen key="lockscreen" onUnlock={() => setView('menu')} />
        )}
      </AnimatePresence>
      
      {view === 'menu' && <InteractiveMenu onNavigateToSeating={() => setView('seating')} />}
      {view === 'seating' && <SeatingChart onBack={() => setView('menu')} />}
    </main>
  );
}
