import React, { Component } from 'react'
import { PublicKey,Keypair } from '@solana/web3.js'

export default class index extends Component {

  state = {
    on:0,
    phantomPubKey:null,
    compID:null,
    compEscrow:null,
    cm:null
  }

  async getProvider()
  {
    const isPhantomInstalled = window.solana && window.solana.isPhantom
    if(!isPhantomInstalled)
    {
      alert("Install Phatom Wallet")
      window.open("https://phantom.app/", "_blank");
      return 0
    }

    const resp = await window.solana.connect();
    const phantomPubKey = new PublicKey(resp.publicKey.toString())

    this.setState({phantomPubKey:resp.publicKey.toString()})


    //create competition escrow
    const PROGRAM_ID = '2htxnCLUYFZ8pupxAnf86pBiBrBnyRDPiz2NfC4jQzmH';
    const programPublicKey = new PublicKey(PROGRAM_ID);
    const currentDate = new Date(); 
    const timestamp = currentDate.getTime();
    let basePubkey = phantomPubKey;
    let seed = timestamp.toString();
    let programId = programPublicKey;

    console.log(
      `${(
        await PublicKey.createWithSeed(basePubkey, seed, programId)
      ).toBase58()}`
    );

    let derived = await PublicKey.createWithSeed(basePubkey, seed, programId)
    console.log("Derived");
    console.log(derived.toBuffer())


    let [pda, bump] = await PublicKey.findProgramAddressSync(
      [derived.toBuffer()],
      programId
    );
    console.log(`bump: ${bump}, pubkey: ${pda.toBase58()}`);

    this.setState({compEscrow:pda.toBase58()})

    this.nextState();


  }

  handleChange(event){
    this.setState({cm:event.target.value});
  };


  validateCandyMachine()
  {
    console.log(String(this.state.cm).length)

    if(String(this.state.cm).length < 44)
    {
      alert("Invalid CandyMachineID")
    }
  }

  componentDidMount(): void {

    console.log("here we go");
      //phantom flow 
  }

  getCandy()
  {
    
  }

  nextState()
  {
    this.setState({on:this.state.on+1})
  }



  render() {

    switch (this.state.on) {
      case 0:
        return (
          <div className="centered-div">
            <div style={{marginBottom:25}}>blendhit</div>
            <button onClick={this.getProvider.bind(this)}>connect wallet</button>
          </div>
        )
      
      case 1:  
      return (
        <div className="centered-div">
          <div style={{marginBottom:25}}>Please Create A CandyMachine & Set Mint Treasury As</div>
          <div style={{marginBottom:25}}>{this.state.compEscrow}</div>
          <button onClick={this.nextState.bind(this)} >I Did It</button>
        </div>
      )

      case 2: 
      return (
        <div className="centered-div">
          <div style={{marginBottom:25}}>What is the Candy Machine ID ?</div>
          <input style={{marginBottom:25}} placeholder="Candy Machine ID"></input>
          <button onClick={this.validateCandyMachine.bind(this)} >Enter</button>
        </div>
      ) 
    
      default:
        return 0;
    }

  }
}
