module.exports = {
  node_port: 3000,
  elasticsearch_port: 9200,
  logger_opts: {
    logstash: {
      udp: true,         // or send directly over UDP
      host: '127.0.0.1', // defaults to localhost
      port: 9999, // defaults to 6379 for redis, 9999 for udp
    }
  }
}