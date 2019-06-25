const fs = require('fs-extra');
const path = require('path');
const { spawnSync } = require('child_process');

const generatorPath = (...relativePath) =>
  path.resolve(
    process.cwd(),
    'node_modules',
    '@enginite',
    'shinobi',
    ...relativePath,
  );

const projectPath = (...relativePath) =>
  path.resolve(process.cwd(), ...relativePath);

const ejectableScripts = ['dev', 'build', 'test'];

ejectableScripts.forEach(script => {
  fs.copy(
    generatorPath('scripts', script + '.js'),
    projectPath('scripts', script + '.js'),
  );
});

fs.copy(generatorPath('config'), projectPath('config'));

const packageScripts = ejectableScripts.map(x => 'scripts/' + x + '.js');

fs.writeFileSync(
  projectPath('package.json'),
  JSON.stringify(
    {
      ...fs.readJSONSync(projectPath('package.json')),
      scripts: {
        ...fs.readJSONSync(projectPath('package.json')).scripts,
        ...packageScripts.reduce(
          (acc, x, i) => ({ ...acc, [ejectableScripts[i]]: 'node' + ' ' + x }),
          {},
        ),
      },
    },
    null,
    2,
  ),
);

const dependencies = fs.readJSONSync(generatorPath('package.json'))
  .dependencies;

spawnSync(
  'yarn',
  [
    'add',
    ...Object.keys(dependencies).map(x => x + '@' + dependencies[x]),
    '--save-exact',
  ],
  {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: process.env,
  },
);
