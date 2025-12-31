# Contributing to CapCut Account Creator Bot

First off, thank you for considering contributing to CapCut Account Creator Bot! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Include your environment details** (OS, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/capcut-bot.git
cd capcut-bot

# Install dependencies
npm install

# Create password file
echo "TestPassword123!" > password.txt

# Run the application
npm start
```

## Coding Guidelines

### JavaScript Style Guide

- Use ES6+ features
- Use async/await instead of callbacks
- Use meaningful variable and function names
- Add JSDoc comments for functions
- Keep functions small and focused
- Follow the existing code style

### File Structure

```
src/
├── config/         # Configuration files
├── core/           # Core application logic
├── services/       # Service layer (business logic)
├── utils/          # Utility functions
└── main.js         # Entry point
```

### Naming Conventions

- **Files**: PascalCase for classes (e.g., `BrowserService.js`), camelCase for others (e.g., `helpers.js`)
- **Classes**: PascalCase (e.g., `AccountCreator`)
- **Functions**: camelCase (e.g., `createAccount`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `CONFIG`)
- **Private methods**: Prefix with underscore (e.g., `_privateMethod`)

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

Examples:
```
Add email validation feature
Fix bug in OTP retrieval
Update README with new configuration options
Refactor BrowserService for better error handling
```

## Architecture Guidelines

### Service Layer

Each service should:
- Have a single, well-defined responsibility
- Be stateless (use static methods)
- Have proper error handling
- Be testable in isolation

### Error Handling

- Use try-catch blocks appropriately
- Throw meaningful error messages
- Log errors with proper context
- Don't swallow errors silently

### Configuration

- Add new configurations to `config.js`
- Use constants instead of magic numbers
- Document configuration options

## Testing

While we don't have automated tests yet, please:
- Manually test your changes thoroughly
- Test edge cases
- Ensure existing functionality still works

## Documentation

- Update README.md if you change functionality
- Update CHANGELOG.md following Keep a Changelog format
- Add JSDoc comments for new functions
- Update inline comments as needed

## Questions?

Feel free to contact the maintainer at admin@countryssh.com or open an issue for discussion.

Thank you for contributing! 🙏