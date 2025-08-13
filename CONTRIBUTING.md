# Contributing to stl-kit

Thank you for your interest in contributing to **stl-kit** — a modern JavaScript & TypeScript Standard Template Library (STL)! We welcome contributions from the community and appreciate your help in making this library better.

## Table of Contents

- [Getting Started](#getting-started)
- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
  - [Reporting Issues](#reporting-issues)
  - [Feature Requests](#feature-requests)
  - [Submitting Code](#submitting-code)
- [Testing Your Changes](#testing-your-changes)
- [Style Guide](#style-guide)
- [License](#license)

## Getting Started

To get started with contributing, please ensure you have the following prerequisites:

- Node.js (version 14 or higher)
- npm (Node Package Manager)

Clone the repository to your local machine:

```sh
git clone git@github.com:sshuvoo/stl-kit.git
cd stl-kit
```

Install the dependencies:

```sh
npm install
```

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand the expectations for participation in this project.

## How to Contribute

### Reporting Issues

If you encounter any bugs or issues, please report them by creating a new issue in the GitHub repository. Provide as much detail as possible, including:

- A clear description of the issue
- Steps to reproduce the issue
- Any relevant error messages or logs

### Feature Requests

We welcome feature requests! If you have an idea for a new feature or improvement, please create a new issue and describe your proposal. Include details on how the feature would benefit users of the library.

### Submitting Code

1. **Fork the repository**: Click the "Fork" button on the top right of the repository page.
2. **Create a new branch**: Create a new branch for your feature or bug fix.
   ```sh
   git checkout -b my-feature-branch
   ```
3. **Make your changes**: Implement your feature or fix the bug.
4. **Commit your changes**: Write a clear and concise commit message.

   > **Please use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for your commit messages.** This helps automate changelogs and makes your contributions easier to review. Learn more at [conventionalcommits.org](https://www.conventionalcommits.org/en/v1.0.0/).

   Example:

   ```sh
   git commit -m "feat(linked-list): add reverse method"
   ```

5. **Push to your fork**: Push your changes to your forked repository.
   ```sh
   git push origin my-feature-branch
   ```
6. **Create a Pull Request**: Go to the original repository and create a Pull Request from your branch. Provide a description of your changes and reference any related issues.

## Testing Your Changes

Before submitting your changes, ensure that all tests pass. You can run the tests using the following command:

```sh
npm run test
```

If you are adding new features, please include tests to cover your changes. Test coverage is important for maintaining code quality.

## Style Guide

To maintain consistency in the codebase, please adhere to the following style guidelines:

- Follow TypeScript and modern JavaScript best practices.
- Use descriptive variable and function names.
- Write clear and concise comments where necessary.
- Ensure proper indentation and formatting (use Prettier: `npm run format`).
- Keep pull requests focused and minimal; unrelated changes should be submitted separately.

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License. Please see the [LICENSE](LICENSE) file for more information.

---

Thank you for contributing to **stl-kit**! Your efforts help improve the library for everyone. If you have any questions, feel free to reach out to the maintainers via GitHub Discussions or Issues.
