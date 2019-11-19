const lunr = require('lunr')
module.exports = () => {
  const builder = new lunr.Builder
  builder.pipeline.add(
    lunr.trimmer,
    lunr.stopWordFilter,
  )
  builder.ref('id')
  builder.ref('url')
  builder.field('authors')
  builder.field('title')
  builder.field('excerpt')
  builder.field('url')
  return builder
}
