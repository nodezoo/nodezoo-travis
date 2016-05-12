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
  let cache = opts.cache
  let registry = opts.registry + msg.name
  let context = this

  cache.load$(msg.name, (err, cached) => {
    if (err) {
      context.log.debug(`Cannot load from cache module ${msg.name}, try now to get it remotely`)
    }

    if (cached && !msg.update) {
      return done(null, {ok: true, data: cached.data$(cached)})
    }

    Request.get({url: registry, gzip: true}, (err, res, body) => {
      if (err) {
        return done(null, {ok: false, err: err})
      }

      var data = null

      try {
        data = JSON.parse(body)
      }
      catch (e) {
        return done(null, {ok: false, err: e})
      }

      var distTags = data['dist-tags'] || {}
      var latest = ((data.versions || {})[distTags.latest]) || {}
      var repository = latest.repository || {}
      var url = repository.url || ''

      var matches = /[\/:]([^\/:]+?)[\/:]([^\/]+?)(\.git)*$/.exec(url) || []
      if (matches && matches.length >= 2) {
        var params = {
          name: msg.name,
          user: matches[1] || '',
          repo: matches[2] || '',
          cached: cached
        }

        queryTravis(params, done)
      }
      else {
        return done(null, {ok: false, err: 'Cannot parse url'})
      }
    })
  })
}

function queryTravis (msg, done) {
  var cache = opts.cache
  var client = opts.client

  var user = msg.user
  var repo = msg.repo

  client.repos(user, repo).get((err, res) => {
    if (err) {
      return done(null, {ok: false, err: err})
    }

    var build = res && res.repo || {}
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
      if (err) {
        return done(null, {ok: false, err: err})
      }
      else {
        return done(null, {ok: true, data: entity && entity.data$(entity)})
      }
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

  seneca.act('role:travis,cmd:get', payload, (err, res) => {
    if (err) {
      return done(null, {ok: false, err: err})
    }

    if (res && res.ok) {
      payload.data = res.data
      seneca.act('role:info,res:part,part:travis', payload)
    }
    done(null, {ok: true})
  })
}
