"use client";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-32 space-y-6">
      {/* Name */}
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
        Sahasra Kokkula
      </h1>

      {/* Tagline */}
      <p className="text-xl md:text-2xl font-light text-muted-foreground max-w-2xl">
        Building scalable systems • Optimizing performance
      </p>

      {/* Call-to-Action buttons */}
      <div className="flex gap-6 pt-6">
        <a
          href="#projects"
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          View Projects
        </a>
        <a
          href="#contact"
          className="px-6 py-3 rounded-lg border hover:bg-muted transition"
        >
          Contact Me
        </a>
      </div>
    </section>
  );
}
