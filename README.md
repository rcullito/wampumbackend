To get updated server side code

    $ git pull wampumbackend
	$ sv restart serverjs

To ssh to the remote instance 

	$ ssh -i acton.pem ubuntu@ec2-54-204-7-85.compute-1.amazonaws.com

To get ES up manually:

    $ elasticsearch-1.1.0/bin/elasticsearch -d

Port forwarding:

    $ sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
    $ sudo iptables -A INPUT -p tcp -m tcp --sport 80 -j ACCEPT
    $ sudo iptables -A OUTPUT -p tcp -m tcp --dport 80 -j ACCEPT