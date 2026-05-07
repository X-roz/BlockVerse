# BlockVerse — Utility Hub

> A hands-on platform for developers and learners to explore blockchain and cryptographic concepts interactively.

---

## Vision

BlockVerse is built around one idea: **understanding by doing**.

Most developers learn cryptographic and blockchain concepts through documentation and theory — addresses, key pairs, hash functions, encodings. BlockVerse turns that theory into something you can touch. You generate a real keypair. You watch a real hash change as you modify the input. You validate an address and see exactly why it passes or fails.

The platform is designed for:

- **Developers** building on Solana, Ethereum, or Bitcoin who want to quickly verify behaviors, test address formats, or understand how hashing fits into their stack.
- **Learners** who want to go beyond reading about secp256k1, Keccak-256, or Bech32 and actually see them in action.

There is no bloat. Every tool on the platform exists to illuminate a concept.

---

## Project Structure

```
BlockVerse/
└── utility-hub/          # Next.js application (the platform)
    ├── src/
    │   ├── app/
    │   │   ├── address-util/     # Blockchain address tools
    │   │   ├── hash-play/        # Cryptographic hashing tools
    │   │   ├── components/       # Shared UI components
    │   │   └── api/              # Next.js API route handlers
    │   ├── utils/
    │   │   ├── validators/       # Address validation logic
    │   │   └── hashing/          # SHA-2 hashing utilities
    │   └── lib/                  # Network and config setup
```

---

## Features

### Address Utilities — `/address-util`

A step-by-step toolkit for generating and validating blockchain addresses across three networks.

#### Ethereum (ETH)

- Generate a secp256k1 keypair (private key + public key)
- Derive the Ethereum address from the public key
- Apply EIP-55 mixed-case checksum to the address
- Validate any address: checksum correctness, format detection

#### Bitcoin (BTC)

- Generate a keypair with a WIF-encoded private key
- Derive both compressed and uncompressed public keys
- Generate two address formats:
  - **Legacy (Base58 / P2PKH)** — starts with `1` or `3`
  - **SegWit (Bech32)** — starts with `bc1`
- Validate any address: encoding type, address type (P2PKH / P2SH / SegWit / Taproot), network (mainnet / testnet)

#### Solana (SOL)

- Generate a Base58-encoded keypair
- The public key is the wallet address — no derivation step
- Validate any address: encoding, byte length, public key format

Each network tab walks through generation in numbered steps, making the underlying process visible rather than hiding it behind a single button.

---

### Hash-Play — `/hash-play`

An interactive playground for exploring cryptographic hash functions. Input any text, pick an algorithm, and see the output instantly. Change a single character and watch the entire hash change — that's the avalanche effect, demonstrated live.

#### SHA-2

| Algorithm | Output |
|-----------|--------|
| SHA-256   | 256-bit digest |
| SHA-224   | 224-bit digest |
| SHA-512   | 512-bit digest |
| SHA-384   | 384-bit digest |

#### SHA-3

| Algorithm   | Output | Notes |
|-------------|--------|-------|
| SHA3-256    | 256-bit digest | NIST standard |
| SHA3-512    | 512-bit digest | NIST standard |
| Keccak-256  | 256-bit digest | Ethereum's hash function |

Both tabs support:

- **Input encodings:** UTF-8, Hex, Base64
- **Output formats:** Hex and Base64
- **Hash metadata:** bit count, byte length, hex character count
- **Verification mode:** paste an expected hash and compare it against the computed result — useful for integrity checks

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS, Framer Motion, Lucide icons |
| Theming | next-themes (light / dark) |
| Ethereum | ethers v6, ethereum-cryptography, @noble/secp256k1 |
| Bitcoin | @noble/secp256k1, bs58check, bech32 |
| Solana | @solana/web3.js |
| Hashing | Web Crypto API (SHA-2), js-sha3 + sha3/Keccak (SHA-3) |
| Auth | jsonwebtoken |

---

## Roadmap

Planned additions that align with the platform's vision:

- **Merkle Tree visualizer** — build and traverse trees interactively
- **Base encoding tools** — Base58, Base64, Hex encode/decode
- **ECDSA signing playground** — sign a message, verify the signature, understand the math
- **Transaction decoder** — paste a raw transaction and see what's inside
- **More chains** — Cosmos (Bech32), Tron (Base58Check), others

---

## Running Locally

```bash
cd utility-hub
npm install
npm run dev       # development server at http://localhost:3000
```

For production:

```bash
npm run build
npm run start
```

---

## Design Philosophy

- **No magic buttons.** Every generation flow shows each step explicitly so the user understands what is happening.
- **Real outputs only.** Every keypair, address, and hash is computed using production-grade cryptographic libraries — not mocked data.
- **Concept first, UI second.** Animations and styling support the learning experience; they do not overshadow it.
