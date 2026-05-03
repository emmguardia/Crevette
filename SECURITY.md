# Security Policy

## Supported versions

Only the `main` branch is actively maintained.

| Branch | Supported |
| ------ | --------- |
| `main` | ✅        |
| autres | ❌        |

## Reporting a vulnerability

If you find a security issue in this project, **please do not open a public
issue**. Instead, report it privately so it can be triaged and fixed before
public disclosure.

- Open a private security advisory:
  https://github.com/emmguardia/Crevette/security/advisories/new
- Or email the maintainer (see the GitHub profile).

Please include:

- A description of the issue and the impact you anticipate.
- Steps to reproduce (a minimal proof-of-concept is ideal).
- Affected pages, components or commits.
- Any suggested mitigation if you have one.

You can expect:

- An acknowledgement within **72 hours**.
- A first assessment within **7 days**.
- A coordinated disclosure once a fix is shipped.

## Scope

In scope:

- The static frontend in `Frontend/` (React app).
- The GitHub Actions workflows in `.github/workflows/`.
- The dependency tree (please use Dependabot for supply-chain alerts).

Out of scope:

- Vulnerabilities requiring a victim to install malicious browser extensions.
- Reports about missing security headers on third-party CDNs we do not control.
- Self-XSS that requires the victim to paste attacker-controlled code into
  the devtools console.

## Hardening already in place

- `Content-Security-Policy` meta tag restricting scripts to same-origin.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- All external `<a target="_blank">` links use `rel="noopener noreferrer"`.
- Dependabot weekly updates for npm and GitHub Actions.
- CodeQL scanning on push, pull-request and weekly schedule.
- Pinned Node version in CI, frozen pnpm lockfile.
