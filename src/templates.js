const templateFrom = (template, vars) => {
  const fillTemplate = function (template, vars){
    return new Function('return `' + template + '`;').call(vars)
  }
  return fillTemplate(template, vars)
}

module.exports = templateFrom
