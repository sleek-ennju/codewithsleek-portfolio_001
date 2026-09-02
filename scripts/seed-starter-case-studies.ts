import { readFile } from "node:fs/promises";
import path from "node:path";

import { PrismaPg } from "@prisma/adapter-pg";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { config } from "dotenv";

import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.local" });
config();

const requiredEnvironmentVariables = [
  "DATABASE_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
] as const;

for (const name of requiredEnvironmentVariables) {
  if (!process.env[name]) throw new Error(`${name} is required.`);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

type StarterCaseStudy = {
  title: string;
  slug: string;
  image: string;
  imageAlt: string;
  shortSummary: string;
  projectType: string;
  industries: string[];
  year: number;
  displayOrder: number;
  featured: boolean;
  overview: string;
  problem: string;
  goals: string;
  role: string;
  approach: string;
  challenges: string;
  solutions: string;
  outcome: string;
  lessons: string;
  technologies: Array<{ name: string; slug: string; category: string }>;
  metrics: Array<{ label: string; value: string; unit?: string }>;
};

const caseStudies: StarterCaseStudy[] = [
  {
    title: "RoutePilot",
    slug: "routepilot-logistics-control-center",
    image: "case-study-01.png",
    imageAlt:
      "RoutePilot logistics control center showing fleet status, route optimization, and delivery alerts",
    shortSummary:
      "A real-time logistics command center that turns scattered fleet data into clear, actionable delivery decisions.",
    projectType: "Fictional product design and full-stack concept",
    industries: ["Logistics", "Transportation", "B2B SaaS"],
    year: 2026,
    displayOrder: 1,
    featured: true,
    overview:
      "RoutePilot is a fictional portfolio case study for regional logistics teams managing vehicles, routes, facilities, and weather disruptions from one operational workspace.",
    problem:
      "Dispatchers often switch between maps, spreadsheets, messages, and carrier portals. That fragmentation delays exception handling and makes it difficult to see which shipment needs attention first.",
    goals:
      "Create a high-density control center that remains scannable, prioritizes urgent exceptions, and helps operators compare route options without losing the wider fleet picture.",
    role: "Product strategy, UX architecture, interface design, data modelling, and full-stack prototype direction.",
    approach:
      "The experience was organized around a live map, an exception-first alert rail, and a persistent operational summary. Progressive disclosure keeps detailed shipment data available without overwhelming the default view.",
    challenges:
      "The principal challenge was balancing a large volume of live operational data with the need for fast decisions under pressure and on smaller screens.",
    solutions:
      "A consistent severity system, compact metric cards, route comparisons, facility health, and a delivery timeline create a shared visual language for the entire operation.",
    outcome:
      "The concept demonstrates how one responsive workspace can shorten the path from disruption detection to a confident routing decision. The figures shown are illustrative prototype targets, not production claims.",
    lessons:
      "Operational products become easier to trust when status, severity, and recommended actions are visually consistent across every module.",
    technologies: [
      { name: "Next.js", slug: "nextjs", category: "Frontend" },
      { name: "TypeScript", slug: "typescript", category: "Language" },
      { name: "PostgreSQL", slug: "postgresql", category: "Database" },
      { name: "Mapbox", slug: "mapbox", category: "Mapping" },
    ],
    metrics: [
      { label: "Prototype decision-time target", value: "-38", unit: "%" },
      { label: "Operational views consolidated", value: "5" },
      { label: "Priority alert states", value: "3" },
    ],
  },
  {
    title: "CarePath",
    slug: "carepath-clinic-operations",
    image: "case-study-02.png",
    imageAlt:
      "CarePath clinic operations workspace with appointment timeline, patient flow, and care-team activity",
    shortSummary:
      "A calm clinic operations workspace connecting scheduling, patient flow, tasks, and care-team coordination.",
    projectType: "Fictional healthcare product concept",
    industries: ["Healthcare", "Operations", "B2B SaaS"],
    year: 2026,
    displayOrder: 2,
    featured: true,
    overview:
      "CarePath is a fictional portfolio concept exploring how outpatient clinics can coordinate the day without forcing staff to navigate multiple disconnected systems.",
    problem:
      "Front-desk teams, nurses, and providers need different details at different moments, while delayed handoffs can create longer waits and missed follow-ups.",
    goals:
      "Design a calm, accessible daily workspace that makes appointments, room status, care tasks, and patient progress understandable at a glance.",
    role: "Discovery synthesis, service blueprinting, UX design, accessibility direction, and responsive product prototyping.",
    approach:
      "The information architecture follows the patient journey from pre-visit through follow-up. Color is supportive rather than essential, and every status combines a label, icon, and contextual action.",
    challenges:
      "Healthcare interfaces must communicate urgency without creating visual anxiety, while remaining usable by staff with different roles and levels of technical comfort.",
    solutions:
      "A shared appointment timeline, role-aware task lists, patient-flow checkpoints, and a concise daily snapshot bring the clinic's operational rhythm into one view.",
    outcome:
      "The prototype provides a credible foundation for usability testing with clinic staff. All people, workflows, and measurements in this concept are illustrative.",
    lessons:
      "In sensitive workflows, clarity comes from predictable sequencing and plain-language status labels more than from adding more dashboard widgets.",
    technologies: [
      { name: "Next.js", slug: "nextjs", category: "Frontend" },
      { name: "TypeScript", slug: "typescript", category: "Language" },
      { name: "PostgreSQL", slug: "postgresql", category: "Database" },
      { name: "Figma", slug: "figma", category: "Design" },
    ],
    metrics: [
      { label: "Workflow stages mapped", value: "5" },
      { label: "Prototype schedule adherence target", value: "92", unit: "%" },
      { label: "Primary staff roles supported", value: "4" },
    ],
  },
  {
    title: "Ledgerly",
    slug: "ledgerly-cashflow-intelligence",
    image: "case-study-03.png",
    imageAlt:
      "Ledgerly cashflow analytics dashboard with transaction trends and reconciliation status",
    shortSummary:
      "A finance intelligence dashboard that makes cash position, reconciliation, and transaction movement immediately legible.",
    projectType: "Fictional fintech product concept",
    industries: ["Fintech", "Finance", "B2B SaaS"],
    year: 2026,
    displayOrder: 3,
    featured: true,
    overview:
      "Ledgerly is a fictional cash-management case study for finance teams that need an accurate daily picture without assembling it manually from bank exports and spreadsheets.",
    problem:
      "Cash visibility is often retrospective. Finance leaders can see account balances, but explaining movement, reconciliation gaps, and counterparty concentration takes additional work.",
    goals:
      "Create a trustworthy overview that answers three questions quickly: what is available, what changed, and what still needs reconciliation.",
    role: "Product definition, financial information architecture, interaction design, visual system, and prototype engineering.",
    approach:
      "The hierarchy begins with cash position, then explains the movement through trends and categories, and finally exposes the transactions and accounts responsible for the numbers.",
    challenges:
      "Dense financial interfaces can appear authoritative even when the underlying state is incomplete, so pending and unreconciled values needed equal visual weight.",
    solutions:
      "Clear freshness controls, explicit reconciliation states, paired inflow and outflow views, and drill-down-ready transaction cards make uncertainty visible instead of hiding it.",
    outcome:
      "The result is a focused concept for daily cash review and reconciliation. Amounts and performance figures are synthetic and included solely to demonstrate the product experience.",
    lessons:
      "Financial dashboards should communicate data quality and recency as clearly as they communicate totals.",
    technologies: [
      { name: "React", slug: "react", category: "Frontend" },
      { name: "TypeScript", slug: "typescript", category: "Language" },
      { name: "PostgreSQL", slug: "postgresql", category: "Database" },
      { name: "Recharts", slug: "recharts", category: "Data visualization" },
    ],
    metrics: [
      { label: "Prototype reconciliation target", value: "96.7", unit: "%" },
      { label: "Cashflow categories surfaced", value: "5" },
      { label: "Core review questions answered", value: "3" },
    ],
  },
  {
    title: "SkillSpring",
    slug: "skillspring-cohort-learning",
    image: "case-study-04.png",
    imageAlt:
      "SkillSpring cohort learning experience across desktop and mobile with lesson progress and mentor feedback",
    shortSummary:
      "A cohort-learning platform designed to turn lessons, peer collaboration, and mentor feedback into visible progress.",
    projectType: "Fictional education product concept",
    industries: ["Education", "Community", "SaaS"],
    year: 2026,
    displayOrder: 4,
    featured: true,
    overview:
      "SkillSpring is a fictional learning-platform concept for practical, cohort-based programs where progress depends on lessons, peer work, live sessions, and timely mentor feedback.",
    problem:
      "Learners can lose momentum when course content, community conversations, project work, and feedback live in separate places.",
    goals:
      "Create a motivating learning home that makes the next action obvious while preserving the social energy of a live cohort.",
    role: "Experience strategy, learner journeys, interaction design, responsive UI, and engagement-system prototyping.",
    approach:
      "The core lesson view pairs instructional media with notes, feedback, and cohort presence. Weekly goals and lightweight achievements reinforce momentum without turning learning into a points chase.",
    challenges:
      "The experience needed to serve focused study and collaborative learning at once, with a mobile view that remains useful away from a desk.",
    solutions:
      "A persistent progress model, contextual mentor comments, visible cohort activity, and a simplified mobile home connect individual work to the wider learning community.",
    outcome:
      "The prototype establishes a testable model for improving course continuity and feedback loops. Engagement figures are illustrative targets for the fictional concept.",
    lessons:
      "Progress feels meaningful when the interface connects completed work to feedback, peers, and the learner's next practical milestone.",
    technologies: [
      { name: "Next.js", slug: "nextjs", category: "Frontend" },
      { name: "TypeScript", slug: "typescript", category: "Language" },
      { name: "PostgreSQL", slug: "postgresql", category: "Database" },
      { name: "WebRTC", slug: "webrtc", category: "Collaboration" },
    ],
    metrics: [
      { label: "Learning modes connected", value: "4" },
      { label: "Prototype weekly completion target", value: "75", unit: "%" },
      { label: "Responsive product surfaces", value: "2" },
    ],
  },
  {
    title: "Verdant Market",
    slug: "verdant-sustainable-commerce",
    image: "case-study-05.png",
    imageAlt:
      "Verdant Market sustainable commerce storefront, checkout, sales dashboard, and environmental impact reporting",
    shortSummary:
      "A sustainable commerce experience that connects thoughtful shopping with transparent operational impact.",
    projectType: "Fictional commerce product concept",
    industries: ["E-commerce", "Retail", "Sustainability"],
    year: 2026,
    displayOrder: 5,
    featured: true,
    overview:
      "Verdant Market is a fictional end-to-end commerce concept combining an editorial storefront, mobile checkout, merchant analytics, and impact reporting.",
    problem:
      "Sustainability claims often sit apart from the shopping journey, making them difficult for customers to evaluate and difficult for merchants to connect with day-to-day operations.",
    goals:
      "Build a commercially clear storefront that shows material and delivery impact at useful decision points without overwhelming product discovery.",
    role: "Commerce strategy, customer journey design, design system, responsive UI, and merchant-dashboard concepting.",
    approach:
      "Impact information is treated as product data rather than promotional decoration. The customer journey and merchant dashboard use the same material, shipping, and order vocabulary.",
    challenges:
      "The central tension was presenting meaningful impact information while keeping checkout concise and avoiding unverified environmental promises.",
    solutions:
      "Product-level material labels, delivery choices, transparent impact summaries, and a merchant operations view create traceability across the purchase lifecycle.",
    outcome:
      "The concept shows how sustainability can become a coherent product capability rather than a separate campaign. Products, orders, and impact values are entirely fictional.",
    lessons:
      "Trust improves when customer-facing claims and internal measurement share the same definitions and are presented at the moment they influence a decision.",
    technologies: [
      { name: "Next.js", slug: "nextjs", category: "Frontend" },
      { name: "TypeScript", slug: "typescript", category: "Language" },
      { name: "PostgreSQL", slug: "postgresql", category: "Database" },
      { name: "Stripe", slug: "stripe", category: "Payments" },
    ],
    metrics: [
      { label: "Commerce surfaces designed", value: "4" },
      { label: "Impact categories tracked", value: "3" },
      { label: "Prototype low-impact shipping target", value: "78", unit: "%" },
    ],
  },
];

function uploadImage(buffer: Buffer, publicId: string) {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "codewithsleek/portfolio/starter-case-studies",
        public_id: publicId,
        overwrite: true,
        invalidate: true,
      },
      (error, result) => {
        if (error || !result) reject(error ?? new Error("Cloudinary returned no upload result."));
        else resolve(result);
      },
    );
    stream.end(buffer);
  });
}

