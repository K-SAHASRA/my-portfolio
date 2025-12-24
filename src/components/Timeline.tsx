"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const milestones = [
  {
    year: "2021",
    emoji: "🎓",
    title: "High School Graduation",
    subtitle: "Scored 98% (Maths, Physics, Chemistry, Sanskrit)",
  },
  {
    year: "2021–2025",
    emoji: "💻",
    title:
      "B.Tech in Computer Science, SRM Institute of Science & Technology",
    subtitle:
      "Specialized in Cloud Computing | 3-year Merit Scholarship; mastered COA, OS, OODP, DSA, DAA",
  },
  {
    year: "2023",
    emoji: "🧠",
    title: "TinyML & Edge Research | NatWest Internship Cracked",
    subtitle:
      "Published paper on TinyML & Edge Computing | Cracked first corporate internship at NatWest",
  },
  {
    year: "2024",
    emoji: "🌍",
    title: "Global Research Fellowship - Mitacs",
    subtitle:
      "Worked under Prof. Marin Litoiu (Top 2% researcher worldwide) in Toronto",
  },
  {
    year: "2025",
    emoji: "🏅",
    title: "Graduated - SRM Institute of Science & Technology",
    subtitle:
      "Graduated with Distinction, Secured 3rd Rank in the University, and Awarded a Medal for Academic Excellence",
  },
  {
    year: "2025–Present",
    emoji: "🧑‍🏫",
    title: "M.S. in Computer Science, Columbia University",
    subtitle:
      "Research under Prof. Corey Toler-Franklin | Studying Neural Networks, LLMs, NLP | TA for Cloud Computing",
  },
];

export default function MinimalTimeline() {
  const [active, setActive] = useState(0);

  return (
    <section className="max-w-6xl mx-auto px-6 py-24 text-center space-y-12">
      {/* Heading */}
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-foreground"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Journey at a Glance
      </motion.h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="h-[3px] w-full rounded-full bg-border" />

        {/* Milestone dots */}
        <div className="absolute inset-0 flex items-center justify-between px-6 md:px-12">
          {milestones.map((milestone, index) => {
            const isActive = active === index;
            return (
              <motion.button
                key={milestone.year}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                type="button"
                className="relative flex flex-col items-center focus:outline-none"
              >
                <motion.div
                  className="h-4 w-4 rounded-full border-[3px] border-primary bg-background shadow-md transition"
                  animate={{ scale: isActive ? 1.15 : 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.div
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute -z-10 h-10 w-10 rounded-full bg-primary/20 blur-lg"
                />
              </motion.button>
            );
          })}
        </div>

        {/* Headline display */}
        <div className="mt-36 md:mt-44 flex min-h-[10rem] flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={milestones[active].year}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-3 text-center"
            >
              <p className="text-base font-medium text-primary">
                {milestones[active].year} {milestones[active].emoji}
              </p>
              <h3 className="text-2xl md:text-3xl font-semibold text-foreground">
                {milestones[active].title}
              </h3>
              <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground">
                {milestones[active].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
