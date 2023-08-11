import abi from '../utils/DonateWeb3.json';
import { ethers } from "ethers";
import Head from 'next/head'
import React, { useEffect, useState } from "react";
import styles from '../styles/Home.module.css'

export default function Home() {
  const contractAddress = "0x6c6907dE767ca88F75c12c6339Bc729a4d6195cB";
  const contractABI = abi.abi;

  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);

  const onNameChange = (event) => {
    setName(event.target.value);
  }

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  }

  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({method: 'eth_accounts'})
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const donate = async () => {
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const donateWeb3 = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("Donating ..")
        const donateTxn = await donateWeb3.donate(
          name ? name : "anon",
          message ? message : "Thanks for donating!",
          {value: ethers.utils.parseEther("0.001")}
        );

        await coffeeTxn.wait();

        console.log("mined ", donateTxn.hash);

        console.log("donation made!");

        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPosts = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const donateWeb3 = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        
        console.log("fetching post from the blockchain..");
        const posts = await donateWeb3.getPost();
        console.log("fetched!");
        setPosts(posts);
      } else {
        console.log("Metamask is not connected");
      }
      
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    let donateWeb3;
    isWalletConnected();
    getPosts();

    const onNewPost = (from, timestamp, name, message) => {
      console.log("Post received: ", from, timestamp, name, message);
      setPosts((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name
        }
      ]);
    };

    const {ethereum} = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      donateWeb3 = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      donateWeb3.on("NewPost", onNewPost);
    }

    return () => {
      if (donateWeb3) {
        donateWeb3.off("NewPost", onNewPost);
      }
    }
  }, []);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Help with your donation!</title>
        <meta name="description" content="Tipping site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
        Help with your donation!
        </h1>
        
        {currentAccount ? (
          <div>
            <form>
              <div class="formgroup">
                <label>
                  Name
                </label>
                <br/>
                
                <input
                  id="name"
                  type="text"
                  placeholder="anon"
                  onChange={onNameChange}
                  />
              </div>
              <br/>
              <div class="formgroup">
                <label>
                Send your message after your donation:
                </label>
                <br/>

                <textarea
                  rows={3}
                  placeholder="Hope this helps!"
                  id="message"
                  onChange={onMessageChange}
                  required
                >
                </textarea>
              </div>
              <div>
                <button
                  type="button"
                  onClick={donate}
                >
                  Send 1 Donate for 0.001ETH
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button onClick={connectWallet}> Connect your wallet </button>
        )}
      </main>

      {currentAccount && (<h1>Posts received</h1>)}

      {currentAccount && (posts.map((post, idx) => {
        return (
          <div key={idx} style={{border:"2px solid", "border-radius":"5px", padding: "5px", margin: "5px"}}>
            <p style={{"font-weight":"bold"}}>"{post.message}"</p>
            <p>From: {post.name} at {post.timestamp.toString()}</p>
          </div>
        )
      }))}

      <footer className={styles.footer}>
        <a
          href="https://www.linkedin.com/in/andrekortkamp/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by @andrekortkamp for Final Project Alchemy University!
        </a>
      </footer>
    </div>
  )
}
