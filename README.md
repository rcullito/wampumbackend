### start app on amazon instance

	$ sudo NODE_ENV=production nohup node app &


// look at how DW makes individual functions available on the repl with exports
### to test out the es module in the node repl

	var es = require('./es');


To ssh to the remote instance 

	$ ssh -i acton.pem ubuntu@ec2-54-204-7-85.compute-1.amazonaws.com