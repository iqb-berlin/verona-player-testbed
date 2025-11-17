[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Verona Player Testbed

This web application enables easy testing of verona player modules. After loading the player and suitable units, one can interact and navigate like a test-taker. 

The testing is "easy", because we bundled the whole application into one html-file. You can download and use it offline without any server. If you stay online, you can use the testbed directly via this link: [Verona-Player-Testbed](https://iqb-berlin.github.io/verona-player-testbed).

**What is Verona? Read [here](https://verona-interfaces.github.io)!**

### Development server

To start a local development server, run:

```
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.


### Build Widget Player Html File
The Verona Interface Specification requires all programming to be built in one single html file. All styles and images need to be packed in one file.

```
npm run build
```
This way, the Angular application is built into the folder `dist` .
