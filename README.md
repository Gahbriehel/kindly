# Kindly

Kindly is a modern web application built with Next.js, designed to provide a seamless user experience for client relationship management. It features a comprehensive marketing landing page and a dedicated application interface.

## Features

### Marketing Landing Page

The project includes a fully featured marketing site with the following sections:

- **Hero**: Engaging introduction with dynamic visuals.
- **Problem & Solution**: Clearly articulated value proposition.
- **How It Works**: Step-by-step guide for users.
- **Target Audience**: tailored content for specific user groups.
- **Vs Comparison**: Comparison with competitors or alternatives.
- **Features**: Detailed breakdown of platform capabilities.
- **Pricing**: Clear subscription plans.
- **Trust & Privacy**: Assurance of data security and reliability.
- **CTA**: Strong calls to action throughout the page.

### Application

- **App Interface**: A dedicated app section located at `/app`.
- **Interactive UI**: enhanced with smooth animations using Framer Motion.
- **Responsive Design**: Fully responsive layout using Tailwind CSS.
- **Dark Mode**: Built-in support for light and dark themes.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Linting/Formatting**: ESLint, Prettier

## Getting Started

First, install the dependencies:

```bash
yarn install
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Code Quality

To ensure code quality, consistency, and type safety, run the all-in-one check script before committing:

```bash
yarn check-all
```

This script runs:

1. `prettier --write` (Format code)
2. `prettier --check` (Verify formatting)
3. `eslint` (Lint code)
4. `tsc` (Type check)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
