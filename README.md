<h1 align="center">
  <br>
  <a href="https://github.com/rajatsharma/shinobi"><img src="inspiration.png" alt="shinobi" width="200"></a>
  <br>
  Shinobi
  <br>
</h1>

<h4 align="center">Create React App with Server Side Rendering and Hot Module Replacement</h4>

<p align="center">
  <a href="https://github.com/prettier/prettier">
        <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" alt="prettier"/>
  </a>
<a href="https://github.com/rajatsharma/enginite">
        <img src="https://img.shields.io/badge/enginite-generator-orange.svg" alt="enginite"/>
  </a>
  
  <a href="https://github.com/rajatsharma/hellpack">
        <img src="https://img.shields.io/badge/uses-hellpack%20%F0%9F%94%A5-%23414770.svg" alt="hellpack"/>
  </a>
  <a href="https://travis-ci.org/rajatsharma/shinobi">
        <img src="https://travis-ci.org/rajatsharma/shinobi.svg?branch=master" alt="travis"/>
  </a>
  <a href="https://codecov.io/gh/rajatsharma/shinobi">
  <img src="https://codecov.io/gh/rajatsharma/shinobi/branch/master/graph/badge.svg" />
</a>
</p>

## Pre-requisites

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/download)
- [yarn](https://yarnpkg.com/en/docs/getting-started)

## Getting Started

```bash
# Create Shinobi App
$ npx @enginite/create-app myApp @enginite/shinobi
# The above command will generate a shinobi project with the files you need for App development

# Go into the repository
$ cd myApp

# Install dependencies
$ yarn
```

_After your project is generated the following commands will be available_

#### `yarn dev` or `npm start`

Runs your application at localhost:3000 with HMR enabled, which will automatically make changes to your application with reloading your browser.

#### `yarn build` or `npm run build`

This will generate a build folder with application ready to start at production server

##### `node build/server.js`

This will run your built application at port 3000, to run on specified port run with `PORT=8080 node build/server.js`.

### FAQs

_HMR not working?..._

Try increasing watchers

```bash
$ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```
