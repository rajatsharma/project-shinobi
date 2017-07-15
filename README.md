# Shinobi

<img src='inspiration.png' align='right' height='100px'>

An Awesome boilerplate to get things done with Redux faster by using Raw actions, direct connectors

#### With

- Sagas
- Thunks
- Sass
- Styled-Components

#### without

- Constants
- Selectors
- ImmutableJS
- Actions

#### Good Side

##### Raw Actions

Actions are not defined, use Action json `{ type: 'ACTION', payload }` to dispatch actions

##### Direct Connectors

Components can be directly connected to Redux Store, without creating dedicated Reducer for those Components and these Components can access multiple reducers, making them faster and also reducing their modularity

##### Functional Lenses

Lenses are used instead of Selectors because they are faster and has _no types_

#### Dark Side

⚠️  WARNING should not be used in Projects with large teams and highly scalable projects

_Direct Connectors_ reduces Component modularity and Raw actions can be confusing and clash in projects with large teams.
