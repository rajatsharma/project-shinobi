const {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild,
} = require('./helpers');
/* eslint-disable class-methods-use-this */
class FileSizeReporterPlugin {
  apply(compiler) {
    compiler.hooks.done.tapAsync(
      'FileSizeReporterPlugin',
      (stats, callback) => {
        measureFileSizesBeforeBuild(compiler.options.output.path)
          .then(res =>
            printFileSizesAfterBuild(stats, res, compiler.options.output.path),
          )
          .then(_ => callback());
      },
    );
  }
}

module.exports = FileSizeReporterPlugin;
