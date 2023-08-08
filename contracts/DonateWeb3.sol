// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract DonateWeb3 {
    event NewPost(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    struct Post {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    address payable owner;

    Post[] posts;

    constructor() {
        owner = payable(msg.sender);
    }

    function getPost() public view returns (Post[] memory) {
        return posts;
    }

    function donate(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Error. Donation below the minimum!");

        posts.push(Post(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        emit NewPost(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }
}