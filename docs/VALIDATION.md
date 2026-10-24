# Verification record — October 23, 2026

Clean `npm ci` and production builds passed locally on Node 22.23.4 / npm 10.9.9, matching the documented runtime. TypeScript checks pass for all three Vite apps; the React Scripts build type-checks BPMN. The workflow is provided as `docs/verify-workflow.yml.example`; it is not activated because publishing workflows requires additional GitHub permission. Move it to `.github/workflows/verify.yml` from an authorized GitHub session to enable it.

- TypeScript check and production build pass. New demo/entry files pass ESLint.
- Browser: fixture loading and actual PSD download succeed.
- The downloaded PSD was parsed independently with ag-psd: 1024×1024, four named raster layers (Final Polish, Details, Main Elements, Background).
- The export type now uses the library's Layer type, fixing the prior BlendMode type mismatch.
- Whole-repo lint still reports 4 inherited errors and 7 warnings; it is not represented as passing.
- No paid image generation or gateway authentication was exercised.
