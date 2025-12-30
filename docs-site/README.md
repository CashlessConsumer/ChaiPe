# ChaiPe Documentation Site

This directory contains the documentation website for ChaiPe, deployed to GitHub Pages.

## Directory Structure

```
docs-site/
├── index.html                 # Main landing page
├── docs/                      # Documentation pages
│   ├── index.html            # Documentation home
│   ├── api.html              # API reference
│   ├── configuration.html    # Configuration guide
│   ├── integration.html      # Integration guide
│   └── tipjar.html           # TipJar documentation
├── demos/                     # Interactive demos
│   ├── playground.html       # Configuration playground
│   ├── blog-demo.html        # Blog post demo
│   └── edge-cases.html       # Edge cases and advanced usage
├── legal/                     # Legal pages
│   ├── privacy.html          # Privacy policy
│   ├── disclaimer.html       # Disclaimer
│   └── releases.html         # Release notes
├── shared/                    # Shared resources
│   ├── css/
│   │   ├── common.css        # Common styles
│   │   ├── docs-layout.css   # Documentation layout
│   │   └── components.css    # Component styles
│   └── js/
│       ├── docs-nav.js       # Documentation navigation
│       └── demo-utils.js     # Demo utilities
└── assets/
    └── images/               # Images and logos
```

## Development

### Local Development Server

To start a development server for the documentation site:

```bash
# From the project root
npm run docs:dev
```

This will start a local server at `http://localhost:8080` and open it in your browser.

### Local Preview

To preview the documentation site locally:

```bash
# From the project root
npm run docs:preview
```

This will start a local server at `http://localhost:8080` and open it in your browser.

### Building the Site

To build the documentation site:

```bash
# From the project root
npm run docs:build
```

This will:
1. Build the ChaiPe library (`npm run build`)
2. Copy the docs-site directory to `dist/docs/`
3. Include the built library files (`chaipe.min.js`, `chaipe.js`, `chaipe.esm.js`) in the docs directory
4. Create a deployment-ready structure

### Manual Deployment

To deploy the documentation site manually:

```bash
# From the project root
npm run docs:deploy
```

This will:
1. Build the documentation site
2. Deploy to GitHub Pages using the `gh-pages` package
3. The site will be available at `https://srikanthlogic.github.io/ChaiPe/`

**Note:** Manual deployment is typically not needed as automatic deployment is configured via GitHub Actions.

## Automatic Deployment

The documentation site is automatically deployed to GitHub Pages when:

1. Code is pushed to the `main` branch
2. Changes are made to files in the `docs-site/` directory
3. The workflow is manually triggered from the GitHub Actions tab

### Workflow Details

The deployment workflow (`.github/workflows/docs-deploy.yml`):

1. **Build Job**:
   - Checks out the repository
   - Sets up Node.js environment
   - Installs dependencies
   - Builds the ChaiPe library
   - Copies docs-site files to `dist/docs/`
   - Includes built library files
   - Uploads the artifact

2. **Deploy Job**:
   - Deploys the artifact to GitHub Pages
   - Runs only after successful build
   - Uses GitHub Pages deployment action

## GitHub Pages Configuration

### Setting Up GitHub Pages

1. Go to your repository Settings
2. Navigate to "Pages" in the sidebar
3. Under "Build and deployment", select "GitHub Actions" as the source
4. Save the configuration

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file in the `docs-site/` directory
2. Add your domain to the `CNAME` file (e.g., `docs.chaipe.org`)
3. Configure DNS settings with your domain provider
4. Update the workflow to include the `CNAME` file in the build

## Content Guidelines

### Documentation Pages

Documentation pages should:
- Use semantic HTML5
- Include proper meta tags for SEO
- Link to the shared CSS and JS files
- Be responsive and mobile-friendly
- Include code examples with syntax highlighting

### Demo Pages

Demo pages should:
- Include the ChaiPe library (either from `dist/` or CDN)
- Use the shared demo utilities
- Have clear instructions for usage
- Be interactive and engaging

### Legal Pages

Legal pages should:
- Be clear and concise
- Cover all necessary legal aspects
- Be reviewed by legal counsel if needed
- Be updated regularly

## Assets

### Images

Place all images in the `assets/images/` directory. Use descriptive filenames and optimize images for web.

### Icons

Use SVG icons for scalability. Place them in `assets/images/icons/` if you have many icons.

## Shared Resources

### CSS

- `common.css`: Base styles, typography, reset
- `docs-layout.css`: Documentation-specific layout (sidebar, navigation)
- `components.css`: Reusable components (buttons, cards, code blocks)

### JavaScript

- `docs-nav.js`: Documentation navigation logic
- `demo-utils.js`: Demo page utilities and helpers

## Troubleshooting

### Build Issues

If the build fails:

1. Check that all dependencies are installed: `npm install`
2. Ensure the ChaiPe library builds successfully: `npm run build`
3. Verify the docs-site directory structure is correct
4. Check that the `.nojekyll` file exists in the docs-site directory

### Deployment Issues

If deployment fails:

1. Check the GitHub Actions logs for specific errors
2. Ensure GitHub Pages is enabled in repository settings
3. Verify the workflow has the necessary permissions
4. Check that the branch protection rules don't block deployment
5. Confirm that "GitHub Actions" is selected as the Pages source

### Local Preview Issues

If local preview doesn't work:

1. Ensure `http-server` is installed: `npm install -g http-server`
2. Check that port 8080 is not in use
3. Try running with a different port: `npx http-server . -p 8081`

## Contributing

When contributing to the documentation site:

1. Test all changes locally before committing
2. Ensure all links work correctly
3. Check mobile responsiveness
4. Run `npm run docs:build` to verify the build
5. Follow the existing code style and structure

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [ChaiPe Repository](https://github.com/srikanthlogic/ChaiPe)
