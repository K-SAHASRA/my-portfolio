"use client";

import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingEmojis = ["💬", "🤖", "✨"];

export default function AskMyResume() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [emojiIndex, setEmojiIndex] = useState(0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setAnswer("");

    const emojiInterval = setInterval(() => {
      setEmojiIndex((prev) => (prev + 1) % loadingEmojis.length);
    }, 450);

    try {
      const response = await fetch("/api/ask-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: question,
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = (await response.json()) as { answer?: string };
      setAnswer(data.answer ?? "I could not think of a response just now.");
    } catch (error) {
      setAnswer(
        "Something went sideways. Try again in a moment or send me a message directly."
      );
    } finally {
      clearInterval(emojiInterval);
      setLoading(false);
    }
  };

  return (
    <section
      id="ask"
      className="max-w-3xl mx-auto px-6 py-24 space-y-10 text-center"
    >
      <div className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Ask My Resume
        </h2>
        <p className="text-base md:text-lg text-muted-foreground">
          Are you a recruiter? A friend too curious? Got questions? Ask my
          resume.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        aria-label="Ask My Resume form"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          <div className="flex w-full max-w-2xl rounded-xl border border-border bg-background px-4 py-2 shadow-sm focus-within:border-primary">
            <input
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about my experience, research, cloud work..."
              className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
              aria-label="Ask a question about my resume"
            />
            <button
              type="submit"
              className="ml-3 whitespace-nowrap rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              Ask
            </button>
          </div>
        </div>
      </form>

      <div className="min-h-[120px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="flex flex-col items-center gap-3 text-lg text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                key={emojiIndex}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
                className="text-3xl"
              >
                {loadingEmojis[emojiIndex]}
              </motion.span>
              <motion.span
                className="text-base font-medium text-foreground"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                Thinking…
              </motion.span>
            </motion.div>
          ) : answer ? (
            <motion.div
              key="answer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="rounded-2xl border border-border bg-card/80 p-6 text-left shadow-sm"
            >
              <p className="text-lg text-foreground">{answer}</p>
            </motion.div>
          ) : (
            <motion.p
              key="placeholder"
              className="text-base text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
