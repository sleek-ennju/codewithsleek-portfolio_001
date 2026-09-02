export const TECHNOLOGY_CATEGORIES = [
  "Core web",
  "Frontend",
  "Styling and UI",
  "State and data",
  "Backend and APIs",
  "Databases",
  "Testing and quality",
  "Motion and design",
  "Integrations",
  "Tooling and delivery",
] as const;

export type TechnologyCategory = (typeof TECHNOLOGY_CATEGORIES)[number];

export type LibraryTechnology = {
  name: string;
  category: TechnologyCategory;
  icon: string;
};

export const TECHNOLOGY_LIBRARY: readonly LibraryTechnology[] = [
  { name: "HTML5", category: "Core web", icon: "html5" },
  { name: "CSS3", category: "Core web", icon: "css3" },
  { name: "JavaScript", category: "Core web", icon: "javascript" },
  { name: "TypeScript", category: "Core web", icon: "typescript" },

  { name: "React", category: "Frontend", icon: "react" },
  { name: "Next.js", category: "Frontend", icon: "nextjs" },

  { name: "Tailwind CSS", category: "Styling and UI", icon: "tailwind" },
  { name: "Sass", category: "Styling and UI", icon: "sass" },
  { name: "Material UI", category: "Styling and UI", icon: "mui" },
  { name: "shadcn/ui", category: "Styling and UI", icon: "shadcn" },

  { name: "Redux Toolkit", category: "State and data", icon: "redux" },
  { name: "Zustand", category: "State and data", icon: "zustand" },
  { name: "TanStack Query", category: "State and data", icon: "tanstack-query" },

  { name: "Node.js", category: "Backend and APIs", icon: "nodejs" },
  { name: "Express.js", category: "Backend and APIs", icon: "express" },
  { name: "REST APIs", category: "Backend and APIs", icon: "rest" },
  { name: "GraphQL", category: "Backend and APIs", icon: "graphql" },
  { name: "WebSockets", category: "Backend and APIs", icon: "websockets" },

  { name: "PostgreSQL", category: "Databases", icon: "postgresql" },
  { name: "MongoDB", category: "Databases", icon: "mongodb" },
  { name: "Prisma", category: "Databases", icon: "prisma" },
  { name: "Mongoose", category: "Databases", icon: "mongoose" },

  { name: "Vitest", category: "Testing and quality", icon: "vitest" },
  { name: "Jest", category: "Testing and quality", icon: "jest" },
  { name: "React Testing Library", category: "Testing and quality", icon: "testing-library" },
  { name: "Playwright", category: "Testing and quality", icon: "playwright" },
  { name: "Lighthouse", category: "Testing and quality", icon: "lighthouse" },

  { name: "GSAP", category: "Motion and design", icon: "gsap" },
  { name: "Framer Motion", category: "Motion and design", icon: "framer-motion" },
  { name: "Figma", category: "Motion and design", icon: "figma" },

  { name: "Auth.js", category: "Integrations", icon: "authjs" },
  { name: "Clerk", category: "Integrations", icon: "clerk" },
  { name: "Cloudinary", category: "Integrations", icon: "cloudinary" },
  { name: "Stripe", category: "Integrations", icon: "stripe" },
  { name: "Resend", category: "Integrations", icon: "resend" },
  { name: "Mapbox", category: "Integrations", icon: "mapbox" },

  { name: "Git", category: "Tooling and delivery", icon: "git" },
  { name: "GitHub", category: "Tooling and delivery", icon: "github" },
  { name: "Vercel", category: "Tooling and delivery", icon: "vercel" },
  { name: "Docker", category: "Tooling and delivery", icon: "docker" },
  { name: "Vite", category: "Tooling and delivery", icon: "vite" },
  { name: "pnpm", category: "Tooling and delivery", icon: "pnpm" },
  { name: "Postman", category: "Tooling and delivery", icon: "postman" },
] as const;

export const FOCUSED_STACK = [
  "TypeScript",
  "Next.js",
  "React",
  "Tailwind CSS",
  "Redux Toolkit",
  "Zustand",
  "TanStack Query",
  "Node.js",
  "Express.js",
  "PostgreSQL",
  "MongoDB",
  "Prisma",
  "Auth.js",
  "Cloudinary",
  "GSAP",
  "Figma",
  "Vercel",
] as const;

export const EXPERIENCED_STACK = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "Sass",
  "Material UI",
  "shadcn/ui",
  "REST APIs",
  "GraphQL",
  "WebSockets",
  "Mongoose",
  "Vitest",
  "Jest",
  "React Testing Library",
  "Playwright",
  "Lighthouse",
  "Framer Motion",
  "Clerk",
  "Stripe",
  "Resend",
  "Mapbox",
  "Git",
  "GitHub",
  "Docker",
  "Vite",
  "pnpm",
  "Postman",
] as const;

export function technologySlug(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
