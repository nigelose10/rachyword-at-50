"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import clsx from "clsx";

interface LockScreenProps {
  onUnlock: () => void;
}

const PASSCODE = "220000";

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (input.length === 6) {
      if (input === PASSCODE) {
        setUnlocked(true);
        setTimeout(() => {
          onUnlock();
        }, 800);
      } else {
        setError(true);
        controls.start({
          x: [-10, 10, -10, 10, -5, 5, 0],
          transition: { duration: 0.4 },
        });
        setTimeout(() => {
          setInput("");
          setError(false);
        }, 500);
      }
    }
  }, [input, controls, onUnlock]);

  const handleKeyPress = (num: string) => {
    if (input.length < 6 && !unlocked) {
      setInput((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    if (input.length > 0 && !unlocked) {
      setInput((prev) => prev.slice(0, -1));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl text-white font-sans"
    >
      <motion.div
        animate={controls}
        className="flex flex-col items-center w-full max-w-xs"
      >
        <div className="mb-8">
          {unlocked ? (
            <Unlock className="w-8 h-8 text-green-400" />
          ) : (
            <Lock className="w-8 h-8 text-white/50" />
          )}
        </div>
        
        <h2 className="text-xl font-medium mb-8">Enter Passcode</h2>

        <div className="flex gap-4 mb-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={clsx(
                "w-4 h-4 rounded-full border border-white/50 transition-all duration-200",
                {
                  "bg-white border-white": i < input.length,
                  "bg-transparent": i >= input.length,
                  "bg-red-500 border-red-500": error,
                  "bg-green-400 border-green-400": unlocked,
                }
              )}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-x-8 gap-y-6 w-full px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-2xl font-light mx-auto transition-colors focus:outline-none active:bg-white/30"
            >
              {num}
            </button>
          ))}
          <div className="w-16 h-16" /> {/* Empty spot for bottom left */}
          <button
            onClick={() => handleKeyPress("0")}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-2xl font-light mx-auto transition-colors focus:outline-none active:bg-white/30"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-16 h-16 flex items-center justify-center text-lg font-medium mx-auto text-white/70 hover:text-white transition-colors focus:outline-none active:scale-95"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
