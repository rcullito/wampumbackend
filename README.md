To start backend

    locally run

    $ NODE_ENV=dev grunt server

    in production run

    $ node app.js

To get updated server side code

    $ git pull wampumbackend
	$ sv restart serverjs

To ssh to the remote instance 

	$ ssh -i acton.pem ubuntu@ec2-54-204-7-85.compute-1.amazonaws.com

To get ES up manually:

    $ bin/elasticsearch -d

Port forwarding:

    $ sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
    $ sudo iptables -A INPUT -p tcp -m tcp --sport 80 -j ACCEPT
    $ sudo iptables -A OUTPUT -p tcp -m tcp --dport 80 -j ACCEPT

To start redis

    $ redis-server

To start up Logstash

    $ bin/logstash -f logstash-bucker-redis.conf

To set up tunnels to remote Elasticsearch and Kibana

    $ grunt parallel

To view cluster info with Elasticsearch Kopf

    http://localhost:9300/_plugin/kopf/

Kibana Setup(make sure config.js port is set to 9300 to match tunnel port)
Run this within the kibana repo out on the remote instance to send to the background

    $ nohup python -m SimpleHTTPServer 1234 &

To get consul going with the UI locally

    $ consul agent -server -bootstrap -data-dir /tmp/consul -config-dir /etc/consul.d -ui-dir /Users/robertculliton/consul-ui

To get consul going with the UI out on ubuntu

consul agent -server -bootstrap -data-dir /tmp/consul -config-dir /etc/consul.d -ui-dir /home/ubuntu/consul-ui

To navigate to the consul UI

    http://localhost:8500/ui


Start streaming service locally

    $ node simpleRedisExample

Start streaming service on ubuntu

    $ sudo sv restart theriver
