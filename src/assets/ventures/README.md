# NRTH venture artwork

Nine original generated campaign images, created for the venture showcase. They are conceptual material studies, rather than photographs of NRTH products or facilities. All follow the approved chrome, graphite and restrained warm-orange palette.

`src/data/visuals.ts` maps each image to its venture and descriptive alternative text. Astro generates compressed responsive WebP variants. The original homepage portfolio, architecture and research images remain in `src/assets/matterfield`.

## Updating a venture

- Main introductions and venture relationships: `src/data/projects.ts` (existing CMS overrides remain supported).
- Capability readings: `src/data/project-details.ts` (existing CMS overrides remain supported).
- New feature stories, audiences, contexts, responsibilities and deeper questions: `src/data/venture-depth.ts`.
- Practical field-guide areas and artwork readings: `src/data/venture-field-guides.ts`.
- Working records and review questions for each context step: `src/data/work-step-readings.ts`.
- Cross-venture homepage stories: `src/data/portfolio-journeys.ts`.
- Homepage direction stories: `src/components/VentureSpotlight.astro`.

Keep context IDs stable because they are used by shared links. Descriptions should establish the real public scope. Update approved factual content as it becomes available, rather than imply product capabilities through conceptual imagery.
