# Contributing to Open Source Icon Recognition

Thank you for considering contributing to the Open Source Icon Recognition project! This guide will help you get started with contributing icons to our database.

## How to Contribute

### Prerequisites

- A GitHub account
- Basic knowledge of Git and GitHub (forking, creating branches, making commits, and creating pull requests)
- Knowledge of the application or browser extension you're adding

### Contributing Process

1. **Fork the Repository**
   - Go to the [Open Source Icon Recognition repository](https://github.com/username/open-source-icon-recognition)
   - Click the "Fork" button in the upper right corner

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/open-source-icon-recognition.git
   cd open-source-icon-recognition
   ```

3. **Create a Branch**
   ```bash
   git checkout -b add-icon-NAME
   ```
   Replace `NAME` with the name of the application or extension you're adding.

4. **Prepare Your Icon**
   - Ensure your icon is in PNG format with a transparent background
   - Optimize the icon size to 48x48px or 64x64px
   - Name the file using the application/extension ID (lowercase, hyphens for spaces)
   - Place it in the appropriate directory:
     - System tray icons: `data/stir/icons/`
     - Browser extension icons: `data/beir/icons/`

5. **Update the Database**
   - For system tray icons, update `data/stir/stir-database.json`
   - For browser extension icons, update `data/beir/beir-database.json`
   - Add your entry in the following format:

   For STIR (System Tray Icons):
   ```json
   {
     "id": "application-id",
     "name": "Application Name",
     "category": "Category",
     "description": "Short description",
     "platforms": {
       "windows": true/false,
       "mac": true/false,
       "linux": true/false
     },
     "icon_path": "icons/application-id.png"
   }
   ```

   For BEIR (Browser Extension Icons):
   ```json
   {
     "id": "extension-id",
     "name": "Extension Name",
     "category": "Category",
     "description": "Short description",
     "browsers": {
       "chrome": true/false,
       "firefox": true/false
     },
     "icon_path": "icons/extension-id.png"
   }
   ```

6. **Validate Your Changes**
   - Make sure your JSON is valid
   - Ensure your icon is properly formatted and displays correctly
   - Test locally by running the site with GitHub Pages or a local server

7. **Commit and Push Your Changes**
   ```bash
   git add data/
   git commit -m "Add icon for ApplicationName"
   git push origin add-icon-NAME
   ```

8. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "Pull Request" and then "New Pull Request"
   - Ensure the base repository is the original repo and the base branch is `main`
   - Provide a descriptive title and description for your changes
   - Submit the pull request

## Guidelines for Icons

### Icon Requirements

- **Format**: PNG with transparent background
- **Size**: 48x48px or 64x64px (preferred)
- **Quality**: Clear, recognizable, and representative of the application/extension
- **Source**: Use the official icon whenever possible
- **Copyright**: Ensure you have the right to use and share the icon

### Database Entry Guidelines

- **ID**: Lowercase with hyphens instead of spaces (e.g., "microsoft-teams")
- **Name**: Official name of the application/extension
- **Category**: Choose from existing categories when possible, or create a new one if necessary
- **Description**: Brief (under 100 characters) description of what the application/extension does
- **Platforms/Browsers**: Accurately mark which platforms/browsers the app/extension is available on

## Common Categories

To maintain consistency, please use these common categories when applicable:

- **Communication**: Chat, messaging, email, video conferencing
- **Development**: IDEs, code editors, dev tools
- **Productivity**: Note-taking, to-do lists, calendars
- **Media**: Music, video, streaming services
- **Gaming**: Game platforms, game-related tools
- **Security**: VPNs, password managers, antivirus
- **File Storage**: Cloud storage, file sync services
- **Social Media**: Social networking platforms
- **Utilities**: System utilities, small helper tools

## Questions?

If you have any questions or need help with your contribution, please:

1. Open an issue with your question
2. Contact the project maintainers

Thank you for your contribution to making the Open Source Icon Recognition project better!