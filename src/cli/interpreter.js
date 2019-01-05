/*
  Which command will take control of the user input
*/

const menu = require('./menu')
const nullCommand = {
  name: 'null',
  aliases: [],
  description: 'Do nothing',
  parse: () => { return {
    execute: () => { return {lines: []}}
  }}
}

const isValidString = string => {
  return typeof(string) == 'string' && string.trim().length > 0 ? string.trim() : false
}

const getAction = (command, input) => {
  return {
    command: command,
    input: input,
    parse: () => { return command.parse(input) }
  }
}

const createAction = inputText => {
  if (interpreter.question) { return createAnswer(interpreter.question, inputText) }
  const validString = isValidString(inputText)
  if (!validString) return createNullAction()
  return createBasicAction(validString.split(' '))
}

const createNullAction = () => {
  return getAction(nullCommand, '')
}

const createAnswer = (question, inputText) => {
  const commandIndex = Number(inputText ? inputText : '1')
  const selectionIndex = question.input
  const command = menu.commands[question.parse().getCommand(commandIndex)]
  return getAction(command, selectionIndex)
}

const defaultCommand = 'list'

const createBasicAction = spaceSeparatedInput => {
  const firstWord = spaceSeparatedInput[0]
  // TODO: finally we have a place for this function: menu
  const candidates = Object.values(menu.commands).filter(command => {
    const matches = new Set(command.aliases)
    matches.add(command.name)
    return matches.has(firstWord)
  })
  const useDefault = candidates.length === 0
  // TODO: default command should not be here
  const command = useDefault ? menu.commands[defaultCommand] : candidates[0]
  // TOFIX: isInteractive should not be here, find new way to ask for isFirstWordACommand
  const isInteractive = command.type === 'interactive'
  const isFirstWordACommand = (!useDefault && !isInteractive)
  const input = isFirstWordACommand ? spaceSeparatedInput.slice(1) : spaceSeparatedInput.slice(0)
  return getAction(command, input)
}

const interpreter = inputText => {
  const action = createAction(inputText)
  const command = action.command
  const isInteractive = command.type === 'interactive'
  if (isInteractive) {
    interpreter.question = action
  } else {
    interpreter.question = undefined
  }
  return action
}

module.exports = interpreter
