'use strict'

var Seneca = require('seneca')
var Entities = require('seneca-entity')
var Mesh = require('seneca-mesh')
var Travis = require('../lib/travis')
var RedisStore = require('seneca-redis-store')

var envs = process.env
var opts = {
  seneca: {
    tag: envs.TRAVIS_TAG || 'nodezoo-travis'
  },
  travis: {
    token: envs.TRAVIS_TOKEN || 'NO_TOKEN',
    registry: envs.TRAVIS_REGISTRY || 'http://registry.npmjs.org/'
  },
  mesh: {
    auto: true,
    listen: [
      {pin: 'role:travis,cmd:get', model: 'consume'},
      {pin: 'role:info,req:part', model: 'observe'}
    ]
  },
  isolated: {
    host: envs.TRAVIS_HOST || 'localhost',
    port: envs.TRAVIS_PORT || '8053'
  },
  redis: {
    host: envs.TRAVIS_REDIS_HOST || 'localhost',
    port: envs.TRAVIS_REDIS_PORT || '6379'
  }
}

var Service = Seneca(opts.seneca)

Service.use(Entities)

if (envs.TRAVIS_ISOLATED) {
  Service.listen(opts.isolated)
}
else {
  Service.use(Mesh, opts.mesh)
  Service.use(RedisStore, opts.redis)
}

Service.use(Travis, opts.travis)
