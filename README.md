# Workers Node.js Support

Quick and dirty audit of Node.js support across Workers. See <https://workers-compat-matrix.pages.dev/>

To build and deploy the report:

Install Volta:
```shell
curl https://get.volta.sh | bash
```

Install Deno:
```shell
# see https://docs.deno.com/runtime/manual/getting_started/installation for alternatives
brew install deno
```

Install deps, call report generation script, and render the UI:
```shell
pnpm install
pnpm run generate
pnpm run report:dev
```
