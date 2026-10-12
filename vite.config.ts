import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// GitHub Pages project sites use /<repository>/, user sites use /.
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
export default defineConfig({plugins:[react()],base:process.env.GITHUB_ACTIONS === 'true' && repo && !repo.endsWith('.github.io') ? `/${repo}/` : '/'});
