# Roadmap / Diary

## 11 Dec

* (DONE) Yesterday eve started refactoring the auth so that consumer key is added by a proxy server. Worked offline. 
* (DONE) omplete auth proxy server, in prod on Webtask
* BUG: search before auth hangs the console. Need to create a nice setup.
* DISTRIBUTION: Make snap package (issues... https://bugs.launchpad.net/snapcraft/+bug/1808043)
* (DONE) FEATURE: support multiple indexes for archive, delete.
* (DONE) POLISH: optional commands should appear on a single line
* BUG: command selection miss a way to just go back / ignore
* (DONE) BUG: open command works only on linux
* (DONE) POLISH: better text/color before list (human readable query) and after list (commands)


## 10-onward Dec

DONE bugs: next/prev broken, need test

Need to add a serious log, and let low-level components emit errors that will be logged accordingly. Log will go to file in prod mode, to stdout in dev mode. Need color. Is there a logger that provides a cli to see logs with colors, navigate, search etc...?

Refactor interpreter: lots of common code, complexity is at 12. Now is more testable with more test, should be "easy".

Implement all missing actions: delete, fav, tag, readd
Implement search by date in a smart way (nlp? bert? maybe the change to try...)
DONE - Implement print (last list...) and copy url (in the cli)

Missing features: 
  Collection: a set of articles to be shared with someone, like Photos album, mabye always in sync etc...
  Se non addirittura publications: topic, x publisher, x subscribers. Di fatto e' una colection con ruoli con read/write privileges
  

preferences API (apply...)
retrieve articole (apply...)

## 9 Dec

* interactive command works, with major refactoring in cli and interpreter
* lots of test for interpreter + smoke read/modify
* subcommands prompt menu for interpreter: isolate 1st level (list, help...) to 2nd level (open, next...)
* load the access token at each call instead of startup, change user allow (+ refactored a pocket-http driver which contains all specifics, more stable and secure)

## 7 Dec

* "archive" action. 
* "readd" action (first of a more generic 'undo action')
* design: when press 1-8 (index) start interactive mode with options scrollable a la inquired: open (default, double enter), (un)archive, expand, delete
* architecture: need to move to https://github.com/zeit (or another serverless/kubernetes service) the proxy (asked pocket for support about this...)
* Exploring NLP and Speech to text
  - https://responsivevoice.org
  - 

## 3 Dec

* Integrate Auth in the CLI
* basic autocomplete on first-level commands
