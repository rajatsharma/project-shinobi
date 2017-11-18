const styleLoader = ({
  test    : /\.(png|jpg|gif)$/,
  loader  : 'url-loader',
  options : {
    limit : 8192,
  },
})

module.exports = styleLoader