try {
  for (const study of caseStudies) {
    const imagePath = path.join(process.cwd(), "public", "generated-case-studies", study.image);
    const upload = await uploadImage(await readFile(imagePath), study.slug);
    const asset = await prisma.mediaAsset.upsert({
      where: { cloudinaryId: upload.public_id },
      update: {
        fileName: study.image,
        format: upload.format,
        mimeType: `image/${upload.format}`,
        bytes: upload.bytes,
        width: upload.width,
        height: upload.height,
        altText: study.imageAlt,
        secureUrl: upload.secure_url,
      },
      create: {
        cloudinaryId: upload.public_id,
        fileName: study.image,
        format: upload.format,
        mimeType: `image/${upload.format}`,
        bytes: upload.bytes,
        width: upload.width,
        height: upload.height,
        altText: study.imageAlt,
        secureUrl: upload.secure_url,
      },
    });

    const technologyIds = await Promise.all(
      study.technologies.map(async (technology) => {
        const record = await prisma.technology.upsert({
          where: { name: technology.name },
          update: { slug: technology.slug, category: technology.category },
          create: technology,
        });
        return { id: record.id, category: technology.category };
      }),
    );

    const existing = await prisma.project.findUnique({
      where: { slug: study.slug },
      select: { publishedAt: true },
    });
    const project = await prisma.project.upsert({
      where: { slug: study.slug },
      update: {
        title: study.title,
        shortSummary: study.shortSummary,
        projectType: study.projectType,
        industries: study.industries,
        year: study.year,
        status: "PUBLISHED",
        displayOrder: study.displayOrder,
        featured: study.featured,
        repositoryVisible: false,
        overview: study.overview,
        problem: study.problem,
        goals: study.goals,
        role: study.role,
        approach: study.approach,
        challenges: study.challenges,
        solutions: study.solutions,
        outcome: study.outcome,
        lessons: study.lessons,
        seoTitle: `${study.title} case study | CODEwithSleek`,
        seoDescription: study.shortSummary,
        publishedAt: existing?.publishedAt ?? new Date(),
        cardImageId: asset.id,
        coverImageId: asset.id,
        socialImageId: asset.id,
      },
      create: {
        title: study.title,
        slug: study.slug,
        shortSummary: study.shortSummary,
        projectType: study.projectType,
        industries: study.industries,
        year: study.year,
        status: "PUBLISHED",
        displayOrder: study.displayOrder,
        featured: study.featured,
        repositoryVisible: false,
        overview: study.overview,
        problem: study.problem,
        goals: study.goals,
        role: study.role,
        approach: study.approach,
        challenges: study.challenges,
        solutions: study.solutions,
        outcome: study.outcome,
        lessons: study.lessons,
        seoTitle: `${study.title} case study | CODEwithSleek`,
        seoDescription: study.shortSummary,
        publishedAt: new Date(),
        cardImageId: asset.id,
        coverImageId: asset.id,
        socialImageId: asset.id,
      },
    });

    await prisma.$transaction([
      prisma.projectTechnology.deleteMany({ where: { projectId: project.id } }),
      prisma.projectMetric.deleteMany({ where: { projectId: project.id } }),
      prisma.projectImage.deleteMany({ where: { projectId: project.id } }),
      prisma.projectTechnology.createMany({
        data: technologyIds.map((technology, position) => ({
          projectId: project.id,
          technologyId: technology.id,
          category: technology.category,
          position,
        })),
      }),
      prisma.projectMetric.createMany({
        data: study.metrics.map((metric, position) => ({
          ...metric,
          projectId: project.id,
          position,
        })),
      }),
      prisma.projectImage.create({
        data: { projectId: project.id, mediaId: asset.id, role: "Case study hero", position: 0 },
      }),
    ]);

    console.log(`Seeded ${study.title}`);
  }

  const verified = await prisma.project.findMany({
    where: { slug: { in: caseStudies.map((study) => study.slug) }, status: "PUBLISHED" },
    select: {
      slug: true,
      cardImageId: true,
      coverImageId: true,
      socialImageId: true,
      _count: { select: { technologies: true, metrics: true, images: true } },
    },
  });

  if (
    verified.length !== caseStudies.length ||
    verified.some(
      (project) =>
        !project.cardImageId ||
        !project.coverImageId ||
        !project.socialImageId ||
        project._count.technologies < 1 ||
        project._count.metrics < 1 ||
        project._count.images < 1,
    )
  ) {
    throw new Error("Starter case-study verification failed.");
  }

  console.log(`Verified ${verified.length} published starter case studies.`);
} finally {
  await prisma.$disconnect();
}
