export const processSteps = [
  {
    number: "01",
    title: "Frame the product",
    description:
      "Clarify the goal, audience, constraints, success criteria, and strongest technical path before implementation begins.",
    output: "Scope · priorities · technical direction",
  },
  {
    number: "02",
    title: "Shape the experience",
    description:
      "Translate the visual system into responsive flows, reusable interface patterns, and precise interaction states.",
    output: "Flows · components · responsive states",
  },
  {
    number: "03",
    title: "Engineer the system",
    description:
      "Build maintainable product logic with deliberate server boundaries, focused client interaction, and useful data models.",
    output: "Application · integrations · content tools",
  },
  {
    number: "04",
    title: "Verify and release",
    description:
      "Test the complete journey, harden edge cases, check accessibility and performance, then release with confidence.",
    output: "QA · measured evidence · deployment",
  },
] as const;
