module.exports = {
  node_port: 3000,
  elasticsearch_port: 9200,
  logger_opts: {
      logstash: {
        redis: true,       // send as redis pubsub messages
        host: '127.0.0.1', // defaults to localhost
        port: 6379,
        channel: false,
        list: true,
        key: 'bucker'
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