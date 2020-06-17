/* eslint-disable */
module.exports = {
  textContent: '\n' +
    '    Have a look at the part 1 for the necessary context. Here we go.\n' +
    'Question: count the name occurrencesWe need to identify the most common first name in the data and how many times it occurs.Map/reduce is convenient here, the name is in the column 8, so we isolate the column than accumulate te occurrences in an object. \n' +
    '12345678910111213const occurrences = {}const namesOccurences = () => {  __(generator)    .map(line => line.split(\'|\')[8])    .reduce(0, (a, name) => {      occurrences[name] = (occurrences[name] || 0) + 1      return name    })    .done(() => {      console.log(\'Highland> names occurrences:\')      console.log(occurrences)    })}\n' +
    'Question: donations per monthCount how many donations occurred in each month and print out the results. The donation amount is in the column 5. \n' +
    'This time we extract the reduce function for more clarity:\n' +
    '123456789101112131415const accumulator = {}const sumByMonth = function (a, item) {  accumulator[item.month] = (accumulator[item.month] || 0) + 1  return item}const countDonationsPerMonth = () => {  __(generator)    .map(line => { return {month: line.split(\'|\')[4].substring(4, 6), line: line,}})    .reduce(0, sumByMonth)    .done(() => {      console.log(\'Highland> donations per month:\')      console.log(accumulator)    })}\n',
  excerpt: 'Have a look at the part 1 for the necessary context. Here we go. Question: count the name occurrencesWe need to identify the most common first name in the data and how many times it occurs.Map/reduce',
  title: 'Parse a large text file using Node.js streams',
  byline: 'ildella',
  length: 1846,
  dir: null,
}
