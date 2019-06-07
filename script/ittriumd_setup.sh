#!/bin/bash
# Download latest node and install.
xitlink=`curl -s https://api.github.com/repos/IttriumCore/ittrium/releases/latest | grep browser_download_url | grep linux64 | cut -d '"' -f 4`
mkdir -p /tmp/ittrium
cd /tmp/ittrium
curl -Lo ittrium.tar.gz $xitlink
tar -xzf ittrium.tar.gz
sudo mv ./bin/* /usr/local/bin
cd
rm -rf /tmp/ittrium
mkdir ~/.ittrium

# Setup configuration for node.
rpcuser=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 13 ; echo '')
rpcpassword=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32 ; echo '')
cat >~/.ittrium/ittrium.conf <<EOL
rpcuser=$rpcuser
rpcpassword=$rpcpassword
daemon=1
txindex=1
EOL

# Start node.
ittriumd
