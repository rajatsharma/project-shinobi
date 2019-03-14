const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const WebpackBar = require('webpackbar');
const paths = require('./paths');
const { getClientEnv } = require('./env');
const { nodePath } = require('./env');
const FileSizeReporterPlugin = require('./FileSizeReporterPlugin');

// This is the Webpack configuration factory. It's the juice!
module.exports = (
  env = 'development',
  {
    clearConsole = true,
    host = 'localhost',
    port = 3000,
    modify,
    modifyBabelOptions,
  },
  webpackObject,
) => {
  // First we check to see if the user has a custom .babelrc file, otherwise
  // we just use babel-preset-razzle.
  const hasBabelRc = fs.existsSync(paths.appBabelRc);
  const mainBabelOptions = {
    babelrc: true,
    cacheDirectory: true,
    presets: [],
  };

  const hasEslintRc = fs.existsSync(paths.appEslintRc);
  const mainEslintOptions = {
    formatter: eslintFormatter,
    eslintPath: require.resolve('eslint'),

    ignore: false,
    useEslintrc: true,
  };

  if (!hasBabelRc) {
    mainBabelOptions.presets.push(require.resolve('babel-preset-razzle'));
  }

  // Allow app to override babel options
  const babelOptions = modifyBabelOptions
    ? modifyBabelOptions(mainBabelOptions)
    : mainBabelOptions;

  if (hasBabelRc && babelOptions.babelrc) {
    console.log('Using .babelrc defined in your app root');
  }

  if (hasEslintRc) {
    console.log('Using .eslintrc defined in your app root');
  } else {
    mainEslintOptions.baseConfig = {
      extends: [require.resolve('@hellpack/eslint-config-hellpack')],
    };
    mainEslintOptions.useEslintrc = false;
  }

  // Define some useful shorthands.
  const IS_PROD = env === 'production';
  const IS_DEV = env === 'development';
  process.env.NODE_ENV = IS_PROD ? 'production' : 'development';

  const dotenv = getClientEnv('node', { clearConsole, host, port });

  const devServerPort = parseInt(dotenv.raw.PORT, 10) + 1;
  // VMs, Docker containers might not be available at localhost:3001. CLIENT_PUBLIC_PATH can override.
  const clientPublicPath =
    dotenv.raw.CLIENT_PUBLIC_PATH ||
    (IS_DEV ? `http://${dotenv.raw.HOST}:${devServerPort}/` : '/');

  // This is our base webpack config.
  let config = {
    // Set webpack mode:
    mode: IS_DEV ? 'development' : 'production',
    // Set webpack context to the current command's directory
    context: process.cwd(),
    // Specify target (either 'node' or 'web')
    target: 'node',
    // Controversially, decide on sourcemaps.
    devtool: IS_DEV ? 'cheap-module-source-map' : 'source-map',
    // We need to tell webpack how to resolve both Shinobi's node_modules and
    // the users', so we use resolve and resolveLoader.
    resolve: {
      modules: ['node_modules', paths.appNodeModules].concat(
        // It is guaranteed to exist because we tweak it in `env.js`
        nodePath.split(path.delimiter).filter(Boolean),
      ),
      extensions: ['.mjs', '.jsx', '.js', '.json'],
      alias: {
        // This is required so symlinks work during development.
        'webpack/hot/poll': require.resolve('webpack/hot/poll'),
        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        'react-native': 'react-native-web',
      },
    },
    resolveLoader: {
      modules: [paths.appNodeModules, paths.ownNodeModules],
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        // { parser: { requireEnsure: false } },
        // {
        //   test: /\.(js|jsx|mjs)$/,
        //   enforce: 'pre',
        //   use: [
        //     {
        //       options: mainEslintOptions,
        //       loader: require.resolve('eslint-loader'),
        //     },
        //   ],
        //   include: paths.appSrc,
        // },
        // Avoid "require is not defined" errors
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
        // Transform ES6 with Babel
        {
          test: /\.(js|jsx|mjs)$/,
          include: [paths.appSrc],
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: babelOptions,
            },
          ],
        },
        {
          exclude: [
            /\.html$/,
            /\.(js|jsx|mjs)$/,
            /\.(ts|tsx)$/,
            /\.(vue)$/,
            /\.(less)$/,
            /\.(re)$/,
            /\.(s?css|sass)$/,
            /\.json$/,
            /\.bmp$/,
            /\.gif$/,
            /\.jpe?g$/,
            /\.png$/,
          ],
          loader: require.resolve('file-loader'),
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
            emitFile: true,
          },
        },
        // "url" loader works like "file" loader except that it embeds assets
        // smaller than specified limit in bytes as data URLs to avoid requests.
        // A missing `test` is equivalent to a match.
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]',
            emitFile: true,
          },
        },
        {
          test: /\.(sa|sc)ss$/,
          use: [
            {
              loader: require.resolve('css-loader/locals'),
              options: {
                sourceMap: IS_DEV,
                importLoaders: 1,
                modules: false,
                minimize: !IS_DEV,
              },
            },
          ],
        },
        // "postcss" loader applies autoprefixer to our CSS.
        // "css" loader resolves paths in CSS and adds assets as dependencies.
        // "style" loader turns CSS into JS modules that inject <style> tags.
        // In production, we use a plugin to extract that CSS to a file, but
        // in development "style" loader enables hot editing of CSS.
        //
        // Note: this yields the exact same CSS config as create-react-app.
        {
          test: /\.css$/,
          exclude: [paths.appBuild, /\.module\.css$/],
          use: [
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
              },
            },
          ],
        },
        // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
        // using the extension .module.css
        {
          test: /\.module\.css$/,
          exclude: [paths.appBuild],
          use: [
            {
              // on the server we do not need to embed the css and just want the identifier mappings
              // https://github.com/webpack-contrib/css-loader#scope
              loader: require.resolve('css-loader/locals'),
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[path]__[name]___[local]',
              },
            },
          ],
        },
      ],
    },
  };

  // We want to uphold node's __filename, and __dirname.
  config.node = {
    __console: false,
    __dirname: false,
    __filename: false,
  };

  // We need to tell webpack what to bundle into our Node bundle.
  config.externals = [
    nodeExternals({
      whitelist: [
        IS_DEV ? 'webpack/hot/poll?300' : null,
        /\.(eot|woff|woff2|ttf|otf)$/,
        /\.(svg|png|jpg|jpeg|gif|ico)$/,
        /\.(mp4|mp3|ogg|swf|webp)$/,
        /\.(css|scss|sass|sss|less)$/,
      ].filter(x => x),
    }),
  ];

  // Specify webpack Node.js output path and filename
  config.output = {
    path: paths.appBuild,
    publicPath: clientPublicPath,
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  };
  // Add some plugins...
  config.plugins = [
    new FileSizeReporterPlugin(),
    // We define environment variables that can be accessed globally in our
    new webpack.DefinePlugin(dotenv.stringified),
    // Prevent creating multiple chunks for the server
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ];

  config.entry = [paths.appServerIndexJs];

  if (IS_DEV) {
    // Use watch mode
    config.watch = true;
    config.entry.unshift('webpack/hot/poll?300');

    // Pretty format server errors
    config.entry.unshift('razzle-dev-utils/prettyNodeErrors');

    const nodeArgs = ['-r', 'source-map-support/register'];

    // Passthrough --inspect and --inspect-brk flags (with optional [host:port] value) to node
    if (process.env.INSPECT_BRK) {
      nodeArgs.push(process.env.INSPECT_BRK);
    } else if (process.env.INSPECT) {
      nodeArgs.push(process.env.INSPECT);
    }

    config.plugins = [
      ...config.plugins,
      // Add hot module replacement
      new webpack.HotModuleReplacementPlugin(),
      // Supress errors to console (we use our own logger)
      new StartServerPlugin({
        name: 'server.js',
        nodeArgs,
      }),
      // Ignore assets.json to avoid infinite recompile bug
      new webpack.WatchIgnorePlugin([paths.appManifest]),
    ];
  }

  if (IS_DEV) {
    config.plugins = [
      ...config.plugins,
      new WebpackBar({
        color: '#c065f4',
        name: 'server',
      }),
    ];
  }

  // Check if webpack.config has a modify function. If it does, call it on the
  // configs we created.
  if (modify) {
    config = modify(config, { target: 'node', dev: IS_DEV }, webpackObject);
  }

  return config;
};
