#!/bin/bash

# Disable Strict Host checking for non interactive git clones
mkdir -p -m 0700 /root/.ssh
echo -e "Host *\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config



# Start supervisord and services
exec /usr/bin/supervisord -n -c /etc/supervisord.conf
