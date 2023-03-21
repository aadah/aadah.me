# Base mongo image.
FROM ubuntu:focal

# Install Node/NPM/NPX.
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

# Designate mount point for website resources.
RUN mkdir /aadah
WORKDIR /aadah
VOLUME /aadah
