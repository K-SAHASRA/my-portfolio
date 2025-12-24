"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Project = {
  title: string;
  description: string;
  image: string;
  link: string;
  githubRepo: string;
};

// Update this list to control which GitHub projects are featured first.
const highlightedRepoSlugs = [
  "K-SAHASRA/Face-Detection-OpenCV",
  "K-SAHASRA/Graphical-Neural-Network-Modelling",
  "K-SAHASRA/JSON-crud-Framework",
  "K-SAHASRA/MindSync-A-Mental-Health-Application",
  "K-SAHASRA/LeadGen-AI-Tool",
  "NandavardhanRadhakrishnan/Palisade",
];

const projectCatalog: Project[] = [
  {
    title: "Face Detection with OpenCV",
    description:
      "Real-time facial detection pipeline using Haar cascades and OpenCV, packaged for quick experimentation.",
    image: "https://opengraph.githubassets.com/1/K-SAHASRA/Face-Detection-OpenCV",
    link: "https://github.com/K-SAHASRA/Face-Detection-OpenCV",
    githubRepo: "K-SAHASRA/Face-Detection-OpenCV",
  },
  {
    title: "Graphical Neural Network Modelling",
    description:
      "Explores neural network behavior through interactive graph visualizations and modular architecture experiments.",
    image:
      "https://opengraph.githubassets.com/1/K-SAHASRA/Graphical-Neural-Network-Modelling",
    link: "https://github.com/K-SAHASRA/Graphical-Neural-Network-Modelling",
    githubRepo: "K-SAHASRA/Graphical-Neural-Network-Modelling",
  },
  {
    title: "JSON-CRUD Framework",
    description:
      "A no-code JSON framework that auto-generates backend endpoints, database tables, and Bootstrap-based UI from a schema.",
    image: "https://opengraph.githubassets.com/1/K-SAHASRA/JSON-crud-Framework",
    link: "https://github.com/K-SAHASRA/JSON-crud-Framework",
    githubRepo: "K-SAHASRA/JSON-crud-Framework",
  },
  {
    title: "MindSync Mental Health App",
    description:
      "Mobile-first mental wellness companion with journaling, mindfulness prompts, and progress tracking features.",
    image:
      "https://opengraph.githubassets.com/1/K-SAHASRA/MindSync-A-Mental-Health-Application",
    link: "https://github.com/K-SAHASRA/MindSync-A-Mental-Health-Application",
    githubRepo: "K-SAHASRA/MindSync-A-Mental-Health-Application",
  },
  {
    title: "LeadGen AI Tool",
    description:
      "AI-assisted lead generation workflow combining enrichment, scoring, and outreach automation.",
    image: "https://opengraph.githubassets.com/1/K-SAHASRA/LeadGen-AI-Tool",
    link: "https://github.com/K-SAHASRA/LeadGen-AI-Tool",
    githubRepo: "K-SAHASRA/LeadGen-AI-Tool",
  },
  {
    title: "Palisade Cryptography Suite",
    description:
      "Homomorphic encryption experiments leveraging PALISADE for privacy-preserving analytics.",
    image:
      "https://opengraph.githubassets.com/1/NandavardhanRadhakrishnan/Palisade",
    link: "https://github.com/NandavardhanRadhakrishnan/Palisade",
    githubRepo: "NandavardhanRadhakrishnan/Palisade",
  },
];

export default function Projects() {
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [activePage, setActivePage] = useState(0);

  const sortedProjects = useMemo(() => {
    const priorityByRepo = new Map(
      highlightedRepoSlugs.map((slug, idx) => [slug, idx])
    );

    return [...projectCatalog].sort((a, b) => {
      const aPriority = a.githubRepo
        ? priorityByRepo.get(a.githubRepo) ?? Number.MAX_SAFE_INTEGER
        : Number.MAX_SAFE_INTEGER;
      const bPriority = b.githubRepo
        ? priorityByRepo.get(b.githubRepo) ?? Number.MAX_SAFE_INTEGER
        : Number.MAX_SAFE_INTEGER;

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      return projectCatalog.indexOf(a) - projectCatalog.indexOf(b);
    });
  }, []);

  useEffect(() => {
    const updateSlidesPerView = () => {
      setSlidesPerView(window.innerWidth >= 1024 ? 2 : 1);
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);

    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  const pageCount = Math.max(
    1,
    Math.ceil(sortedProjects.length / slidesPerView)
  );

  useEffect(() => {
    setActivePage((prev) => Math.min(prev, pageCount - 1));
  }, [pageCount]);

  const goToPrevious = () => {
    setActivePage((prev) => (prev === 0 ? pageCount - 1 : prev - 1));
  };

  const goToNext = () => {
    setActivePage((prev) => (prev === pageCount - 1 ? 0 : prev + 1));
  };

  const hasMultiplePages = pageCount > 1;

  return (
    <section id="projects" className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Projects
      </h2>

      <div className="relative">
        <button
          type="button"
          onClick={goToPrevious}
          disabled={!hasMultiplePages}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Previous projects"
        >
          Prev
        </button>

        <div className="overflow-hidden px-10">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activePage * 100}%)` }}
          >
            {sortedProjects.map((proj) => (
              <div
                key={proj.title}
                className="w-full flex-shrink-0 px-4 md:w-1/2"
              >
                <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
                  <div className="relative h-52 w-full">
                    <Image
                      src={proj.image}
                      alt={proj.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col space-y-3 p-6">
                    <h3 className="text-xl font-semibold">{proj.title}</h3>
                    <p className="text-muted-foreground">{proj.description}</p>
                    <Link
                      href={proj.link}
                      target="_blank"
                      className="mt-auto inline-block text-sm font-medium text-primary hover:underline"
                    >
                      View Project →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={goToNext}
          disabled={!hasMultiplePages}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Next projects"
        >
          Next
        </button>
      </div>

      {pageCount > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          {Array.from({ length: pageCount }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActivePage(idx)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                idx === activePage ? "bg-primary" : "bg-border"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
