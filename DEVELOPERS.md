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

To use locally the current branch:

```bash
npm link
```

To link it to a different bin:

```
sudo ln -s "$HOME/n/bin/pocket-cli" /usr/local/bin/pocket-cli-dev
```

## Depencencies. 
  
I have a quite strict policy on dependencies.

```bash
$ yarn list --prod
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

## Publish from master

Docs: https://docs.travis-ci.com/user/deployment/npm/

Install travis locally:

```shell
sudo apt install ruby ruby-dev
sudo gem install travis --no-document
```

Generate a new [GitHub Access Token](https://github.com/settings/tokens) with the [scopes](https://docs.travis-ci.com/user/github-oauth-scopes/#travis-ci-for-open-source-projects) as specified in "Repositories on https://travis-ci.org" section.

Now, authenticate to Travis and setup the project. This whole thing should be done only once.

```shell
travis login --github-token GITHUB_ACCESS_TOKEN
```

Generate a new [NPM access token](https://www.npmjs.com/settings/ildella/tokens/) which will be used and encrypted in this interactive shell:

```shell
travis setup npm
```

This will generate or upgrade the `.travis.yml` file in the project. The relevant portion is

```yaml
deploy:
  provider: npm
  email: ildella@gmail.com
  api_key:
    secure: xxxxxxxxxxxxxx
  on:
    tags: true
    repo: ildella/pocket-cli
  skip_cleanup: 'true'
```

This will publish to npm each tag that we push to GitHub like this:

```shell
git tag v0.x.x
git push origin v0.x.x
```

## Snap

To release as a snap installer:

```shell
sudo apt install snapcraft
snapcraft
```
