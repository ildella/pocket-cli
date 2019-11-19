# Pocket CLI 

Pocket-CLI is an interactive textual application to search and manage your [Pocket](https://getpocket.com) articles from the terminal.

<p align="center">
<img src="screens/screen1.png" alt="pocket-cli" />
</p>

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/npm/v/pocket-cli.svg?style=flat-square)](https://npmjs.com/package/pocket-cli)
[![Build Status](https://travis-ci.com/ildella/pocket-cli.svg?branch=master)](https://travis-ci.com/ildella/pocket-cli)
[![Known Vulnerabilities](https://snyk.io/test/github/ildella/pocket-cli/badge.svg?targetFile=package.json)](https://snyk.io/test/github/ildella/pocket-cli?targetFile=package.json)
[![David](https://img.shields.io/david/ildella/pocket-cli.svg)](https://david-dm.org/ildella/pocket-cli)
[![David](https://img.shields.io/david/dev/ildella/pocket-cli.svg)](https://david-dm.org/ildella/pocket-cli)
[![David](https://img.shields.io/david/peer/ildella/pocket-cli.svg)](https://david-dm.org/ildella/pocket-cli)
## Install

### Prerequisites

You must have [Node.js](https://nodejs.org/)

In Ubuntu: 

```bash
sudo snap install node --channel=12
```

### Install with NPM

```bash
npm i -g pocket-cli
```

### Install with Snap

TBD

## Run

Some example command

```shell
$ pocket-cli

Pocket> login // Authenticate with Pocket to get access to your articles
Pocket> ? // prints help
Pocket> list // last 8 articles
Pocket> unread // last 8 unread articles
Pocket> bitcoin // search for articles with 'bitcoin'
Pocket> archive 1 2 3 // archive article 1, 2 and 3 from the last search
Pocket> a 1 2 3 // shortcut for archive
Pocket> o 1 2 3 // open selected indexes in browser
Pocket> 2 <ENTER> <ENTER> // open second result (press enter twice)
Pocket> update whatsnew // prints release notes
```

Use TAB to autocomplete

## Contribute

[For developers](DEVELOPERS.md)

## Author

Built by Daniele Dellafiore. Get in touch [on Twitter](https://twitter.com/ildella)
