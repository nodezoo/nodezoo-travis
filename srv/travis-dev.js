'use strict'

require('seneca')()
  .use('../travis.js')
  .add('role:info,req:part',function (args,done) {
    done()

    this.act('role:travis,cmd:get', {name:args.name},function (err, mod) {
      if (err) return done(err);

        this.act('role:info,res:part,part:travis', {name:args.name,data:mod.data$()})
      })
  })

  .add('role:travis,info:change', function (args,done) {
    done()
    this.act('role:travis,cmd:get', {name:args.name,update:true})
  })
  .use('../node_modules/seneca-mesh', {auto:true, pins:['role:travis','role:info,req:part'], model:'publish'} )
  

