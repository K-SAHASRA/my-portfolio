"use client";

import { Github, Linkedin, Mail } from "lucide-react";

const contactActions = [
  {
    label: "Email",
    href: "mailto:sk5652@columbia.edu",
    description:
      "Prefer direct conversations? Drop a note and I will reply soon.",
    icon: Mail,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sahasra-kokkula-03b729225/",
    description:
      "Connect to follow research updates and upcoming collaborations.",
    icon: Linkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/K-SAHASRA",
    description: "Explore my latest experiments, research repos, and open source work.",
    icon: Github,
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="max-w-6xl mx-auto px-6 py-24 space-y-10 text-center"
    >
      <div className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Contact Me
        </h2>
        
         <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground">
           Pick the option that works best for you.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {contactActions.map(({ label, href, description, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
            className="group rounded-2xl border border-border bg-card/80 p-8 text-left shadow-sm transition hover:border-primary hover:shadow-lg"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background transition group-hover:border-primary group-hover:text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary">
              {label}
            </h3>
            <p className="mt-3 text-base font-medium text-foreground">
              {description}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
