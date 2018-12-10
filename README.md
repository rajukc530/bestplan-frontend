Configuration npm/node in Ubuntu:
----------------------------------------------------
-sudo apt install nodejs
-sudo apt install npm
-npm install pm2  -g
-npm install yarn -g    //g for global
-for mysql: CREATE DATABASE mydatabase CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
-npm install
-npm start
-<inside bestplan-backend>yarn migrate
- pm2 start dist/index.js




#Helpful commands:
-pm2 list all
-pm2 delete all
-npm install <build to dist folder>





#Apacche2 installation
sudo apt-get install apache2


https://www.digitalocean.com/community/tutorials/how-to-set-up-apache-virtual-hosts-on-ubuntu-14-04-lts
https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04
https://opensource.com/article/18/3/configuring-multiple-web-sites-apache



#1-Issue: mysql issue
How to resolve: Specified key was too long; max key length is 767 bytes?
>> CREATE DATABASE bestplan CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;



firewall add
admin.conf
Listen *:89
<VirtualHost *:89>
    ServerAdmin admin@gmail.com
    ServerAlias *
    DocumentRoot "/var/www/bestplan/bestplan-frontend"
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined	
</VirtualHost>

# vim: syntax=apache ts=4 sw=4 sts=4 sr noet
