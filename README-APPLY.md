# Apply the specified settings form

Copy `src/` and `vite.config.js` into the project root, replacing the existing files when prompted.

Then run:

```powershell
npm install -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

Add these scripts to the existing `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Verify:

```powershell
npm test
npm run lint
npm run build
npm run dev
```

Commit and push:

```powershell
git add .
git commit -m "feat: add specified settings form"
git push
```
