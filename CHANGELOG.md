# Changelog
All notable changes to the Shortcut Manager extension will be documented in this file.

## [1.0.0] - 2024-07-25
### Added
- Initial release of the Shortcut Manager extension.
- Functionality to customize Firefox shortcuts for various browser actions:
  - Duplicate the current tab (default: Alt+Shift+D)
  - Open a new tab (default: Ctrl+T)
  - Open the most recently closed tab (default: Alt+Shift+T)
  - Mute or unmute the current tab (default: Alt+Shift+M)
- Options page for users to customize their shortcut preferences.
- Background script to handle shortcut commands and perform corresponding actions.
- Popup interface for quick access to configuration and information.

### Features
- User-friendly interface for setting custom keyboard shortcuts.
- Real-time shortcut recording and validation.
- Persistent storage of user preferences using browser.storage.sync.
- Error handling and user feedback for invalid shortcut combinations.

### Technical Details
- Implemented using Firefox WebExtensions API.
- Utilizes browser.commands API for managing keyboard shortcuts.
- Responsive design for the options and popup pages.
