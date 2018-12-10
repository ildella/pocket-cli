# (Unofficial) Pocket from Command Line

## Install and start

```bash
npm i -g pocket-cli
```

## For developers

### Clone and start in dev mode

```bash
git clone git://github.com/ildella/pocket-cli.git
cd pocket-cli
npm install
```

Create a fresh [API key from Pocket](https://getpocket.com/developer/apps/new)
Store it in a file called .env in the project root, like this

```bash
POCKET='<your api key here...>'
```

Now run ```npm start``` to start the app in watch mode

### Link

```bash
npm link
sudo ln -s $HOME/n/lib/node_modules/pocklet-cli/bin/pocket-cli.js /usr/local/bin/pocket-cli-dev
```

### Snap

TDB

### Depencencies. 

I have a quite strict policy on dependencies.
I do not use any famous nodejs command line interpreter or framework like commander, or inquirer along with chalk for coloring. I also do not use lodash and many other commons nodejs libraries.

I depend on:

  * Luxon - a dependency free, immutable momentjs
  * Colorette - a dependency free ansii coloring
  * Axios - http client, which has 2 dependencies

For now I depend on express and all its dependencies for the authentication part. A refactoring is due as there's no point in using express to make one HTTP endpoint.

[npm audit badge](...)
