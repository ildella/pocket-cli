const capFirst = string => `${string.charAt(0).toUpperCase()}${string.slice(1)}`

module.exports = {

  toSingleLine: options => Object.keys(options)
    .reduce(
      (previousValue, currentValue, currentIndex) => {
        const label = options[currentValue]
        const defaultText = currentIndex === 0 ? ' (default)' : ''
        return `${previousValue}  ${currentValue}. ${capFirst(label)}${defaultText}`
      }
      , ''
    ).trim()
}
