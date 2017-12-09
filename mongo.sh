#!/bin/bash
sudo rm /var/lib/mongodb/mongod.lock
sudo rm /tmp/mongodb-27017.sock
#sudo -u mongodb mongod -f /etc/mongod.conf --repair
sudo service mongod stop
sudo service mongod start
