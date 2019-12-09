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
> mkdir /www </br>
> sudo gpasswd -a "$USER" www-data </br>
> sudo chown -R "$USER":www-data /www </br>
> find /www -type f -exec chmod 0660 {} \; </br>
> sudo find /www -type d -exec chmod 2770 {} \; </br>
> cd /www </br>
* insert code into directory
> git clone https://www.github.com/ndolonen/RSS-To-Social-Media.git </br>
> cd RSS-To-Social-Media </br>
> npm install </br>
* Create the .env file from the .env.example layout
* Insert api key into .env (Look at .env.example)
> npm i pm2@latest -g </br>
> pm2 start index.js -i 1 </br>
> pm2 startup systemd </br>
* Run command given by the systemd
* Run command beneath and change USER with your Username
> sudo systemctl start pm2-USER </br>
