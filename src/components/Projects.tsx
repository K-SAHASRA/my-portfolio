"use client";

import Image from "next/image";
import Link from "next/link";

type Project = {
  title: string;
  description: string;
  image: string;
  link: string;
};

const projects: Project[] = [
  {
    title: "JSON-CRUD Framework",
    description:
      "A no-code JSON framework that auto-generates backend endpoints, database tables, and Bootstrap-based frontend from a schema.",
    image: "/images/json-crud.png", // put a screenshot in public/images
    link: "https://github.com/sahasra-kokkula/JSON-crud-Framework",
  },
  {
    title: "Tiny-ML Gesture Classification",
    description:
      "Deployed a lightweight ML model for pugilism sport gestures, proving edge efficiency over heavy computer vision pipelines.",
    image: "/images/tinyml.png",
    link: "https://doi.org/10.xxxxx", // link to your published paper or GitHub
  },
  {
    title: "Blockchain + Digital Twin Consensus",
    description:
      "Research on integrating blockchain with intelligent transportation systems using digital twins for secure consensus.",
    image: "/images/blockchain.png",
    link: "https://link-to-paper-or-project",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Projects
      </h2>

      <div className="grid gap-10 md:grid-cols-2">
        {projects.map((proj, idx) => (
          <div
            key={idx}
            className="rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow"
          >
            <div className="relative w-full h-52">
              <Image
                src={proj.image}
                alt={proj.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-semibold">{proj.title}</h3>
              <p className="text-muted-foreground">{proj.description}</p>
              <Link
                href={proj.link}
                target="_blank"
                className="inline-block mt-2 text-primary hover:underline text-sm font-medium"
              >
                View Project →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
