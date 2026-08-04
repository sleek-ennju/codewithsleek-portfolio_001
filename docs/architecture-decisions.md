# Code with Sleek - Version 1 architecture decisions

Status: accepted on 31 July 2026.

## Product boundary

- The product is a portfolio platform, not a static landing page.
- Version 1 includes a public landing page, project archive, structured case studies, and a protected single-administrator dashboard.
- About and Contact remain sections on the landing page in Version 1.
- Blog publishing, multiple administrators, scheduled publishing, and an unrestricted page builder are deferred.

## Accepted technical decisions

1. Cloudinary will store and transform image-heavy portfolio media.
2. Auth.js will provide the single-administrator authentication flow.
3. Projects may use private repositories or hide repository links entirely.
4. Public performance evidence will be concise, dated, and labelled by device strategy.
5. Native scrolling ships first. Lenis is considered only after the motion system is tested on representative mobile devices.
6. The original design source determines the final display and body font families. Geist is used as a temporary implementation font until those font files or source specifications are available.
7. Public pages remain server-first. Client Components are limited to interaction and motion islands.

## Engineering constraints

- Every mutation must authenticate, authorize, validate input, and return a deliberately shaped result.
- Draft and archived projects never appear on public routes or in the sitemap.
- Project case studies render from validated section types, never project-specific page JSX.
- Publishing revalidates the home page, project archive, project route, and sitemap.
- Failed performance audits never replace the latest successful result.
- Motion cannot make content inaccessible and must provide mobile and reduced-motion profiles.
- The release gates defined in the execution plan are blocking requirements.
