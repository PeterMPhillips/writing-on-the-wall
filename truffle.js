/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
 var HDWalletProvider = require("truffle-hdwallet-provider");
 var fs = require('fs');
 var json = JSON.parse(fs.readFileSync('mnemonic.json', 'utf8'));
 var mnemonic = json.mnemonic;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
       return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/bf81f8cf57a54147b14231efb5bc641c")
      },
      network_id: 3,
      gas: 4600000
    }
  }
};
