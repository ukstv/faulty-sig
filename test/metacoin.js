const MetaCoin = artifacts.require('MetaCoin');
const util = require('ethereumjs-util')

// S.U.: Copied from ethereumjs-util `fromRpcSig`, with adjustment: do not increment v.
function fromRpcSig(sig) {
  var buf = util.toBuffer(sig);
  // NOTE: with potential introduction of chainId this might need to be updated
  if (buf.length !== 65) {
    throw new Error('Invalid signature length');
  }
  var v = buf[64];
  // support both versions of `eth_sign` responses
  // S.U.: Actually, let me comment that out for illustrative purposes.
  // if (v < 27) {
  //   v += 27;
  // }
  return {
    v: v,
    r: buf.slice(0, 32),
    s: buf.slice(32, 64),
  };
}

function incrementV(signature) {
  const parts = util.fromRpcSig(signature) // It increases "v" by 27 if v<27
  return util.toRpcSig(parts.v, parts.r, parts.s)
}

contract('MetaCoin', (accounts) => {
  const account = accounts[0]
  const digest = web3.utils.soliditySha3({t: 'string', v: 'something'})

  it('does not sign', async () => {
    const signature = await web3.eth.sign(digest, account)
    const metaCoinInstance = await MetaCoin.deployed();
    const recovered = await metaCoinInstance.recover.call(digest, signature)
    console.log('---------- DOES NOT SIGN')
    console.log('signature', signature)
    // console.log('signature parts', fromRpcSig(signature))
    console.log('v=', fromRpcSig(signature).v)
    console.log('account', account)
    console.log('recovered', recovered)
    console.log('----------')
    assert.equal(recovered, account, 'Recovered incorrect address') // Failure
  })

  it('signs right after setting v to 27/28', async () => {
    const signature = await web3.eth.sign(digest, account)
    const properSignature = incrementV(signature)
    const metaCoinInstance = await MetaCoin.deployed();
    const recovered = await metaCoinInstance.recover.call(digest, properSignature)
    console.log('---------- SIGNS AFTER INCREASED V')
    console.log('signature', signature)
    // console.log('signature parts', fromRpcSig(properSignature))
    console.log('v=', fromRpcSig(properSignature).v)
    console.log('account', account)
    console.log('recovered', recovered)
    console.log('----------')
    assert.equal(recovered, account, 'Recovered incorrect address') // Pass
  })
});
