# (Unofficial) Pocket from Command Line

## Install and start

```bash
npm i -g pocket-cli
```

## For developers

### Clone and start in dev mode

```bash
git clone git://github.com/ildella/pocket-cli.git
cd pocket-cli && npm install
```

Create a fresh [API key from Pocket](https://getpocket.com/developer/apps/new)
Store it in a file called .env in the project root, like this

```
POCKET='<your api key here...>'
```

Now run ```npm start``` to start the app in watch mode

### Use kubeless via serverless-framework

In order not to store the Pocket API consumer key, we host a simple proxy server on Kubeless, using the serverless-framework

```bash
npm install serverless -g
```

### Link

```bash
npm link
sudo ln -s $HOME/n/lib/node_modules/pocklet-cli/bin/pocket-cli.js /usr/local/bin/pocket-cli-dev
```

### Snap

TDB

### Depencencies. 

I have a quite strict policy on dependencies
For this Cli I do not use any classic nodejs command line interpreter or framework like commander, argxv o inquirer, or chalk for coloring. I also do not use lodash. 

Mostly I depend on:

  * Luxon - a dependency free, immutable momentjs
  * Colorette - a dependency free ansii coloring
  * Axios - http client, which has 2 dependencies

[npm audit badge](...)