# AurityCodeChallenge

INSTALL:
1. Install NodeJS (6.x version)
```console
$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

2. Install build essential tool (Contain npm)
```console
$ sudo apt-get install -y build-essential 
```
    
DEPLOY:
1. Build jsx assets
```console
$ npm run build
```

2. Deploy to port 8080
```console
$ npm run deploy
```
