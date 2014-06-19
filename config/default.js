module.exports = {
  node_port: 3000,
  elasticsearch: {
    host: 'http://ec2-54-196-63-82.compute-1.amazonaws.com',
    dev_host: 'localhost',
    port: 9200,
    size: 200,
  },
  logger_opts: {
    logstash: {
      redis: true,       // send as redis pubsub messages
      host: '127.0.0.1', // defaults to localhost
      port: 6379,        // defaults to 6379 for redis
      key: 'concord' // defaults to 'bucker', this is only used for the redis transport
    }
  },
  redis: {
    sessionstore: {
      host: 'localhost',
      port: 6379,
      ttl: 172800,
    },
  },
}