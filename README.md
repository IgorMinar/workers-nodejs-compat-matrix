# Workers Node.js Support

Quick and dirty audit of Node.js support across Workers. See <https://workers-nodejs-support.pages.dev/>

To build and deploy the report:

```shell
$ cd workerd && npm install
$ cd ../wrangler-old-polyfills && npm install
$ cd ../wrangler-new-polyfills && npm install
$ cd ..
$ nvm run 18 node/dump.mjs
$ nvm run 20 node/dump.mjs
$ nvm run 22 node/dump.mjs
$ node workerd/dump.mjs
$ node wrangler-old-polyfills/dump.mjs
$ node wrangler-new-polyfills/dump.mjs
$ node wrangler-unenv-polyfills/dump.mjs
$ node report/index.mjs
$ wrangler pages deploy dist
```

git diff --no-index -U40000000 node/apis-18.json node/apis-20.json | less
git diff --no-index -U40000000 node/apis-20.json node/apis-22.json | less



curl https://get.volta.sh | bash