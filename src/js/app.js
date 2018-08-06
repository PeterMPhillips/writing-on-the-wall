var errorMsg = false;
var cost;

App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if(typeof web3 !== 'undefined'){
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('js/Wall.json', function(data) {
      var WallArtifact = data;
      App.contracts.Wall = TruffleContract(WallArtifact);

      App.contracts.Wall.setProvider(App.web3Provider);

      return App.displayWall();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#submitButton', App.writeOnWall);
  },

  displayWall: function() {
    var wallInstance;
    var wallLink;

    App.contracts.Wall.deployed().then(function(instance){
      wallInstance = instance;
      console.log(wallInstance);

      return wallInstance.writing.call();

    }).then(function(writing){
      console.log('Writing: ' + writing);
      $('#writingOnTheWall').text(writing);
      while(($(window).height()-250) > $('#writingOnTheWall').height()){
        font_size = parseFloat( $('#writingOnTheWall').css('font-size') );
        font_size = font_size + 1;
        $('#writingOnTheWall').css('font-size', font_size + 'px');
      }
      $(window).resize(function(){
      	TextFit();
      });

      return wallInstance.link.call();

    }).then(function(link){
      $('#writingOnTheWall').attr('href', link);

      return wallInstance.price.call();

    }).then(function(price){
      cost = price;
      $('.price').text(price / 1000000000000000000);

      contractAddress = wallInstance.address;
      $('.contractAddress').text(contractAddress);

    }).catch(function(err){
      console.log(err.message);
    });
  },

  writeOnWall: function(event) {
    event.preventDefault();

    var newWriting = $('#message').val();
    var newLink = $('#link').val();

    if((newWriting == '' || newLink == '') && errorMsg === false){
      $('#error').text('Some values are missing. Are you sure you would like to proceed?');
      $('#submitButton').val('Yes, Proceed');
      errorMsg = true;
    } else {
      errorMsg = false;
      $('#submitButton').val('Pay Now');
      var adoptionInstance;

      web3.eth.getAccounts(function(error, accounts){
        if(error){
          console.log(error);
        }

        var account = accounts[0];
        console.log(accounts);

        App.contracts.Wall.deployed().then(function(instance){
          wallInstance = instance;


          return wallInstance.changeWriting(newWriting, newLink, {from: account,value: cost});
        }).then(function(result){
          return App.displayWall();
        }).catch(function(err){
          console.log(err.message);
        });
      });
    }
  }

};

var TextFit = function(){
  var heightRatio = ($(window).height()-50)/$('#writingOnTheWall').height();
  if(heightRatio > 1){
    while(($(window).height()-250) > $('#writingOnTheWall').height()){
      font_size = parseFloat( $('#writingOnTheWall').css('font-size') );
      font_size = font_size + 1;
      $('#writingOnTheWall').css('font-size', font_size + 'px');
    }
  } else if (heightRatio < 1){
    while(($(window).height()-250) < $('#writingOnTheWall').height()){
      font_size = parseFloat( $('#writingOnTheWall').css('font-size') );
      font_size = font_size - 1;
      $('#writingOnTheWall').css('font-size', font_size + 'px');
    }
  }
}

$(function() {
  $(window).load(function() {
    App.init();
  });
});
