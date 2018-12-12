# Pocket CLI 

Interactive terminal application for [Pocket](https://getpocket.com)

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

You must have Node.js. You can install the required version with:

```bash
sudo snap install node --channel=11
```

### NPM

```bash
npm i -g pocket-cli
```

### Snap

TBD

## Run

Some example command

```
$ pocket-cli
Pocket> auth // starts Oauth with Pocket API
Pocket> list // last 8 articles
Pocket> unread // last 8 unread articles
Pocket> bitcoin // search for articles with 'bitcoin'
Pocket> archive 1 2 3 // archive article 1, 2 and 3 from the last search
Pocket> a 1 2 3 // shortcut for archive
Pocket> o 1 // open first result in default browser
Pocket> 2 <ENTER> <ENTER> // open second result (press enter twice)
```

Use TAB to autocomplete

## Contribute

[For developers](DEVELOPERS.md)

## Author

Get in touch [on Twitter](https://twitter.com/ildella)
