// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
/// @title KuraChain - Voting
/// @notice A poll where each wallet can vote once before a deadline.
contract Voting {
    address public owner;
    string public question;
    uint256 public endTime;
    bool public closed;
    string[] private options;
    mapping(uint256 => uint256) private votes;
    mapping(address => bool) public hasVoted;
    event VoteCast(address indexed voter, uint256 indexed optionIndex);
    event PollClosed(address indexed closedBy);
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    constructor(
        string memory _question,
        string[] memory _options,
        uint256 _durationSeconds
    ) {
        require(_options.length >= 2 && _options.length <= 10, "2 to 10 options");
        require(_durationSeconds > 0, "Duration must be positive");
        owner = msg.sender;
        question = _question;
        options = _options;
        endTime = block.timestamp + _durationSeconds;
    }
        /// @notice True while voting is allowed.
    function isOpen() public view returns (bool) {
        return !closed && block.timestamp < endTime;
    }
    /// @notice Cast one vote for the option at optionIndex.
    function vote(uint256 optionIndex) external {
        require(isOpen(), "Poll is closed");
        require(!hasVoted[msg.sender], "Already voted");
        require(optionIndex < options.length, "Invalid option");
        hasVoted[msg.sender] = true;
        votes[optionIndex] += 1;
        emit VoteCast(msg.sender, optionIndex);
    }
    /// @notice Owner can end the poll early.
    function closePoll() external onlyOwner {
        require(isOpen(), "Poll is closed");
        closed = true;
        emit PollClosed(msg.sender);
    }
    function getOptions() external view returns (string[] memory) {
        return options;
    }
    /// @notice Vote counts, in the same order as getOptions().
    function getVotes() external view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](options.length);
        for (uint256 i = 0; i < options.length; i++) {
            result[i] = votes[i];
        }
        return result;
    }
}