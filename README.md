# AgentSecrets Website

The official website for **AgentSecrets** — a resource hub for AI agent developers and practitioners. Built with [Next.js](https://nextjs.org), powered by [The Seventeen](https://theseventeen.co).

> 🌐 Live site: [agentsecrets.theseventeen.co](https://agentsecrets.theseventeen.co)  
> 🛠 Engineering blog: [engineering.theseventeen.co](https://engineering.theseventeen.co)  
> 🏢 Company: [theseventeen.co](https://theseventeen.co)

---

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-org/agentsecrets-website.git
cd agentsecrets-website
bun install
```

Then run the development server:

```bash
bun dev
# or
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

You can start editing the site by modifying files inside `src/app/`. The page auto-updates as you save changes.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org) | React framework & routing |
| [React 19](https://react.dev) | UI library |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| Vanilla CSS + CSS Variables | Styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Lucide React](https://lucide.dev) | Icons |

---

## Project Structure

```
src/
├── app/          # Next.js App Router pages & layouts
├── components/   # Reusable UI components
└── providers/    # Context providers (theme, etc.)
```

---

## Contributing

We welcome contributions from everyone! Please follow the guidelines below to keep things smooth and consistent.

### 1. Fork & Branch

- Fork the repository and create your branch from `main`.
- Use a descriptive branch name:
  - `feat/your-feature-name` for new features
  - `fix/your-bug-description` for bug fixes
  - `docs/your-doc-change` for documentation updates
  - `chore/your-task` for maintenance work

### 2. Code Style

- Follow the existing code style and conventions.
- Ensure TypeScript types are properly defined — avoid `any`.
- Keep components focused and reusable.
- Run the linter before submitting:

```bash
npm run lint
```

### 3. Commits

- Write clear, concise commit messages in the imperative mood:
  - ✅ `feat: add hero animation on scroll`
  - ✅ `fix: resolve mobile nav overflow`
  - ❌ `fixed stuff` / `updates`

### 4. Pull Requests

- Open your PR against the `main` branch.
- Include a short description of **what** changed and **why**.
- Reference any related issue (e.g. `Closes #42`).
- Ensure your branch is up to date with `main` before requesting a review.
- PRs that break existing functionality or skip linting will not be merged.

### 5. Review Process

- All PRs require at least **one approval** from a maintainer.
- Be responsive to review comments — PRs inactive for more than 14 days may be closed.

---

## Raising Issues

Found a bug? Have a feature request? Please use GitHub Issues and follow these rules:

### Bug Reports

When filing a bug, please include:

- **Description** — A clear summary of the problem.
- **Steps to reproduce** — Numbered steps to reliably reproduce the issue.
- **Expected behaviour** — What you expected to happen.
- **Actual behaviour** — What actually happened.
- **Environment** — Browser, OS, Node/Bun version, etc.
- **Screenshots or recordings** — If applicable.

### Feature Requests

- Describe the problem you're trying to solve, not just the solution.
- Explain why this feature would be valuable to AgentSecrets users.
- If possible, outline how you'd approach implementing it.

### Guidelines for All Issues

- Search existing issues before opening a new one — duplicates will be closed.
- Use a clear, descriptive title (e.g. `[Bug] Nav menu flickers on mobile` or `[Feature] Add dark mode toggle`).
- Be respectful and constructive. See our community standards below.

---

## Community Standards

We follow a simple code of conduct:

- Be kind, welcoming, and respectful to all contributors.
- Critique ideas, not people.
- Accept constructive feedback gracefully.
- Any harassment, discrimination, or abusive behaviour will result in removal.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) — Next.js features and API.
- [The Seventeen Engineering Blog](https://engineering.theseventeen.co) — How we build.
- [The Seventeen](https://theseventeen.co) — The company behind AgentSecrets.

---

## License

This project is maintained by [The Seventeen](https://theseventeen.co). All rights reserved unless otherwise stated.
