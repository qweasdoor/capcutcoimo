# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-11-01

### Added
- Complete refactoring with modular architecture
- Separation of concerns with service layers
- Configuration management system
- Comprehensive error handling
- Enhanced logging with colors
- Better code documentation
- Type hints and JSDoc comments

### Changed
- Restructured project into organized modules
- Improved code readability and maintainability
- Enhanced error messages
- Better user interface

### Architecture
- **Config Layer**: Centralized configuration
- **Core Layer**: Main application orchestrator
- **Service Layer**: Business logic separation
  - BrowserService: Puppeteer operations
  - CapCutService: Account creation workflow
  - EmailService: Temp-Mail API integration
  - FileService: File operations
  - UserInterface: User interaction
- **Utils Layer**: Helper functions

## [1.0.0] - Initial Release

### Added
- Basic account creation functionality
- Puppeteer integration
- Temp-Mail API integration
- Random user agent
- Random birthday generation
- Account saving to file