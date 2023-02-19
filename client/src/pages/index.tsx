import { Connection,Keypair,LAMPORTS_PER_SOL,PublicKey,Transaction,SystemProgram,sendAndConfirmTransaction,TransactionInstruction} from "@solana/web3.js";

interface VoteAccount {
  treasuryAccount: string;
  array: {
    competitor: string;
    vote: number;
  }[];
}

async function createAccount(): Promise<string> {

  // Replace these values with your program ID and the URL of your Solana node
const PROGRAM_ID = '2htxnCLUYFZ8pupxAnf86pBiBrBnyRDPiz2NfC4jQzmH';
const NODE_URL = 'https://api.devnet.solana.com';

let secretKey = Uint8Array.from([
  202, 171, 192, 129, 150, 189, 204, 241, 142, 71, 205, 2, 81, 97, 2, 176, 48,
  81, 45, 1, 96, 138, 220, 132, 231, 131, 120, 77, 66, 40, 97, 172, 91, 245, 84,
  221, 157, 190, 9, 145, 176, 130, 25, 43, 72, 107, 190, 229, 75, 88, 191, 136,
  7, 167, 109, 91, 170, 164, 186, 15, 142, 36, 12, 23,
]);

let keypair = Keypair.fromSecretKey(secretKey);

// Connect to the Solana network
const connection = new Connection(NODE_URL, "confirmed");

let balance = await connection.getBalance(keypair.publicKey);
console.log(`${balance / LAMPORTS_PER_SOL} SOL`);

if(balance < 2)
{
  let txhash = await connection.requestAirdrop(keypair.publicKey, 2e9);
  console.log(`txhash: ${txhash}`);
}

// Get the recent blockhash
const { blockhash } = await connection.getRecentBlockhash();
console.log(`Recent blockhash: ${blockhash}`);

// Get the public key of the account that will call the program
const callerPublicKey =keypair.publicKey;

// Get the program account public key
const programPublicKey = new PublicKey(PROGRAM_ID);

// length of data in the account to calculate rent for

const Account = {
  treasuryAccount: 'GyY4JSwrJArWF1tM8a2BNCMhGoeU5EZZpauUsQzoAiYm',
};


const sizeInBytes = 32;

console.log(sizeInBytes);
const rentExemptionAmount = await connection.getMinimumBalanceForRentExemption(sizeInBytes);
console.log(rentExemptionAmount);

const currentDate = new Date(); 
const timestamp = currentDate.getTime();

//create competition
let basePubkey = keypair.publicKey;
let seed = timestamp.toString();
let programId =programPublicKey;

console.log(
  `${(
    await PublicKey.createWithSeed(basePubkey, seed, programId)
  ).toBase58()}`
);

let derived = await PublicKey.createWithSeed(basePubkey, seed, programId)




const tx = new Transaction().add(
  //create an account of size 32
  SystemProgram.createAccountWithSeed({
    fromPubkey: keypair.publicKey, // funder
    newAccountPubkey: derived,
    basePubkey: basePubkey,
    seed: seed,
    lamports: rentExemptionAmount,
    space: sizeInBytes,
    programId: programPublicKey,
  }),
  //call the program
  new TransactionInstruction({
    keys: [
      { pubkey: derived, isSigner: false, isWritable: true },
      { pubkey: keypair.publicKey, isSigner: true, isWritable: false },
    ],
    programId: programId,
    data: Buffer.from([]), // add any instruction data here if applicable
  })
);

console.log(Buffer.from(keypair.publicKey.toBytes()).toString('hex'));

console.log("creating account and adding data");
console.log(
  `txhash: ${await sendAndConfirmTransaction(connection, tx, [keypair])}`
);

// Get the account data
connection.getAccountInfo(derived).then((accountInfo) => {
  // Do something with the account data
  try {
    console.log(Buffer.from(accountInfo.data).toString('hex'));
  } catch (error) {
    console.log(error)
  }
  
}).catch((err) => {
  console.log(err);
});




return "hello";


}

createAccount();






export default function Home() {
  return (
    <>
      Hello
    </>
  )
}
