"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence, useCycle } from "framer-motion";

const values = ["DOCUMENTs", "PDFs", "MS WORDs", "IMAGEs", "TEXTs", "LINKs"];

export const MainDialog = () => {
  const [currentValue, cycleValue] = useCycle(...values);

  useEffect(() => {
    const interval_id = setInterval(() => {
      cycleValue();
    }, 2000);

    return () => clearInterval(interval_id);
  }, [cycleValue]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="overflow-hidden text-center text-5xl font-extrabold leading-none tracking-wide text-primary drop-shadow-md md:text-[63px] lg:text-left"
        key={currentValue}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {currentValue}
      </motion.div>
    </AnimatePresence>
  );
};
