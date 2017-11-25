# Shinobi

<img src='inspiration.png' align='right' height='100px'>

_An awesome boilerplate for faster web application development with Redux._

#### Styles of Configurations

- *With Sagas* uses sagas to manage asynchronous actions at branch `master`
- *With Epics* uses Redux-observables to manage asynchronous actions at branch `redux-observables`
- *With RRv4* uses React Router v4 for routes instead of v3 at branch `rrv4`
- *With Flow-Typed* added flow typed for flow powered type checking at branch `flow-typed`

#### Features

###### _Declarative Build Files_

Build files are less cryptic so that you can modify your build according to your needs, and are now more declarative.
_A webpack config is a function of environment_

<img src="codescrs/webpack.png" height="150px">

###### _Hot Module Replacement_

Pure Functional Components and Redux facilitates Faster Web Development without reloading of web page.

<img src="codescrs/hmr.png" height="200px">

###### _Code Splitting_

Lesser Application Load Times with Code Splitting at different routes.

- Promise based Module Loading with RRv4
- Callback based Module Loading with RRv3

<img src="codescrs/codesplitting.png" height="250px">

###### _Faster Builds_

Faster and Optimised builds with Webpack v3 and Tree Shaking by Webpack.

###### _Sideeffects_

Asynchronous Actions Management with Thunks + Sagas _(at branch `master`)_ or Thunks + Epics _(at branch `redux-observables`)_.

<img src="codescrs/saga.png" height="200px">

###### _Connectors_

Modules which directly connects to Redux Store eg Notifier(or Toaster).

###### _PostCSS_

Now modify your CSS builds/preprocessing with postcss modules.

###### _Dynamic Routing with POJO Routes_

Plainroute Object facilitates

- Dynamic injection of routes and components
- Centralised Route Configuration
- Async Loading of Modules in Code Splitting

<img src="codescrs/pojoroutes.png" height="250px">

#### Installation and Development

- Clone the Repo `git clone https://github.com/rajatsharma305/shinobi`.
- Change directory `cd shinobi`.
- Checkout to required branch according to the style of configuration.
- Remove git records `rm -rf .git`
- `npm i` to install dependencies.
- `npm start` to start development server.
- `npm build` to build project.
- `npm deploy` to deploy to `gh-pages`.

*For better results don't mix npm and yarn during installations*

#### No Server Side Rendering ?

Read this [You’re Missing the Point of Server-Side Rendered JavaScript Apps](https://tomdale.net/2015/02/youre-missing-the-point-of-server-side-rendered-javascript-apps/)

_or_ Check out [Hiraishin](https://github.com/rajatsharma305/hiraishin)

#### The Name?

Shinobi means Ninja in Japanese, The symbol above is also a Kanji for ninja.

#### Uses

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
