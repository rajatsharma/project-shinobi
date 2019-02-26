/* eslint-disable import/no-dynamic-require */
const { spawnSync } = require('child_process');

module.exports = (_appPath, _dirName) => {
  const eslintInstallation = spawnSync('npx', ['hellpack', 'eslint'], {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: process.env,
  });

  if (eslintInstallation.error || eslintInstallation.status !== 0) {
    console.log(
      'Eslint installation failed, easily configure eslint with `npx hellpack eslint` or install on your own',
    );
  }
};
