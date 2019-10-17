# DEVELOPERS

## Prep the client

```bash
git clone git://github.com/ildella/pocket-cli.git
cd pocket-cli
npm install
```

## Prep the auth proxy

In order to communicate with the Pocket API, we always need to send both the consumer key, unique to the pocket-cli app, and the user token, which is obtained trough a oauth exchange. 

We need to run a proxy that securely stores the uniquer pocket-cli consumer key to access the Pocket API.

To try it in dev, create a fresh [API key from Pocket](https://getpocket.com/developer/apps/new)
Store it in a file called .env in the project root, like this

```bash
POCKET='<your api key here...>'
```

The proxy server can be started locally:

```bash
wt serve src/server/auth-proxy.js --port 4040
```

## Run it

```bash
./bin/pocket-cli
```

### Link

```bash
npm link
sudo ln -s $HOME/n/lib/node_modules/pocklet-cli/bin/pocket-cli /usr/local/bin/pocket-cli-dev
```

## Depencencies. 
  
I have a quite strict policy on dependencies.

```bash
$ npm ls --prod
pocket-cli@0.4.2 /home/ildella/projects/personal/pocket-cli
├─┬ axios@0.18.0
│ ├─┬ follow-redirects@1.5.9
│ │ └─┬ debug@3.1.0
│ │   └── ms@2.0.0
│ └── is-buffer@1.1.6
├── colorette@1.0.7
└── luxon@1.8.2
```

I do not use most common command line library or framework like commander, inquirer, chalk. I also do not use lodash or similar libraries.

What I rely on:

  - Axios - http client
  - Colorette - a dependency free ansii coloring
  - Luxon - a dependency free, immutable momentjs

## Snap

To release as a snap installer:

```shell
sudo apt install snapcraft
npm run snap
```
