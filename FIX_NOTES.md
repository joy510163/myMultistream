# V1.4.1 verification notes

- Built against the supplied V1.4.0 source snapshot.
- TypeScript transpilation of all src TS/TSX files passed without syntax diagnostics.
- npm install / npm run build could not complete: registry.npmjs.org returned EAI_AGAIN.
- Full application/browser validation and GitHub Pages deployment remain pending.
- V1 share links remain schema version 1; optional viewMode and esports fields are validated against stream keys.
- On narrow displays esports stages stack (official on top, teams below) for 16:9 aspect ratio.
- Twitch embed min player size should be checked on target screens.
