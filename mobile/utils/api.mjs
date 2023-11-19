import fetch from "node-fetch"; // Import the fetch library for making HTTP requests
import Web3 from "web3";
import * as dotenv from "dotenv";
dotenv.config()

const chainId = 137; // The chain ID for the Polygon network
const web3RpcUrl = process.env.POLYGON_RPC; // The URL for the BSC node you want to connect to
const walletAddress = process.env.PUBLIC_KEY; // Set your wallet address (replace '0x...xxx' with your actual wallet address)
const privateKey = process.env.PRIVATE_KEY; // Set the private key of your wallet (replace '0x...xxx' with your actual private key). NEVER SHARE THIS WITH ANYONE!
const oneInchKey = process.env.API_KEY_1INCH;

const broadcastApiUrl = "https://api.1inch.dev/tx-gateway/v1.1/" + chainId + "/broadcast";
const apiBaseUrl = "https://api.1inch.dev/swap/v5.2/" + chainId;
const headers = { Authorization: `Bearer ${oneInchKey}`, accept: "application/json" };
const headers2 = { Authorization: `Bearer ${oneInchKey}`, "Content-Type": "application/json" }
const web3 = new Web3(web3RpcUrl);

async function getNonce() {
    let nonce = await web3.eth.getTransactionCount(walletAddress, 'pending')
    nonce = nonce.toString() // Convert from BIGINT to string. tx.nonce will not work if Number()
    // console.log({ nonce });
    return nonce
}

function apiRequestUrl(methodName, queryParams) {
    const url = apiBaseUrl + methodName + "?" + new URLSearchParams(queryParams).toString();
    // console.log('API Request URL:', url); // Log the URL
    return url;
}

async function checkAllowance(tokenAddress, walletAddress) {
    const response = await fetch(apiRequestUrl("/approve/allowance", { tokenAddress, walletAddress }), { headers });
    const jsonResponse = await response.json();
    return jsonResponse.allowance;
}

async function buildTxForApproveTradeWithRouter(tokenAddress, amount) {
    const url = apiRequestUrl(
        "/approve/transaction",
        amount ? { tokenAddress, amount } : { tokenAddress }
    );

    const transaction = await fetch(url, { headers }).then((res) => res.json());
    const gasLimit = await web3.eth.estimateGas({
        ...transaction,
        from: walletAddress,
    });

    return {
        ...transaction,
        gas: gasLimit,
    };
}

async function signTransaction(transaction) {
    const { rawTransaction } = await web3.eth.accounts.signTransaction(
        transaction,
        privateKey
    );

    return rawTransaction
}

async function sendSignedTransaction(rawTransaction) {
    let resp = fetch(broadcastApiUrl, {
        method: "post",
        body: JSON.stringify({ rawTransaction }),
        headers: headers2,
    })
        .then((res) => res.json())
        .then((res) => res.transactionHash || res);
    resp.transactionHash && console.log("https://polygonscan.com/tx/" + resp.transactionHash);
    return resp.transactionHash || resp;
}

async function buildTxForSwap(swapParams) {
    const url = apiRequestUrl("/swap", swapParams);

    // Fetch the swap transaction details from the API
    return fetch(url, { headers: headers2 })
        .then((res) => res.json())
        .then((res) => { console.log(res); return res.tx });
}

const main = async () => {
    const exampleParams = {
        src: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        dst: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        amount: "10000000000000000", //0.01 Matic
        from: walletAddress,
        slippage: 1, // Maximum acceptable slippage percentage for the swap (e.g., 1 for 1%)
    };
    const allowTx = await buildTxForApproveTradeWithRouter(exampleParams.src)
    console.log(allowTx)
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await sleep(1000);
    const swapTx = await buildTxForSwap(exampleParams)
    console.log(swapTx)
}

main()