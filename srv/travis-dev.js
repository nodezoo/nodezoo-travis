var STATS = process.env.STATS || 'localhost'
require('seneca')()
  .use('../travis.js')
  .client({ host:'localhost', pin:{role:'travis', cmd:'*'}})
  .listen(44005)
  .repl(43005)