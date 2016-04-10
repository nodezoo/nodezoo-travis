'use strict'

var Travis = require('travis-ci')
var Request = require('request')

var opts = {
  registry: 'http://registry.npmjs.org/'
}

module.exports = function () {
  var seneca = this

  opts = seneca.util.deepextend(opts)
  opts.client = new Travis({version: '2.0.0'})
  opts.cache = seneca.make$('travis_cache')
  opts.cache.load$()

  seneca.add('role:travis,cmd:get', cmdGet)
  seneca.add('role:info,req:part', aliasGet)

  return {
    name: 'nodezoo-travis'
  }
}

function cmdGet (msg, done) {
  var cache = opts.cache
  var registry = opts.registry + msg.name

  cache.load$(msg.name, (err, cached) => {
    if (err) return done(err)

    if (cached && !msg.update) {
      return done(null, cached.data$(cached))
    }

    Request.get({url: registry, gzip: true}, (err, res, body) => {
      if (err) return done(err)

      var data = JSON.parse(body)
      var distTags = data['dist-tags'] || {}
      var latest = ((data.versions || {})[distTags.latest]) || {}
      var repository = latest.repository || {}
      var url = repository.url || ''

      var matches = /[\/:]([^\/:]+?)[\/:]([^\/]+?)(\.git)*$/.exec(url) || []
      var params = {
        name: msg.name,
        user: matches[1] || '',
        repo: matches[2] || '',
        cached: cached
      }

      queryTravis(params, done)
    })
  })
}

function queryTravis (msg, done) {
  var cache = opts.cache
  var client = opts.client

  var user = msg.user
  var repo = msg.repo

  client.repos(user, repo).get((err, res) => {
    if (err) return done(err)

    var build = res.repo || {}
    var data = {
      name: msg.name || '',
      url: 'https://travis-ci.org/' + user + '/' + repo,
      buildId: build.id || '',
      active: build.active || '',
      buildState: build.last_build_state || '',
      lastBuilt: build.last_build_started_at || '',
      cached: Date.now()
    }

    function complete (err, entity) {
      if (err) return done(err)
      else done(null, entity.data$(entity))
    }

    if (msg.cached) {
      msg.cached.data$(data).save$(complete)
    }
    else {
      data.id$ = msg.name
      cache.make$(data).save$(complete)
    }
  })
}

function aliasGet (msg, done) {
  var seneca = this
  var payload = {name: msg.name}

  seneca.act('role:travis,cmd:get', payload, (err, data) => {
    if (err) return done(err)

    payload.data = data
    seneca.act('role:info,res:part,part:travis', payload)
    done()
  })
}
