# nodezoo-travis
FROM node:4

RUN mkdir /src

ADD package.json /src/

WORKDIR /src

RUN npm install

COPY . /src

CMD ["node", "-r", "toolbag", "srv/travis-dev.js", "--seneca.options.tag=nodezoo-travis", "--seneca-log=type:act"]
