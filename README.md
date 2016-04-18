![Nodezoo][Banner]

# nodezoo-travis
- __Lead Maintainer:__ [Matthew O'Connor][Lead]
- __Sponsor:__ [nearForm][Sponsor]

A micro-service that provides Travis data for [NodeZoo][]. This micro-service depends
on the Travis and NPM registries but also caches retrieved data to reduce load on both
public registries.

If you're using this microservice, and need help, you can:

- Post a [github issue][],
- Tweet to [@nodezoo][],
- Ask on the [Gitter][gitter-url].

## Running
This micro-service can be ran as part of a complete system or as a single isolated
unit.

### As a complete system
A special system repository is available that runs the complete system using Docker
and Fuge.

- [Nodezoo: The complete system][System]

### Isolated mode
To make testing easier this micro-service can be ran in 'isolated' mode. This mode
allows testing over http using a well defined port. Please note isolated mode means
patterns are not exposed via mesh.

To run in isolated mode,

 - Clone this repository locally,
 - Run `npm install`,
 - Run `npm start isolated`,

__Note:__ In memory storage is used over redis in isolated mode.

A simple http service is supported and can be called using Curl or other Rest client.
The default port is `8053`. It can be changed using the `TRAVIS_PORT` environment
variable.

```
curl -d '{"role":"travis","cmd":"get","name":"hapi"}' http://localhost:8052/act
```

## Configuration

### Environment Variables
Various settings can be changed using environment variables, see the list below for
all available variable names.

#### TRAVIS_HOST
  - The host to listen on in isolated mode.
  - Defaults to `localhost`

#### TRAVIS_PORT
  - The port to listen on in isolated mode.
  - Defaults to `8051` .

#### TRAVIS_REDIS_HOST
  - The host redis will listen on.
  - Defaults to `localhost`

#### TRAVIS_REDIS_PORT
  - The port redis listen on.
  - Defaults to `6379` .

#### TRAVIS_ISOLATED
  - Starts isolated mode.
  - Defaults to `false`.

#### TRAVIS_REGISTRY
  - Change the npm registry used to validate the module name.
  - Defaults to `http://registry.npmjs.org/`.

## Sample Data
```json
{
  "entity$": "-/-/travis_cache",
  "name": "seneca-web",
  "url": "https://travis-ci.org/senecajs/seneca-web",
  "buildId": "1398674",
  "active": "true",
  "buildState": "passed",
  "lastBuilt": "2016-02-29T17:05:48Z",
  "cached": "1460328882872",
  "id": "seneca-web"
}
```

## Messages Handled

### `role:travis,cmd:get`
Returns Travis specific data for the module name provided.

```js
seneca.act(`role:travis,cmd:get`, {name:'seneca'}, (err, data) => {})
```

### `role:info,req:part`
An alias for `role:travis,cmd:get`, allows integration into the wider nodezoo-system.

```js
seneca.act(`role:info,req:part`, {name:'seneca'}, (err, reply) => {})
```

## Messages Emitted

### `role:info,res:part`

Called in response to a call to `role:info,req:part`.

```js
seneca.add(`role:info,res:part`, (msg, done) => {})
```

## Data Emitted
- name - Name of the module
- url - URL to the module on the Travis-CI website
- buildId - ID
- active - Whether the repository is active or not
- buildState - It's most recent build state
- lastBuilt - The time and date the module was last built at
- cached - The time the data was last cached at

## Contributing
The [Nodezoo][Org] encourages __open__ and __safe__ participation.

- [Code of Conduct][CoC]

If you feel you can help in any way, be it with documentation, examples, extra testing, or new
features please get in touch.

## License
Copyright (c) 2016, Matthew O'Connor and other contributors.
Licensed under [MIT][].

[Banner]: https://raw.githubusercontent.com/nodezoo/nodezoo-org/master/assets/logo-nodezoo.png
[Lead]: https://github.com/mcdonnelldean
[Sponsor]: http://www.nearform.com/
[Org]: https://github.com/nodezoo
[CoC]: https://github.com/nodezoo/nodezoo-org/blob/master/CoC.md
[MIT]: ./LICENSE
[github issue]: https://github.com/nodezoo/nodezoo-npm/issues
[@nodezoo]: http://twitter.com/nodezoo
[gitter-url]: https://gitter.im/nodezoo/nodezoo-org
[System]: https://github.com/nodezoo/nodezoo-system
[NodeZoo]: https://github.com/rjrodger/nodezoo
