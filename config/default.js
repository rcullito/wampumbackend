module.exports = {
  node_port: 3000,
  elasticsearch_port: 9200,
  logger_opts: {
    logstash: {
      udp: true,         // or send directly over UDP
      host: '127.0.0.1', // defaults to localhost
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