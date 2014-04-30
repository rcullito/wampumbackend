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

To start up Logstash

    $ bin/logstash -f logstash-bucker.conf

To set up tunnels to remote Elasticsearch

    $ ssh -i acton.pem -N -L 9300:localhost:9200 ubuntu@54.204.7.85

To view cluster info with Elasticsearch Kopf

    http://localhost:9300/_plugin/kopf/

Kibana Setup(make sure config.js port is set to 9300 to match tunnel port)
Run this within the kibana repo out on the remote instance.

    $ python -m SimpleHTTPServer 1234

Run this locally to access kibana locally

    $ ssh -i acton.pem -N -L 1234:localhost:1234 ubuntu@54.204.7.85