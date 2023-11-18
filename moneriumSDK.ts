import { AuthContext, Balances, BearerProfile, MoneriumClient, PaymentStandard, Profile } from '@monerium/sdk';
import { ethers } from 'ethers';
import { placeOrderMessage } from '@monerium/sdk';
import dotenv from 'dotenv';
dotenv.config();

//sends eur from pri's mumbai eure balance to an iban
const sendEur = async (iban: string, amount: string) => {
    // Initialize the client with credentials
    const monerium = new MoneriumClient({
        environment: 'sandbox',
        clientId: (process.env.MONERIUM_ID as string), // replace with your client ID
        clientSecret: (process.env.MONERIUM_SECRET as string),
    });

    await monerium.getAccess();

    // Retrieve authentication data after successful authentication.
    await monerium.getAuthContext();

    // Access tokens are now available for use.
    // const { access_token, refresh_token } = monerium.bearerProfile as BearerProfile;

    const wallet = new ethers.Wallet(process.env.MONERIUM_ACCOUNT_PRIVATE_KEY as string)

    // First you have to form the message that will be signed by the user
    const message = placeOrderMessage(amount, iban);

    // Send a signature request to the wallet.
    const signature = await wallet.signMessage(message);

    // place redemption order
    const order = await monerium.placeOrder({
        amount,
        signature,
        address: wallet.address, // user wallet address
        counterpart: {
            identifier: {
                standard: PaymentStandard.iban, // PaymentStandard.iban,
                iban,
            },
            details: {
                firstName: 'Pri',
                lastName: 'Patel',
                country: 'IS',
            },
        },
        message,
        memo: 'Powered by Monerium SDK',
        chain: 'polygon',
        network: 'mumbai',
    });
    console.log(order)
}

sendEur('IS432727584850029081719418', '1')

// Useful code to get all profiles for the authenticated user.
// const authCtx: AuthContext = await monerium.getAuthContext();
// Fetching all accounts for a specific profile
// const { id: profileId, accounts }: Profile = await monerium.getProfile(authCtx.profiles[0].id);
// const balances: Balances[] = await monerium.getBalances(profileId);
// const bals = balances.map(a => a.balances)
// console.log(balances)
// console.log(bals)