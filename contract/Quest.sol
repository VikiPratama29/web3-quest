// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Quest {
    struct Task {
        string description;
        uint256 points;
        bool completed;
    }

    struct User {
        uint256 points;
        uint256 lastCheckIn;
    }

    Task[] public tasks;
    mapping(address => User) public users;
    mapping(address => Task[]) public userTasks;

    event TaskAdded(string description, uint256 points);
    event TaskCompleted(address user, uint256 taskId);
    event UserCheckedIn(address user, uint256 points);

    function addTask(string memory _description, uint256 _points) public {
        tasks.push(Task(_description, _points, false));
        emit TaskAdded(_description, _points);
    }

    function completeTask(uint256 _taskId) public {
        require(_taskId < tasks.length, "Task does not exist");
        require(!tasks[_taskId].completed, "Task already completed");

        tasks[_taskId].completed = true;
        users[msg.sender].points += tasks[_taskId].points;
        userTasks[msg.sender].push(tasks[_taskId]);
        emit TaskCompleted(msg.sender, _taskId);
    }

    function checkIn() public {
        require(block.timestamp >= users[msg.sender].lastCheckIn + 1 days, "Check-in only allowed once per day");
        users[msg.sender].lastCheckIn = block.timestamp;
        users[msg.sender].points += 100;
        emit UserCheckedIn(msg.sender, 100);
    }

    function getPoints() public view returns (uint256) {
        return users[msg.sender].points;
    }

    function getLeaderboard() public view returns (address[] memory, uint256[] memory) {
        uint256 userCount = 0;
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].completed) {
                userCount++;
            }
        }

        address[] memory addresses = new address[](userCount);
        uint256[] memory points = new uint256[](userCount);

        uint256 index = 0;
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].completed) {
                addresses[index] = msg.sender;
                points[index] = users[msg.sender].points;
                index++;
            }
        }

        return (addresses, points);
    }
}
