const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const OverrideConfigWebpackPlugin = require('@enginite/override-config-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const safePostCssParser = require('postcss-safe-parser');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const WebpackBar = require('webpackbar');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const paths = require('./paths');
const { getClientEnv } = require('./env');
const { nodePath } = require('./env');

const postCssOptions = {
  ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
  plugins: () => [
    require('postcss-flexbugs-fixes'),
    require('postcss-preset-env')({
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    }),
  ],
};

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

  const dotenv = getClientEnv('web', { clearConsole, host, port });

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
    target: 'web',
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
            IS_DEV
              ? require.resolve('style-loader')
              : MiniCssExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
              options: {
                sourceMap: IS_DEV,
                importLoaders: 1,
                modules: false,
                minimize: !IS_DEV,
              },
            },
            require.resolve('resolve-url-loader'),
            {
              loader: require.resolve('postcss-loader'),
              options: Object.assign(
                {},
                {
                  sourceMap: IS_DEV,
                  ident: 'postcss',
                },
                postCssOptions,
              ),
            },
            {
              loader: require.resolve('sass-loader'),
              options: {
                sourceMap: IS_DEV,
                includePaths: [paths.appNodeModules],
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
          use: IS_DEV
            ? [
                require.resolve('style-loader'),
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                  },
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: postCssOptions,
                },
              ]
            : [
                MiniCssExtractPlugin.loader,
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    modules: false,
                    minimize: true,
                  },
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: postCssOptions,
                },
              ],
        },
        // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
        // using the extension .module.css
        {
          test: /\.module\.css$/,
          exclude: [paths.appBuild],
          use: IS_DEV
            ? [
                require.resolve('style-loader'),
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    modules: true,
                    importLoaders: 1,
                    localIdentName: '[path]__[name]___[local]',
                  },
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: postCssOptions,
                },
              ]
            : [
                MiniCssExtractPlugin.loader,
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    modules: true,
                    importLoaders: 1,
                    minimize: true,
                    localIdentName: '[path]__[name]___[local]',
                  },
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: postCssOptions,
                },
              ],
        },
      ],
    },
  };

  config.plugins = [
    // Output our JS and CSS files in a manifest file called assets.json
    // in the build directory.
    new AssetsPlugin({
      path: paths.appBuild,
      filename: 'assets.json',
    }),
    new OverrideConfigWebpackPlugin(
      { silent: true },
      { dev: IS_DEV, target: 'web' },
    ),
    // Maybe we should move to this???
    // new ManifestPlugin({
    //   path: paths.appBuild,
    //   writeToFileEmit: true,
    //   filename: 'manifest.json',
    // }),
  ];

  if (IS_DEV) {
    // Setup Webpack Dev Server on port 3001 and
    // specify our client entry point /client/index.js
    config.entry = {
      client: [
        require.resolve('razzle-dev-utils/webpackHotDevClient'),
        paths.appClientIndexJs,
      ],
    };

    // Configure our client bundles output. Not the public path is to 3001.
    config.output = {
      path: paths.appBuildPublic,
      publicPath: clientPublicPath,
      pathinfo: true,
      libraryTarget: 'var',
      filename: 'static/js/bundle.js',
      chunkFilename: 'static/js/[name].chunk.js',
      devtoolModuleFilenameTemplate: info =>
        path.resolve(info.resourcePath).replace(/\\/g, '/'),
    };
    // Configure webpack-dev-server to serve our client-side bundle from
    // http://${dotenv.raw.HOST}:3001
    config.devServer = {
      disableHostCheck: true,
      clientLogLevel: 'none',
      // Enable gzip compression of generated files.
      compress: true,
      // watchContentBase: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      historyApiFallback: {
        // Paths with dots should still use the history fallback.
        // See https://github.com/facebookincubator/create-react-app/issues/387.
        disableDotRule: true,
      },
      host: dotenv.raw.HOST,
      hot: true,
      noInfo: true,
      overlay: false,
      port: devServerPort,
      quiet: true,
      // By default files from `contentBase` will not trigger a page reload.
      // Reportedly, this avoids CPU overload on some systems.
      // https://github.com/facebookincubator/create-react-app/issues/293
      watchOptions: {
        ignored: /node_modules/,
      },
      before(app) {
        // This lets us open files from the runtime error overlay.
        app.use(errorOverlayMiddleware());
      },
    };
    // Add client-only development plugins
    config.plugins = [
      ...config.plugins,
      new webpack.HotModuleReplacementPlugin({
        multiStep: true,
      }),
      new webpack.DefinePlugin(dotenv.stringified),
    ];

    config.optimization = {
      // @todo automatic vendor bundle
      // Automatically split vendor and commons
      // https://twitter.com/wSokra/status/969633336732905474
      // splitChunks: {
      //   chunks: 'all',
      // },
      // Keep the runtime chunk seperated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      // runtimeChunk: true,
    };
  } else {
    // Specify production entry point (/client/index.js)
    config.entry = {
      client: paths.appClientIndexJs,
    };

    // Specify the client output directory and paths. Notice that we have
    // changed the publiPath to just '/' from http://localhost:3001. This is because
    // we will only be using one port in production.
    config.output = {
      path: paths.appBuildPublic,
      publicPath: dotenv.raw.PUBLIC_PATH || '/',
      filename: 'static/js/bundle.[chunkhash:8].js',
      chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
      libraryTarget: 'var',
    };

    config.plugins = [
      ...config.plugins,
      // Define production environment vars
      new webpack.DefinePlugin(dotenv.stringified),
      // Extract our CSS into a files.
      new MiniCssExtractPlugin({
        filename: 'static/css/bundle.[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        // allChunks: true because we want all css to be included in the main
        // css bundle when doing code splitting to avoid FOUC:
        // https://github.com/facebook/create-react-app/issues/2415
        allChunks: true,
      }),
      new webpack.HashedModuleIdsPlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
    ];

    config.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              // we want uglify-js to parse ecma 8 code. However, we don't want it
              // to apply any minfication steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending futher investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
          // Use multi-process parallel running to improve the build speed
          // Default number of concurrent runs: os.cpus().length - 1
          parallel: true,
          // Enable file caching
          cache: true,
          // @todo add flag for sourcemaps
          sourceMap: true,
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            // @todo add flag for sourcemaps
            map: {
              // `inline: false` forces the sourcemap to be output into a
              // separate file
              inline: false,
              // `annotation: true` appends the sourceMappingURL to the end of
              // the css file, helping the browser find the sourcemap
              annotation: true,
            },
          },
        }),
      ],
    };
  }

  if (IS_DEV) {
    config.plugins = [
      ...config.plugins,
      new WebpackBar({
        color: '#f56be2',
        name: 'client',
      }),
    ];
  }

  // Check if webpack.config has a modify function. If it does, call it on the
  // configs we created.
  if (modify) {
    config = modify(config, { target: 'web', dev: IS_DEV }, webpackObject);
  }

  return config;
};
