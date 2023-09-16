// SPDX-License-Identifier: GPL-3.0


pragma solidity >=0.7.0 <0.9.0;
error Property__NotOwner();
contract Property {
    struct property{
        uint256 pid;
        address[] shareholders;
        uint256[] percentage;
        uint256 price;
        address owner;
        uint256 received;

    }
    mapping(uint256=>property) idtoproperty;

    modifier onlyOwner(uint256 id) {
        if(idtoproperty[id].owner!=msg.sender) revert Property__NotOwner();
        _;
    }
    function setProperty(uint256 _pid,address[] memory _shareholders,uint256[] memory _percentage , uint256 _price,address _owner)public{
        property memory myProperty;
        myProperty.price=_price;
        myProperty.shareholders=_shareholders;
        myProperty.percentage=_percentage;
        myProperty.owner = _owner;
        idtoproperty[_pid] = myProperty;
        
    }

    function paytoProperty(uint256 id) public payable  {
        idtoproperty[id].received+= msg.value;
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

}