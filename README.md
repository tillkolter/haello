# haello

An app that builds trust and friendship upon strangers.

Submission for the æternity æpps hackathon https://blog.aeternity.com/aepps-hackathon-16e2d4f3e7d4

## Installation

Install NodeJS dependencies:
```
npm install
```

Install Truffle and deploy contracts:
```
npm install -g truffle
truffle migrate
```

## Development

### Provisions:

During this state of development only æpps running embedded in the [Identity Manager](identity.aepps.com) will work. For setup instructions get started by reading [this tutorial](https://codeburst.io/dapp-scratch-a-cli-for-building-dapps-and-tutorial-for-building-your-first-one-5cabdff3771e).

#### Important

The app uses the [HTML5 Geolocation feature](https://www.w3schools.com/html/html5_geolocation.asp). Chrome deprecated this feature for insecure HTTP access. Because the localhost development setup conflicted with the secured Identity Manager the insecure port had been opened for the hackathon and was used during development. To make the geolocation feature work for development purposes, Chrome has to be started in insecure mode:

```
./Google\ Chrome --unsafely-treat-insecure-origin-as-secure="http://identity.aepps.com" --user-data-dir=~/chrome
```

### Start truffle develop server
```
truffle develop
```

### Start æpp
```
npm run dev
```


## Production

```
npm run build
```

TBC
