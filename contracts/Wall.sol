pragma solidity ^0.4.23;

contract Wall {
  address public owner;
  address public author;
  string public writing;
  string public link;
  uint public price;

  constructor() public {
    //Set owner address
    owner = msg.sender;
    //Set starting price in wei
    price = 10000000000000000;
    //Set first message
    writing = "Don't like this message? Pay to write over it.";
  }

  function changeWriting(string _text, string _link) public payable{
    require(getStringLength(_text) <= 280);
    require(msg.value >= price);
    //Update price
    price = price + price/10;
    //Send payment to owner
    owner.transfer(msg.value);
    //Replace writing on the wall
    writing = _text;
    link = _link;
    //Set author
    author = msg.sender;
  }

  function getStringLength(string _s) internal pure returns (uint) {
    bytes memory bs = bytes(_s);
    return bs.length;
  }
}
