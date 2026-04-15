# TFT1Trick — Teamfight Tactics One-Trick Website

This is the source code for my Teamfight Tactics one-trick website, built with [Next.js](https://nextjs.org/) and TypeScript, with content authored in MDX, and deployed on [AWS](https://aws.amazon.com/).

## About

**[TFT1Trick.com](https://tft1trick.com/)** is a TFT project around one-trick playstyle and patch-based guidance.

## Project Structure

```text
├── content/
│   ├── patches/               # Patch-based guides in MDX
│   └── home/                  # Home page content sections in MDX
├── public/                    # Static assets
│   └── content/images/        # Images used by MDX content
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   └── patches/           # /patches route
│   ├── components/            # Reusable UI components
│   ├── lib/                   # MDX + patch utilities
│   └── schemas/               # Zod schemas
├── specs.md                   # Technical plan and architecture notes
├── next.config.ts             # Next.js configuration
├── package.json               # Scripts and dependencies
└── LICENSE                    # Dual license (CC BY 4.0 + MIT)
```

## Commands

| Command                 | Action                                     |
| :---------------------- | :----------------------------------------- |
| `npm install`           | Install dependencies                       |
| `npm run dev`           | Start local dev server at `localhost:3000` |
| `npm run build`         | Build production output                    |
| `npm run start`         | Run production server                      |
| `npm run lint`          | Run ESLint                                 |
| `npm run type-check`    | Run TypeScript checker (`tsc --noEmit`)    |
| `npm run test`          | Run unit tests                             |
| `npm run test:coverage` | Run unit tests with coverage               |
| `npm run format`        | Format files with Prettier                 |
| `npm run format:check`  | Check formatting with Prettier             |

## Deployment

- **Hosting:** AWS (S3 + CloudFront)
- **Infrastructure as Code:** Terraform
- **CI/CD:** GitHub Actions
- **DNS:** Cloudflare

## License

This repository uses dual licensing:

- **Documentation & Site Content**: Licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)
- **Code & Code Snippets**: Licensed under the [MIT License](LICENSE)

See the [LICENSE](LICENSE) file for full details.
