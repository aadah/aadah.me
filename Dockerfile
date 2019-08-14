# Base mongo image.
FROM mongo:3.4-xenial

# Install Node/NPM/NPX.
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt-get install -y nodejs

# Designate mount point for website resources.
RUN mkdir /aadah
WORKDIR /aadah
VOLUME /aadah
