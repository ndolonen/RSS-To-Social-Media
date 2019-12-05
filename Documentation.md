#Dependencies
* NodeJS/NPM

#required npm packages
* rss-parser
* require
* sqlite3

#Server side requirements
A linux based server (Tested on Ubuntu Server)
PM2 or other daemonizing packages

#install
* Create Directory and put rights that makes it editable without sudo rights
> mkdir /www  
> sudo gpasswd -a "$USER" www-data  
> sudo chown -R "$USER":www-data /www  
> find /www -type f -exec chmod 0660 {} \;  
> sudo find /www -type d -exec chmod 2770 {} \;  
> cd /www  
* insert code into directory
> git clone https://www.github.com/ndolonen/RSSfetcher
* cd into your directory 
* npm install
* create the .env file from the .env.example layout
* Insert api key into .env (Look at .env.example)
* npm i pm2@latest -g
* pm2 start app.js -i 1 
* pm2 startup systemd
* sudo systemctl start pm2-USER
