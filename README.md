# Open Source Icon Recognition

A crowd-sourced database for recognizing application icons in system trays/menu bars and browser extensions. See it in action [HERE](https://franklyfuzzy.github.io/open-source-icon-recognition/).

## Project Components

The project consists of two main components:

### STIR (System Tray Icon Recognition)
A collection of system tray/menu bar icons across Windows, Mac, and Linux platforms.

### BEIR (Browser Extension Icon Recognition)
A collection of browser extension icons across Chrome, Firefox, Edge, and other browsers.

## Purpose

This project aims to create an easily accessible, open-source database that helps identify applications running on a machine based on their system tray or browser extension icons. The database is manually curated with a focus on the most recognized default versions of icons.

## Features

- Search and filter icons by name, category, and platform/browser
- Visual table display of icons with metadata
- Simple, static implementation with no backend requirements
- JSON-based database for easy contributions and usage
- Organized repository structure for collaborative development

## How to Use

1. Visit the web interface to browse the icon database
2. Use the search box to find specific applications or extensions
3. Apply filters to narrow down results by category or platform/browser
4. Click on icon entries for more details

## Contributing

We welcome contributions to expand the icon database! Please follow these steps:

1. Fork the repository
2. Add new icon file(s) to the appropriate folder (`data/stir/icons/` or `data/beir/icons/`)
3. Update the corresponding JSON database file with the new icon metadata
4. Submit a pull request with your changes

Please ensure that:
- Icon files are PNG format with transparency
- Icon dimensions are 24x24 pixels (or vector-based)
- Only include default/official versions of icons
- Provide accurate metadata including application name, category, and supported platforms

## Project Scope

This project focuses on:
- Manually curated, crowd-sourced icon database
- Common, recognizable default application icons
- Structured, searchable metadata
- Simple visual browsing interface

Out of scope:
- Automatic icon recognition or matching
- User-uploaded icon identification
- Custom or modified icon variants
- Icon packs or themes

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- All contributors who help build and maintain the icon database
- Original application and extension developers who created the icons
