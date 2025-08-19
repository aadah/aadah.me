# Base mongo image.
FROM ubuntu:focal

# Install Node/NPM/NPX and build tools.
RUN apt-get update && apt-get install -y curl build-essential python3 libkrb5-dev
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Designate mount point for website resources.
RUN mkdir /aadah
WORKDIR /aadah
VOLUME /aadah
