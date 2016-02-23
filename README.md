![Nodezoo](https://github.com/nodezoo/nodezoo-org/blob/master/assets/logo-nodezoo.png)

# nodezoo-travis
A microservice for pulling travis stats into nodezoo

- __Sponsor:__ [nearForm][]

- __Work in progress:__ This module is currently a work in progress.

## Install
1. clone this repo into a root _/nodezoo_ folder.
2. run `npm install`

## Messages

This micro-service recognizes the following messages:

  * _role:travis,cmd:get_
  * _role:travis,cmd:parse_
  * _role:travis,cmd:extract_

## Running with Curl

Any of the messages above can be run using curl in the following format in the command line
```
curl -d '{"role":"travis","cmd":"get","query":"YOUR_TEXT_HERE"}' http://localhost:52472/act
```

## Contributing
The [NodeZoo][] org encourages __open__ and __safe__ participation. If you feel you can help in any way, be it with documentation, examples, extra testing, or new features please get in touch.

- Before contributing please review our __[Code of Conduct]__

## License
Copyright (c) 2016, Matthew O'Connor and other contributors.
Licensed under [MIT][].

[MIT]: ./LICENSE
[Code of Conduct]: https://github.com/nodezoo/nodezoo-org/blob/master/CoC.md
[nearForm]: http://www.nearform.com/
[NodeZoo]: http://www.nodezoo.com/
