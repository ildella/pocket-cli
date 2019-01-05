## 0.9.0 -> in dev

  * refactor the cli/processor/interpreter in order to add new features like permanent filters, permanent custom prompt
  * complete support for tag command
  * the refactor will help moving forward offline mode

## 0.8.1 -> Jan 5th, 2019

  * new: Fav article are marked with a *
  * new: list will show the tags of each item
  * new: "tag 1 myTag" will tag. Is not positional, so "tag myTag 1 2" is same as "tag 1 myTag 2". Is semantic. Fake, but semantic :)
  * improved: When an index is selected, action 4 is now Archive or Readd according to the article status
  * improved: command completion has better behavior
  * change: index and title no longer have bright colors
  * fixed: previous command is broken in 0.7.9
  * under the hood: Large refactoring. Tests % are 80.13 | 62.7 | 67.83 | 80.09
  * prep code for offline storage (download.js) and index (build-index.js)

## 0.7.9 -> Dec 23, 2018

  * fix/loader: the loader symbol does not disappear after search is finished
  * help text after search is in gray + typo fix

## 0.7.8 -> Dec 21, 2018

  * More detailed help and a new 'guide' command
  * Fix: action time is wrong, this causes'readd' command to malfunction
  * Improved UI: show clear "no results found" message whe... appropriate
  * Improved UI: more clear search and actions messages in results screen

## 0.7.3 -> Dec 15, 2018

  * show (A) before archived articles title
  * update now print the command to run update + whatsnew subcommand shows RELEASES
  * Open supports multiple indexes

## 0.7.0 -> Dec 14, 2018

  * Login with proper user flow for first usage
  * Logout
  * Update: Check for updates

## 0.6.0 - Dec 13, 2018

  * More clear UI for non authenticated users
