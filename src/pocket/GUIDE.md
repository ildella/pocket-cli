# GUIDE

## Commands

The "help" will show all available commands with a description. 
Type "help" or "?" to show help
Type "? [command]" to show the command detailed help (eg: ? list)

## Search

We assume the default action is search, so any input that is not a Command or a Reserved Word, will be used to search. This means that:

`list bitcoin` 
will have the same effect as
`bitcoin`

### Search - Reserved Words

unread: show only non-archived
oldest / newest: list starting from oldest / newest

## Actions

When you have a list, you can apply actions to the articles. 
Each article has an index from 1 to 8. So we do:

archive article 1, 2 and 3 from the last search
`archive 1 2 3`
shortcut for the above command
`a 1 2 3`
open selected indexes in browser
`o 1 2 3`

## Interactive Mode

The alternative way to use actions is selecting the index first, then selecting the action from the menu.

The default action is "open", so that:

Quick open
`2 <ENTER> <ENTER>`

## Support commands

guide
update
update whatsnew
help