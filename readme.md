#### EthGlobal Istanbul 🇹🇷
## PePay
A peer-to-peer mobile payments app inspired by Pepe's vision of a world without payment related middlemen.

<div align="left">
    <img src="https://cdn.discordapp.com/attachments/703519758934343702/1175617287798149150/Screenshot_2023-11-19_at_00.08.21.png?ex=656be1eb&is=65596ceb&hm=ef57550cae7257b489d744c5040624c234a06549d39df47c787b9deac1ecac6a&" alt="PePay" width="850">
</div>

## Description
Globally, card processing fees typically cost merchants between 1.5% to 3.5% per transaction, including minimum transaction fees that limit the viability of small payments. This sliding percentage fee is also based on transaction throughput with smaller merchants paying the highest fees. Enter PePay, the mobile-first crypto to fiat payment app that executes payments seamlessly, and at a fraction of the cost discussed above.

PePay features biometric payment security, NFC linked payments, secure p2p comms, 4337 enhanced UX, daily spend allowance limits as well as low/no cost off-ramping.

## Tech Stack
- React Native was used for the mobile app
- A ERC4337 account signing schema was extended to work with passkeys (biometric signing) and paymaster implemented for improved UX
- A daily allowance module was added to the 4337 account to ensure stress fee daily payments
- Private communication channels are setup between the customer and merchant using Waku
- Arx chips are used to securely identify merchants, link redirecting and transferring payment information.
- WalletConnect was used to connect a users wallet to our app
- Monerium's SDK was used for crypto to fiat off-ramping in the payments flow
- 1inch API was used to fetch customer portfolio balances