"use client";

import { motion, MotionProps } from "framer-motion";
import { useEffect, useState } from "react";

interface TypingAnimationProps extends MotionProps {
  lines: string[]; // Array of strings to animate
  className?: string;
  duration?: number; // Speed of typing per character (in ms)
  delay?: number; // Initial delay before starting animation
  eraseSpeed?: number; // Speed of erasing per character (in ms)
  pauseBetweenLines?: number; // Pause after typing a line (in ms)
}

export function TypingAnimation({
  lines,
  className,
  duration = 100,
  delay = 0,
  eraseSpeed = 50,
  pauseBetweenLines = 1000,
  ...props
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [phase, setPhase] = useState<"typing" | "erasing" | "pausing">("typing");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Introduce initial delay if specified
    if (delay > 0) {
      timeoutId = setTimeout(() => {
        setPhase("typing");
      }, delay);
    } else {
      setPhase("typing");
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [delay]);

  useEffect(() => {
    const animate = () => {
      const currentText = lines[currentLine];

      if (phase === "typing") {
        if (displayedText.length < currentText.length) {
          setDisplayedText(currentText.substring(0, displayedText.length + 1));
        } else {
          setTimeout(() => setPhase("erasing"), pauseBetweenLines); // Pause before erasing
        }
      } else if (phase === "erasing") {
        if (displayedText.length > 1) {
          // Stop erasing when only one character remains
          setDisplayedText(currentText.substring(0, displayedText.length - 1));
        } else {
          // Move to the next line or reset to the first line
          setCurrentLine((prev) => (prev + 1) % lines.length);
          setPhase("typing"); // Start typing the next line
        }
      }
    };

    const interval = setInterval(
      animate,
      phase === "typing" ? duration : phase === "erasing" ? eraseSpeed : pauseBetweenLines
    );

    return () => clearInterval(interval);
  }, [
    lines,
    displayedText,
    phase,
    currentLine,
    duration,
    eraseSpeed,
    pauseBetweenLines,
  ]);

  return (
    <motion.div
      className={`bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 animate-rainbow text-4xl font-bold leading-[5rem] tracking-[-0.02em] ${className}`}
      {...props}
    >
      {displayedText}
    </motion.div>
  );
}