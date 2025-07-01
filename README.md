Ensure you have a server running. For this example I am using a new Ubuntu 24 VPS.

First we will upgrade and update our packages:

sudo apt update

sudo apt upgrade

Now we want to ensure to install Docker. This is a container management solution that will make deploying our app much easier.

sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

then update packages:

sudo apt update

then install docker:

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

You can see your docker version to confirm it installed:

sudo docker --version

Now we want to enable the docker service to run:

sudo service docker start

You can also set up your servers firewall (ensure you allow ssh first before enabling, if you are using ssh so you don't get locked out):

sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable

We will now download the source code for safebox to our server (you can do this from your servers root). If you see 'server-name:~#' on the left side of your teminal and do 'ls ./' and don't see any folders, you can go to the root by 'cd /', now the left side of the console should show: 'server-name:/#' and with 'ls' you should see all the main folders.

we are going to create a git folder within the home directory, to do this you can run the following from the root location:

sudo mkdir -p /home/git/safebox-server

we will now download the safebox server repo from github into the git directory:

git clone https://github.com/SafeMedia/safebox-server.git /home/git/safebox-server

You should now edit the Caddyfile, so that your domain is used instead.

You can do this by:

nano /home/git/safebox-server/Caddyfile

We now need to ensure you set up your domain to point to your server.
You must set your A record in your domain providers settings to point to your servers IP address. This may take a few hours or longer, depending on your location. You can check many dns lookup websites to see if it has updated yet.

Once that is done you can proceed:

To start the application, we will do:

docker compose -f /home/git/safebox-server/docker-compose.yml up -d

if you want to rebuild the image (if you pulled new source code and have older version), you can do this instead:

docker compose -f /home/git/safebox-server/docker-compose.yml up --build -d

Trouble-shooting

You can test to see if your websocket connection is working via postman desktop application, by creating a new websocket request type, and entering:

ws://localhost:8081

You should see

You can check to see if it is working by checking the logs in the docker container.

List docker containers:

docker ps

See logs for container:

docker container logs namecon
