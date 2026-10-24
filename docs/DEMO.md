# Try the ai-layer-designer walkthrough

```bash
npm ci
npm run demo
```

Open http://127.0.0.1:8080/?demo if a browser does not open automatically. No `.env`, account, cloud project or API key is required. For a different port use `npm run demo -- --port 8090`.

The `?demo` entry point dynamically imports `src/demo/Demo.tsx` instead of the application. The Supabase client is never imported on this branch. Fixtures are fictional, the state is temporary, and refreshing resets it. This is a UI/export walkthrough, not evidence of a live deployment or a database access-control test.

See [setup](SETUP.md) for the full application and its current limitations. `npm run build` builds both entry paths; `npm run preview` serves the production build, where `/?demo` also works.
