Ensure you have a server running. For this example I am using a new Ubuntu 24 VPS.

First we will upgrade and update our packages:

sudo apt update

sudo apt upgrade

Now we want to ensure to install Docker. This is a container management solution that will make deploying our app much easier.

sudo apt install docker.io docker-compose -y

Now we want to enable the docker service to run:

sudo systemctl enable docker --now

You can also set up your servers firewall (ensure you allow ssh first before enabling, if you are using ssh so you don't get locked out):

sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable

We will now download the source code for safebox to our server (you can do this from your servers root). If you see 'server-name:~#' on the left side of your teminal and do 'ls ./' and don't see any folders, you can go to the root by 'cd /', now the left side of the console should show: 'server-name:/#' and with 'ls' you should see all the main folders.

we are going to create a git folder within the home directory, to do this you can run the following from the root location:

sudo mkdir -p /home/git

we will now download the safebox server repo from github into the git directory:

git clone https://github.com/SafeMedia/safebox-server.git /home/git

We now need to ensure you set up your domain to point to your server.
You must set your A record in your domain providers settings to point to your servers IP address. This may take a few hours or longer, depending on your location. You can check many whois websites to see if it has updated yet.
Once that is done you can proceed:

To start the application, we will do:

docker compose -f /home/git/safebox-server/docker-compose.yml up -d
