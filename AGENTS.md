## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Ramas y deploy

- Se trabaja en `develop`. `main` es producción: Vercel publica desde `main`, así que pasar algo a `main` es publicarlo.
- `develop` se pasa a `main` con un merge (antes por PR en GitHub). `gh` no está instalado acá: el merge se hace con git local (`--no-ff`) y push.
- Cambios a prueba del cliente: rama aparte desde `develop`, y se mergea recién cuando el cliente aprueba.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
