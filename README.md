# Shinobi

<img src='inspiration.png' align='right' height='100px'>

_An awesome boilerplate for faster web application development with Redux._

#### Styles of Configurations

- *With Sagas* uses sagas to manage asynchronous actions at branch `master`
- *With Epics* uses Redux-observables to manage asynchronous actions at branch `redux-observables`
- *With RRv4* uses React Router v4 for routes instead of v3 at branch `rrv4`
- *With Flow-Typed* added flow typed for flow powered type checking at branch `flow-typed`

#### Features

###### _Hot Module Replacement_

Pure Functional Components and Redux facilitates Faster Web Development without reloading of web page.

###### _Code Splitting_

Lesser Application Load Times with Code Splitting at different routes.

- Promise based Module Loading with RRv4
- Callback based Module Loading with RRv3

###### _Faster Builds_

Faster and Optimised builds with Webpack v2 and Tree Shaking by Webpack.

###### _Sideeffects_

Asynchronous Actions Management with Thunks + Sagas _(at branch `master`)_ or Thunks + Epics _(at branch `redux-observables`)_.

###### _Connectors_

Modules which directly connects to Redux Store eg Notifier(or Toaster).

###### _Dynamic Routing with POJO Routes_

Plainroute Object facilitates

- Dynamic injection of routes and components
- Centralised Route Configuration
- Async Loading of Modules in Code Splitting

#### Installation and Development

- Clone the Repo `git clone https://github.com/rajatsharma305/shinobi`.

- Change directory `cd shinobi`.

- Checkout to required branch according to the style of configuration.

- Remove git records `rm -rf .git`

- `npm i or yarn install` to install dependencies.

- `npm start or yarn start` to start development server.

- `npm build` to build project.

- `npm deploy` to deploy to `gh-pages`.
