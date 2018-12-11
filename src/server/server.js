const secrets = module.webtask ? module.webtask.secrets : process.env
const tracer = require('tracer').colorConsole({
  level: secrets.LOG_LEVEL || 'debug',
  dateformat: 'HH:MM:ss',
  transport: [
    data => { console.log(data.output) }
  ]
})
process.on('unhandledRejection', (reason, p) => {
  const response = reason.response
  if (response) {
    const config = response.config
    const message = `${response.status} ${config.method} ${config.url} ${config.data}`
    tracer.error(message)
  } else { tracer.error(reason) }
})
const express = require('express')
// const app = require('express-async-await')(express())
const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// module.exports = router => {
//   app.use('/', router)
//   app.use((err, req, res, next) => {
//     tracer.error(err)
//     res.status(500).json({error: 'some message'})
//   })
//   return require('webtask-tools').fromExpress(app)
// }

app.get('/', (req, res) => {
  res.sendStatus(200)
})

module.exports = require('webtask-tools').fromExpress(app)
