const fonts = [
  ['woff', 'application/font-woff'],
  ['woff2', 'application/font-woff2'],
  ['otf', 'font/opentype'],
  ['ttf', 'application/octet-stream'],
  ['eot', 'application/vnd.ms-fontobject'],
  ['svg', 'image/svg+xml'],
]

const fontLoader = {
  test    : new RegExp(`\\.${fonts.map(x => x[0])}$`),
  loader  : 'url-loader',
  options : {
    name  : 'fonts/[name].[ext]',
    limit : 10000,
    mimetype: fonts.map(x => x[1]),
  }
}

module.exports = fontLoader
