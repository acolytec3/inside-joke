# Inside Joke

An ephemeral encrypted chat app built with Libp2p

## Description

This is an ephemeral chat app that allows two browser windows to send encrypted messages to each other.  Encryption uses the RSA keys generated by each node to encrypt and decrypt messages sent between the nodes.

## Usage

Clone repo and install dependencies

```bash
git clone https://github.com/acolytec3/inside-joke.git
cd inside-joke
npm i
```

Open a terminal and start up a local STAR server
```bash
npm run start-star-server
```

Start the dev server
`npm run start`

Open a browser window and then a private window and navigate to `http://localhost:3000`

Click `start node`

Copy the Node ID from each window into the input in the other

Send messages securely!


