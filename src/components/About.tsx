// src/components/About.tsx
"use client";

import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="max-w-5xl mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Photo */}
        <div className="flex-shrink-0">
          <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border border-border bg-card">
            <Image
              src="/images/profile.jpeg"
              alt="Portrait of Sahasra Kokkula"
              width={560}
              height={560}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>

        {/* Text */}
        <div className="text-center md:text-left max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Sahasra Kokkula</h2>
          <p className="text-lg md:text-xl font-light text-muted-foreground mb-4">
             Columbia CS grad. Backend in the cloud, ML in the lab, full-stack on the screen and just crazy enough to love it all.
          </p>

          {/* Tech badges */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
            {[
              "PyTorch",
              "GNNs",
              "Node.js",
              "Prisma",
              "Next.js",
              "React",
            ].map((t) => (
              <span
                key={t}
                className="text-sm px-3 py-1 rounded-full border border-border text-muted-foreground font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
