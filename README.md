# Workers Node.js Support

Quick and dirty audit of Node.js support across Workers. See <https://workers-nodejs-compat-matrix.pages.dev>

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

Install Bun:

```shell
# see https://bun.sh/docs/installation for alternatives
brew install oven-sh/bun/bun
```

Install deps, call report generation script, and render the UI:

```shell
pnpm install
pnpm run generate
pnpm run report:dev
```

The `generate` toolchain requires features from Node v22, so if it isn't your default node version, run it with `volta run --node 22 pnpm run generate`.
