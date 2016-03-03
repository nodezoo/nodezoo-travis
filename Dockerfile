FROM node:4

ADD . /

EXPOSE 44009
EXPOSE 43009

CMD ["node", "srv/travis-dev.js", "--seneca.options.tag=travis", "--seneca.log.all"]
