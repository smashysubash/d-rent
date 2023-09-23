// SPDX-License-Identifier: GPL-3.0


pragma solidity >=0.7.0 <0.9.0;
error Property__NotOwner();
contract Property {

    uint32 iid = 0;
    struct property{
        uint32 pid;
        string name;
        address[] shareholders;
        uint256[] percentage;
        uint256 price;
        address owner;
        uint256 received;

    }
    mapping(uint256=>property) idtoproperty;
    mapping(address=>property[]) propertyOwned;

    modifier onlyOwner(uint256 id) {
        if(idtoproperty[id].owner!=msg.sender) revert Property__NotOwner();
        _;
    }
    event addProp(property currProp);
    
    function setProperty(string memory _name,address[] memory _shareholders,uint256[] memory _percentage , uint256 _price,address _owner)public {
        property memory myProperty;
        myProperty.pid = iid;
        myProperty.name=_name;
        myProperty.price=_price;
        myProperty.shareholders=_shareholders;
        myProperty.percentage=_percentage;
        myProperty.owner = _owner;
        myProperty.received = 0;
        idtoproperty[iid] = myProperty;
        propertyOwned[msg.sender].push(myProperty);
        iid++;
        emit addProp(myProperty);
    }

    function paytoProperty(uint256 id) public payable  {
        idtoproperty[id].received+= msg.value;
    }

    function getMyProperty() public view returns(property[] memory){
        return propertyOwned[msg.sender];
    }

    // function withdraw(uint256 id) public onlyOwner(id) {
    //     if(idtoproperty[id].received>0){
    //         for(uint256 i=0;i<idtoproperty[id].shareholders.length;i++){
    //             (bool success,)=payable(idtoproperty[i].shareholders[i]).call{value: ((address(this).balance/100)*idtoproperty[i].percentage[i])}("");
    //             require(success,"Failed"); 
    //         }
    //     }
    // }
function withdraw(uint256 id) public onlyOwner(id) {
    property storage prop = idtoproperty[id];

    require(prop.received > 0, "No funds to withdraw");

    uint256 totalReceived = prop.received;

    for (uint256 i = 0; i < prop.shareholders.length; i++) {
        address shareholder = prop.shareholders[i];
        uint256 sharePercentage = prop.percentage[i];
        uint256 shareAmount = (totalReceived * sharePercentage) / 100;

        (bool success, ) = payable(shareholder).call{value: shareAmount}("");
        require(success, "Failed to send funds to shareholder");
    }

    prop.received = 0; // Reset the received balance to zero after distribution
}
function getpropertydetail(uint256 id) public view returns (property memory) {
  return idtoproperty[id];
}
//write a function to get the balance of all properties containg the address of the owner with params as address of owner
function getbalance(address owner) public view returns(uint256){
    uint256 balance=0;
    for(uint256 i=0;i<propertyOwned[owner].length;i++){
        balance+=propertyOwned[owner][i].received;
    }
    return balance;
}

}