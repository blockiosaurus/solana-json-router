var express = require('express')
var app = express();
var web3 = require('@solana/web3.js');

app.set('port', (process.env.PORT || 5000))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');

app.get('/', function (request, response) {
  response.render('index.html')
})

function clusterApiUrl(cluster) {
  if (cluster === 'mainnet-beta') {
    return 'https://solana-mainnet.rpc.extrnode.com';
  } else if (cluster === 'devnet') {
    return 'https://api.devnet.solana.com';
  }
}

app.get('/:network/:address', function (request, response) {
  const network = request.params.network;
  const address = request.params.address;

  const connection = new web3.Connection(clusterApiUrl(network), 'confirmed');
  connection.getAccountInfo(new web3.PublicKey(address))
    .then(function (account) {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ account: JSON.parse(account.data) }));
    });

  // response.setHeader('Content-Type', 'application/json');
  // response.end(JSON.stringify({ address: request.params }));
})

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'))
})
