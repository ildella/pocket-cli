module.exports = logLevel => {
  return require('tracer').colorConsole({
    level: logLevel || 'info',
    dateformat: 'HH:MM:ss',
    transport: [
      data => { console.log(data.output) }
    ]
  })
}
