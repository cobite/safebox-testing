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

Now you should go to https://github.com/SafeMedia/safebox-server and click the fork button. This will make a copy of the repo. Then go to your newly created repo and edit the caddy file. Here is an example forked repo path to the caddy file, replace 'your-account' with your own github account:

https://github.com/your-account/safebox-server/blob/main/Caddyfile

There you can click the edit button. Then replace the first line 'mydomain.com {' with your own domain, or sub domain:

sub.mydomain.com {

or

mydomain.com {

we will now download the safebox server repo from the new github into the git directory on our server:

git clone https://github.com/your-repo/safebox-server.git /home/git/safebox-server

If you don't want to fork the repo, you can just clone the main repo and edit the caddyfile using nano

We now need to ensure you set up your domain to point to your server.

You must set your A record in your domain providers settings to point to your servers IP address. This may take a few hours or longer, depending on your location. You can check many dns lookup websites to see if it has updated yet.

An example A record for the root domain (domain.com) would look like:

TYPE HOST VALUE TTL
A Record @ server ip 5 min

An example A record for a sub-domain (ant.domain.com) would look like:

TYPE HOST VALUE TTL
A Record ant server ip 5 min

Once that is done you can proceed:

To start the application, we will do:

docker compose -f /home/git/safebox-server/docker-compose.yml up -d

if you want to rebuild the image (if you pulled new source code and have older version), you can do this instead:

docker compose -f /home/git/safebox-server/docker-compose.yml up --build -d

Trouble-shooting

You can test to see if your websocket connection is working via postman desktop application, by creating a new websocket request type, and entering:

wss://domain.com/ws

You should see 'Connected to wss://domain.com'

You can now send a message like: '91d16e58e9164bccd29a8fd8d25218a61d8253b51c26119791b2633ff4f6b309/start-a-node.png' which should send a binary response starting with: '...v{"mimeType":
00000010: 22 69 6D 61 67 65 2F 70 6E 67 22 2C 22 78 6F 72 "image/png","xor
00000020: 6E 61 6D 65 22 3A 22 39 31 64 31 36 65 35 38 65 name":"91d16e58e
00000030: 39 31 36 34 62 63 63 64 32 39 61 38 66 64 38 64 9164bccd29a8'

You can also just go to your web browser, enter a new tab and type https://domain.com/91d16e58e9164bccd29a8fd8d25218a61d8253b51c26119791b2633ff4f6b309/start-a-node.png

You can check to see if it is working by checking the logs in the docker container.

List docker containers:

docker ps

See logs for container:

docker container logs container-id
