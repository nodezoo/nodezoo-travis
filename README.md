![Nodezoo][Banner]

# nodezoo-travis
- __Lead Maintainer:__ [Matthew O'Connor][Lead]
- __Sponsor:__ [nearForm][Sponsor]

A microservice for pulling travis stats into nodezoo.

## Install
1. clone this repo into a root _/nodezoo_ folder.
2. run `npm install`

## Messages

This micro-service recognizes the following messages:

  * _role:travis,cmd:get_
  * _role:travis,cmd:parse_
  * _role:travis,cmd:query_
  * _role:travis,cmd:extract_

## Running with Curl

Any of the messages above can be run using curl in the following format in the command line
```
curl -d '{"role":"travis","cmd":"get","name":"YOUR_TEXT_HERE"}' http://localhost:52472/act
```

## Contributing
The [Nodezoo][Org] encourages __open__ and __safe__ participation.

- [Code of Conduct][CoC]

If you feel you can help in any way, be it with documentation, examples, extra testing, or new
features please get in touch.

## License
Copyright (c) 2016, Matthew O'Connor and other contributors.
Licensed under [MIT][].

[Banner]: https://github.com/nodezoo/nodezoo-org/blob/master/assets/logo-nodezoo.png
[Lead]: https://github.com/mcdonnelldean
[Sponsor]: http://www.nearform.com/
[Org]: https://github.com/nodezoo
[CoC]: https://github.com/nodezoo/nodezoo-org/blob/master/CoC.md
[MIT]: ./LICENSE
