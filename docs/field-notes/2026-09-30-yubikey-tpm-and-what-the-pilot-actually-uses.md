# A YubiKey proves a person, a TPM proves a machine — what the Aegis Pilot uses today

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code (web) | Session: claude/festive-mccarthy-h6y6yu | Date: 30.09.2026 | Changes: Created from the HIC's question "in win11 laptop I have a Yubico key, can we use it for this?" and a pasted Gemini answer on TPM hosts, security keys and NVIDIA DGX. Facts checked against `src/aegis/pilot/` and `Store/PRODUCT_AEGIS.md`; the Gemini claims are sorted into confirmed, unverified and wrong for this codebase. | Harness: Claude Code + CLAUDE.md + DWS_TRUTH_STANDARD | HIC-approved-drift: none

Document Status:

- Created: 30.09.2026
- Status: PENDING_REVIEW (one HIC decision, §6)
- Related: `docs/plans/AEGIS_PILOT_DECISION_BOUNDARY.md` (row E1), `docs/security/AEGIS_PILOT_THREAT_MODEL.md` (T2, T4), blog draft `docs/blog-drafts/a-yubikey-proves-a-person-a-tpm-proves-a-machine.md`

---

## 1. The question

The HIC has a Yubico key and a Windows 11 laptop. Can the key be used for the Aegis Pilot? The HIC also pasted a Gemini explanation of TPM-equipped hosts, hardware security keys and NVIDIA DGX.

## 2. Two different proofs

|                    | TPM 2.0 (in the host)                                           | Security key (YubiKey)                                     |
| ------------------ | --------------------------------------------------------------- | ---------------------------------------------------------- |
| Proves             | This machine, booted this software, has not been swapped        | This person is physically present and holds this key       |
| Where it sits      | On the site host (the DGX Spark at M4)                          | In the operator's hand, plugged into the operator's laptop |
| Pilot record field | `provenance.attestation.tpmQuote`, `measuredBoot`, `rimVersion` | `provenance.attestation.hardwareKeys`                      |
| Used in the pilot  | **No** (all false, `rimVersion` null)                           | **No** (false)                                             |

A Windows 11 laptop always has a TPM 2.0 (Windows 11 requires it). That is the operator's laptop, not the site host, so it does not attest the site.

## 3. What the kit does today

- An operator's stop or decision is signed with an **Ed25519 private key held in a file** on the operator's machine, never in the state directory. The site verifies it against the public key inside the operator credential (`kill-authority.ts`, `decision-authority.ts`, `identity.ts`).
- The only signature scheme in the kit is Ed25519 through Node's `crypto` (`crypto.ts`: `signPayload`, `verifyPayload`).
- Nothing in `src/aegis/pilot/` talks to a TPM, FIDO2, WebAuthn, PIV or PKCS#11. The acceptance record says so explicitly.

**Answer to the HIC's question: not today.** A YubiKey cannot sign a stop command with the kit as built.

## 4. What using the YubiKey would take

The YubiKey signs through FIDO2/WebAuthn (a signature over authenticator data plus a challenge) or PIV (usually ECDSA P-256; whether it can do Ed25519 depends on the key's firmware, to be checked on the HIC's actual key). Either way the kit needs a **second signature scheme**:

1. The operator credential binds a WebAuthn (or PIV) public key instead of an Ed25519 key.
2. A small local operator tool on the laptop asks the key to sign the command digest as the challenge.
3. `kill-authority` and `decision-authority` verify the assertion, not a raw Ed25519 signature.

It is a change on the evidence path, so tests first, and it closes the largest residual in the threat model: T4 says "theft of the operator's key on the operator's own device is out of scope". With a hardware key, copying a file no longer impersonates the operator. Estimate: 2–3 working days plus the security review. It must merge before M4 (25.10) if the M4 stop is to be signed with the HIC's key.

## 5. The Gemini text, checked

**Consistent with the repo:** DWS does not resell hardware (`Store/PRODUCT_AEGIS.md`: "DWS does not resell hardware in any mode"); the customer or a partner buys the host and the keys. A TPM proves the machine and a security key proves the person.

**Not verifiable from this repo, treat as unchecked:** a discrete "NVIDIA DGX TPM module" as an orderable part; that DGX OS is "Ubuntu/RHEL"; whether the DGX Spark used at M4 exposes a usable TPM 2.0. Check on the machine (`ls /dev/tpm0 /dev/tpmrm0`, `tpm2_getcap properties-fixed`) before promising anything.

**Wrong for this codebase:** "DWS registers TPM endorsement certificates with Aegis/Pilot" and "PAM modules require a YubiKey touch for sudo". Neither exists. The kit has no TPM enrollment, no measured-boot check and no reference values (RIM). The enabling work the text prices as a service is work that has not been built yet.

## 6. Decision for the HIC

Boardy's third option for hardening (included at no extra price, conditional on the site, TPM 2.0 and a controlled boot chain as a Phase 0 gate, only new hardware priced) needs two pieces of code that do not exist: TPM quote and measured-boot attestation, and hardware-key signing. Which comes first for M4?

- (a) YubiKey signing for the operator stop, so the M4 stop is signed by a hardware key (2–3 days).
- (b) TPM quote and measured-boot check on the DGX Spark (larger; depends on the Spark's TPM).
- (c) Neither before M4; the record keeps saying "none", as the offers do.

Recommendation: (a), then (b) after M4 if the Spark has a TPM. (a) is smaller, upgrades the operator's identity proof at the exact moment a buyer watches, and needs no site hardware.

## 6a. Decisions taken after this note (HIC, 30.09.2026)

- Hardening is included, conditional on the site (H4). Wording of the offers and the Phase 0 template follows once the HIC approves it (D5).
- **Fact from the DGX Spark used at M4 (`gn100-cb5d`):** `ls /dev/tpm0 /dev/tpmrm0` → both "No such file or directory". Check `dmesg | grep -i tpm`, `ls /sys/class/tpm` and the UEFI security menu for a disabled firmware TPM before concluding there is none. Until then C8 (TPM) cannot be demonstrated on this box; C7 (hardware key) can, because the key lives on the operator's laptop.
- The blog post was approved with the follow-up line (H5, H6).

## 7. Session learning outcome

KB ingest, `Learn/` HTML render and Drive export: N/A — deferred to the day the blog post is approved (Rule 12). Calendar: none dated.
