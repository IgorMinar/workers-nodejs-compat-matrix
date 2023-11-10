# Workers Node.js Support

Quick and dirty audit of Node.js support across Workers. See <https://workers-nodejs-support.pages.dev/>

To build and deploy the report:

```shell
$ cd workerd && npm install
$ cd ../wrangler-old-polyfills && npm install
$ cd ../wrangler-new-polyfills && npm install
$ cd ..
$ node node/dump.mjs
$ node workerd/dump.mjs
$ node wrangler-old-polyfills/dump.js
$ node wrangler-new-polyfills/dump.js
$ node report/index.mjs
$ wrangler pages deploy dist
```