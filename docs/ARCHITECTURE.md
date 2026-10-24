# Image stages and PSD export

The UI submits the prompt and optional reference image to one Edge Function. It constructs four stage prompts and sends them sequentially to the configured gateway. Every request uses the same original reference, when supplied. There is no previous-frame conditioning, segmentation or alpha-mask extraction.

The response parser expects `choices[0].message.images[0].image_url.url`. This is a provider-specific convention inside an otherwise chat-completions-style request.

The frontend renders each image independently. Export loads each into an HTMLImageElement, draws it centered onto a 1024×1024 canvas, and passes named canvas layers to `ag-psd`. Raster layers remain editable in a PSD editor, but an opaque layer does not become a cutout automatically.

## Validation boundaries

The offline demo calls the real layer panel and exporter with deterministic PNG fixtures. It exercises image loading, canvas conversion and binary PSD generation without an AI call. The fixture artwork is intentionally simple and labeled synthetic.

Separate integration work is needed to validate a particular model/gateway, CORS behavior on returned remote images, generation consistency, partial-failure recovery and provider cost limits. The Edge Function currently returns an error if a stage fails; it does not return partially completed output.
