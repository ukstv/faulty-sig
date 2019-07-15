# Faulty Sig

This repository exists to demonstrate a point of vanilla OpenZeppelin library (read stdlib for Solidity smart contracts)
and Web3 v1.0 treating signatures differently.

Ethereum signature actually comprises three numbers, `r`, `s`, `v`. The first two represent point coordinates,
in an ambiguous way. The ambiguity is resolved by the latter value `v`, which encodes what actual point on a plane
corresponds to `r`, `s` coordinates.
[Ethereum Yellow Page](https://ethereum.github.io/yellowpaper/paper.pdf) states valid values to be `27` or `28`.

Based on a _tradition_, for lack of better words, this number actually could be either `0`/`1` or `27`/`28`.

OpenZeppelin ECDSA contract expects it to be 27 or 28. It removed support of the `0`/`1` values
[to mitigate a replay attack](https://github.com/OpenZeppelin/openzeppelin-solidity/pull/1622) some time ago.

It seems, web3 v1.0 belongs to a different tradition setting `v` to `0`/`1`. In order to demonstrate that, I modified
vanilla MetaCoin Truffle box, to do `ECDSA.recover` of a signature prepared by web3. Hopefully, I did something wrong.
If not, this is a case of miscoordination.

---

1 hour later. Ok, it is not web3. My mistake was to conflate web3 and whatever manages a private key. For the present case,
Ganache is <strike>was</strike> to blame: https://github.com/trufflesuite/ganache-core/issues/427.
The new release is [soon](https://github.com/trufflesuite/ganache-core/issues/451). Looking forward to having this for real.  

---

Sergey Ukustov <sergey@ukstv.me>
