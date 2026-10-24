# Configure real image generation

## Frontend

Use Node.js 22 (`.nvmrc`) and npm. From a fresh clone:

```bash
npm ci
cp .env.example .env.local
```

Fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` with a development project's public URL and anon key. `VITE_SUPABASE_PROJECT_ID` is informational; the client does not read it. Never use a service-role key in a `VITE_` variable.

```bash
npm run dev -- --host 127.0.0.1
```

Open **http://127.0.0.1:8080**. For a completely offline export demo, use `npm run demo` and skip the environment file.

## Edge Function

Install the Supabase CLI, then link your own development project:

```bash
supabase login
supabase link --project-ref YOUR_DEVELOPMENT_PROJECT_REF
```

Set `AI_GATEWAY_API_KEY` and `AI_GATEWAY_URL` in the Supabase dashboard's Edge Function secrets. The URL must be the complete chat-completions endpoint, not just a hostname. Then deploy:

```bash
supabase functions deploy generate-layers --project-ref YOUR_DEVELOPMENT_PROJECT_REF
```

Follow [Supabase's secret configuration guide](https://supabase.com/docs/guides/functions/secrets). A public endpoint still needs an application-specific authentication, rate-limit and spending policy before use beyond a private development environment. Do not disable verification simply to work around a configuration error.

## Gateway compatibility

The current code requests `google/gemini-2.5-flash-image-preview` with `modalities: ['image', 'text']` and expects this response shape:

```json
{
  "choices": [{
    "message": {
      "images": [{"image_url": {"url": "data:image/png;base64,..."}}]
    }
  }]
}
```

A generic text-only OpenAI-compatible endpoint is insufficient. Confirm that your gateway supports the model identifier and image response field, or update the function for that provider. Model availability was not exercised by the offline demo. Each successful generation makes **four** model calls and can incur charges.

Use a benign prompt such as `An abstract circular sculpture against a purple sky`. Start without a reference image; add one only after verifying the gateway response. The function returns `{ "layers": [{ "name", "imageUrl", "description" }] }`.

## Verification and troubleshooting

```bash
npm run typecheck
npm run build
npm run preview -- --host 127.0.0.1
```

- Blank normal app: check `.env.local`, then restart Vite. `/?demo` needs no configuration.
- Missing gateway secret: set it in the project's Edge Function environment, not the frontend.
- 401/403: inspect function authentication and gateway credentials separately.
- `No image generated`: compare the actual gateway response schema with the expected shape.
- Export fails: external images must permit canvas access through CORS, or use data URLs. The synthetic sample is a useful offline control.
- Slow generation: four calls run sequentially. The current UI only receives layers after all four finish.
