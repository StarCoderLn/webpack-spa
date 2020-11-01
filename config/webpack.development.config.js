module.exports = {
  output: {
    filename: 'scripts/[name].bundle.js'
  },
  devServer: {
    port: 3000,
    hot: true,
    before(app) {
      app.get('/api/test', (req, res) => {
        res.json({
          code: 200,
          data: 'hello api'
        });
      })
    }
  } 
}