'use strict'

var opts = {
  redis: {
    host: 'localhost',
    port: process.env.redis_PORT
  }
}

require('seneca')()
.use('redis-store', opts.redis)
.use('entity')
.use('../travis.js')
.add('role:info,req:part',function (args,done) {
  done()

  this.act('role:travis,cmd:get', {name:args.name},function (err, mod) {
    if (err) {
      return done(err);
    }

    this.act('role:info,res:part,part:travis', {name:args.name,data:mod.data$()})
  })
})

.add('role:travis,info:change', function (args,done) {
  done()
  this.act('role:travis,cmd:get', {name:args.name,update:true})
})
.use('../node_modules/seneca-mesh', {auto:true, pins:['role:travis','role:info,req:part'], model:'publish'} )
