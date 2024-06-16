import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Quest from './contracts/Quest.json';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Profile from './Profile';
import './App.css';
import 'animate.css';

const App = () => {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [description, setDescription] = useState('');
    const [points, setPoints] = useState(0);
    const [discordConnected, setDiscordConnected] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);
    const [dailyCheckedIn, setDailyCheckedIn] = useState(false);

    useEffect(() => {
        const loadBlockchainData = async () => {
            const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);

            const networkId = await web3.eth.net.getId();
            const networkData = Quest.networks[networkId];
            if (networkData) {
                const quest = new web3.eth.Contract(Quest.abi, networkData.address);
                setContract(quest);
                const tasks = await quest.methods.getTasks().call({ from: accounts[0] });
                const points = await quest.methods.getPoints().call({ from: accounts[0] });
                setTasks(tasks);
                setPoints(points);

                const leaderboardData = await quest.methods.getLeaderboard().call();
                setLeaderboard(leaderboardData);
            }
        };

        loadBlockchainData();
    }, []);

    const connectWallet = async () => {
        const providerOptions = {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: 'YOUR_INFURA_ID' // Required
                }
            }
        };

        const web3Modal = new Web3Modal({
            network: 'mainnet', // Optional
            cacheProvider: true, // Optional
            providerOptions // Required
        });

        const provider = await web3Modal.connect();
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
    };

    const connectTwitter = async () => {
        // Logic for Twitter OAuth
    };

    const followTwitter = async () => {
        // Logic for following on Twitter
        await completeTask(0); // Assuming index 0 is for follow task
    };

    const retweet = async () => {
        // Logic for retweeting on Twitter
        await completeTask(1); // Assuming index 1 is for retweet task
    };

    const likeTweet = async () => {
        // Logic for liking a tweet
        await completeTask(2); // Assuming index 2 is for like task
    };

    const autoTweet = async () => {
        // Logic for tweeting
        await completeTask(3); // Assuming index 3 is for auto tweet task
    };

    const connectDiscord = async () => {
        // Logic for Discord OAuth
        setDiscordConnected(true);
    };

    const joinDiscord = async () => {
        if (!discordConnected) return;
        // Logic for joining Discord server
        await completeTask(4); // Assuming index 4 is for join Discord task
    };

    const addTask = async () => {
        await contract.methods.addTask(description, 1000).send({ from: account });
        const tasks = await contract.methods.getTasks().call({ from: account });
        setTasks(tasks);
        setDescription('');
    };

    const completeTask = async (index) => {
        await contract.methods.completeTask(index).send({ from: account });
        const tasks = await contract.methods.getTasks().call({ from: account });
        const points = await contract.methods.getPoints().call({ from: account });
        setTasks(tasks);
        setPoints(points);
    };

    const checkIn = async () => {
        await contract.methods.checkIn().send({ from: account });
        const points = await contract.methods.getPoints().call({ from: account });
        setPoints(points);
        setDailyCheckedIn(true);
    };

    return (
        <div className="app">
            <h1 className="animate__animated animate__bounce">Web3 Quest</h1>
            <button onClick={connectWallet} className="btn">Connect Wallet</button>
            <button onClick={connectTwitter} className="btn">Connect Twitter</button>
            <button onClick={connectDiscord} className="btn">Connect Discord</button>
            <Profile contract={contract} account={account} />
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a new task"
            />
            <button onClick={addTask} className="btn">Add Task</button>
            <ul className="task-list">
                {tasks.map((task, index) => (
                    <li key={index} className="task-item">
                        {task.description}
                        <button onClick={() => completeTask(index)} className="btn">
                            {task.completed ? 'Completed' : 'Complete Task'}
                        </button>
                    </li>
                ))}
            </ul>
            <button onClick={followTwitter} className="btn">Follow Twitter</button>
            <button onClick={retweet} className="btn">Retweet</button>
            <button onClick={likeTweet} className="btn">Like</button>
            <button onClick={autoTweet} className="btn">Auto Tweet</button>
            <button onClick={joinDiscord} className="btn">Join Discord</button>
            <button onClick={checkIn} className="btn" disabled={dailyCheckedIn}>
                {dailyCheckedIn ? 'Checked In' : 'Check In'}
            </button>
            <h2 className="leaderboard-title">Leaderboard</h2>
            <ul className="leaderboard">
                {leaderboard.map((user, index) => (
                    <li key={index} className="leaderboard-item">
                        {user[0]}: {user[1]} points
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
