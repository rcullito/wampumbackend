module.exports = {
  node_port: 3000,
  elasticsearch_port: 9200,
  redis: {
    sessionstore: {
      host: 'localhost',
      port: 6379,
      ttl: 172800,
    },
  },
}