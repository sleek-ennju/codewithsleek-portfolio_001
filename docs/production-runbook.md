# Production runbook

## Service map

- Application: Vercel project `codewithsleek-portfolio`
- Production URL: `https://codewithsleek-portfolio.vercel.app`
- Source: GitHub repository `sleek-ennju/codewithsleek-portfolio_001`, branch `master`
- Database: Neon PostgreSQL connected through `DATABASE_URL`
- Media: Cloudinary connected through the `CLOUDINARY_*` environment variables
- Administrator authentication: Auth.js using `AUTH_SECRET` and `ADMIN_EMAIL`

Never place secret values in this document, source control, screenshots, or support messages.

## Release verification

1. Confirm CI and the Vercel deployment are successful.
2. Open `/api/health`; expect HTTP 200 and `{"status":"ok","checks":{"database":"ok"}}`.
3. Check `/`, `/projects`, one published case study, and `/admin/login` on desktop and mobile.
4. Confirm Vercel Runtime Logs contain no new 5xx responses.
5. Confirm Web Analytics and Speed Insights remain enabled in the Vercel project.
6. Run `pnpm test:e2e:production` and review the Lighthouse workflow before a major release.

## Rollback

1. In Vercel, open **Deployments** and select the last known-good production deployment.
2. Use **Promote to Production** or redeploy that deployment.
3. Verify `/api/health`, the homepage, a case study, and administrator sign-in.
4. If the release included a database migration, do not reverse it blindly. Restore compatibility in application code first, then plan a forward migration.

## Database recovery

- Use the Neon dashboard's restore or point-in-time recovery capability available on the current plan.
- Before a schema migration or bulk content operation, confirm a restorable branch or recovery point exists.
- Test recovery on a separate Neon branch; never overwrite production as the first recovery step.
- After recovery, verify project counts, media references, administrator access, contact enquiries, and `/api/health`.

## Media recovery

- Cloudinary is the source of portfolio asset files; PostgreSQL stores their references and metadata.
- Do not delete a Cloudinary asset until it has been removed from every project and content record.
- If a database restore points to missing media, restore or re-upload the asset with the expected reference before republishing affected content.

## Incident triage

1. Check `/api/health`.
2. Check the latest Vercel deployment state and Runtime Logs.
3. If health fails, inspect Neon availability and `DATABASE_URL` configuration without exposing its value.
4. If images fail, inspect Cloudinary delivery and the `CLOUDINARY_*` configuration.
5. If administrator sign-in fails, verify `AUTH_SECRET`, `ADMIN_EMAIL`, and the administrator record.
6. Roll back the application when the latest deployment is the confirmed breaking boundary.
