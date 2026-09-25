// Project templates

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  files: Array<{ path: string; content: string }>;
}

export const templates: ProjectTemplate[] = [
  {
    id: 'vanilla-ts',
    name: 'Vanilla TypeScript',
    description: 'Minimal TypeScript project with no framework',
    category: 'Starter',
    files: [
      {
        path: 'src/main.ts',
        content: `// Vanilla TypeScript

interface User {
  id: string;
  name: string;
  email: string;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}

const user: User = {
  id: '1',
  name: 'World',
  email: 'hello@example.com',
};

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = \`<h1>\${greet(user)}</h1>\`;
  }
});
`,
      },
      {
        path: 'src/index.html',
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vanilla TypeScript</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
`,
      },
      {
        path: 'package.json',
        content: JSON.stringify({
          name: 'vanilla-ts',
          version: '0.1.0',
          scripts: { dev: 'vite', build: 'tsc && vite build', preview: 'vite preview' },
          devDependencies: { typescript: '^5.0.0', vite: '^5.0.0' },
        }, null, 2),
      },
      {
        path: 'tsconfig.json',
        content: JSON.stringify({
          compilerOptions: {
            target: 'ES2022',
            module: 'ESNext',
            moduleResolution: 'bundler',
            strict: true,
            skipLibCheck: true,
          },
          include: ['src'],
        }, null, 2),
      },
    ],
  },
  {
    id: 'react-ts',
    name: 'React + TypeScript',
    description: 'React application with TypeScript using Vite',
    category: 'React',
    files: [
      {
        path: 'src/main.tsx',
        content: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`,
      },
      {
        path: 'src/App.tsx',
        content: `import { useState } from 'react';

interface CounterProps {
  initialCount?: number;
}

function Counter({ initialCount = 0 }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}

export default function App() {
  return (
    <main>
      <h1>React + TypeScript</h1>
      <Counter />
    </main>
  );
}
`,
      },
      {
        path: 'src/index.css',
        content: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, sans-serif;
  padding: 2rem;
}

.counter {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

button {
  padding: 0.25rem 0.75rem;
  font-size: 1.25rem;
  cursor: pointer;
}
`,
      },
      {
        path: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
      },
      {
        path: 'package.json',
        content: JSON.stringify({
          name: 'react-ts',
          version: '0.1.0',
          scripts: { dev: 'vite', build: 'tsc -b && vite build', preview: 'vite preview' },
          dependencies: { react: '^19.0.0', 'react-dom': '^19.0.0' },
          devDependencies: {
            '@types/react': '^19.0.0',
            '@types/react-dom': '^19.0.0',
            '@vitejs/plugin-react': '^4.0.0',
            typescript: '^5.0.0',
            vite: '^6.0.0',
          },
        }, null, 2),
      },
      {
        path: 'tsconfig.json',
        content: JSON.stringify({
          compilerOptions: {
            target: 'ES2022',
            lib: ['ES2022', 'DOM', 'DOM.Iterable'],
            module: 'ESNext',
            moduleResolution: 'bundler',
            jsx: 'react-jsx',
            strict: true,
            skipLibCheck: true,
          },
          include: ['src'],
        }, null, 2),
      },
      {
        path: 'vite.config.ts',
        content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`,
      },
    ],
  },
  {
    id: 'node-ts',
    name: 'Node.js + TypeScript',
    description: 'Node.js server with TypeScript',
    category: 'Backend',
    files: [
      {
        path: 'src/index.ts',
        content: `import http from 'node:http';

interface RequestHandler {
  (req: http.IncomingMessage, res: http.ServerResponse): void;
}

const handler: RequestHandler = (req, res) => {
  const { method, url } = req;
  console.log(\`\${method} \${url}\`);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello from Node.js + TypeScript!' }));
};

const server = http.createServer(handler);
const PORT = process.env.PORT ?? 3000;

server.listen(PORT, () => {
  console.log(\`Server running at http://localhost:\${PORT}\`);
});
`,
      },
      {
        path: 'package.json',
        content: JSON.stringify({
          name: 'node-ts',
          version: '0.1.0',
          type: 'module',
          scripts: {
            dev: 'tsx watch src/index.ts',
            build: 'tsc',
            start: 'node dist/index.js',
          },
          devDependencies: {
            '@types/node': '^20.0.0',
            tsx: '^4.0.0',
            typescript: '^5.0.0',
          },
        }, null, 2),
      },
      {
        path: 'tsconfig.json',
        content: JSON.stringify({
          compilerOptions: {
            target: 'ES2022',
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            outDir: 'dist',
            strict: true,
            skipLibCheck: true,
          },
          include: ['src'],
        }, null, 2),
      },
    ],
  },
  {
    id: 'hono-ts',
    name: 'Hono + TypeScript',
    description: 'Hono web framework with TypeScript',
    category: 'Backend',
    files: [
      {
        path: 'src/index.ts',
        content: `import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

type User = {
  id: string;
  name: string;
  email: string;
};

const users: User[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

const app = new Hono();

app.use('*', cors());
app.use('*', logger());

app.get('/', c => c.json({ message: 'Hono API' }));

app.get('/users', c => c.json(users));

app.get('/users/:id', c => {
  const user = users.find(u => u.id === c.req.param('id'));
  if (!user) return c.json({ error: 'Not found' }, 404);
  return c.json(user);
});

app.post('/users', async c => {
  const body = await c.req.json<Omit<User, 'id'>>();
  const user: User = { id: String(users.length + 1), ...body };
  users.push(user);
  return c.json(user, 201);
});

export default app;
`,
      },
      {
        path: 'src/server.ts',
        content: `import { serve } from '@hono/node-server';
import app from './index';

const PORT = Number(process.env.PORT) || 3000;

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(\`Hono server running at http://localhost:\${PORT}\`);
});
`,
      },
      {
        path: 'package.json',
        content: JSON.stringify({
          name: 'hono-ts',
          version: '0.1.0',
          type: 'module',
          scripts: {
            dev: 'tsx watch src/server.ts',
            build: 'tsc',
            start: 'node dist/server.js',
          },
          dependencies: {
            hono: '^4.0.0',
            '@hono/node-server': '^1.0.0',
          },
          devDependencies: {
            '@types/node': '^20.0.0',
            tsx: '^4.0.0',
            typescript: '^5.0.0',
          },
        }, null, 2),
      },
      {
        path: 'tsconfig.json',
        content: JSON.stringify({
          compilerOptions: {
            target: 'ES2022',
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            outDir: 'dist',
            strict: true,
            skipLibCheck: true,
          },
          include: ['src'],
        }, null, 2),
      },
    ],
  },
  {
    id: 'next-ts',
    name: 'Next.js + TypeScript',
    description: 'Next.js App Router with TypeScript',
    category: 'React',
    files: [
      {
        path: 'app/page.tsx',
        content: `export default function Home() {
  return (
    <main>
      <h1>Next.js + TypeScript</h1>
      <p>Edit <code>app/page.tsx</code> to get started.</p>
    </main>
  );
}
`,
      },
      {
        path: 'app/layout.tsx',
        content: `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js App',
  description: 'Built with Next.js and TypeScript',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
      },
      {
        path: 'package.json',
        content: JSON.stringify({
          name: 'next-ts',
          version: '0.1.0',
          scripts: {
            dev: 'next dev',
            build: 'next build',
            start: 'next start',
          },
          dependencies: {
            next: '^15.0.0',
            react: '^19.0.0',
            'react-dom': '^19.0.0',
          },
          devDependencies: {
            '@types/node': '^20.0.0',
            '@types/react': '^19.0.0',
            '@types/react-dom': '^19.0.0',
            typescript: '^5.0.0',
          },
        }, null, 2),
      },
      {
        path: 'tsconfig.json',
        content: JSON.stringify({
          compilerOptions: {
            target: 'ES2017',
            lib: ['dom', 'dom.iterable', 'esnext'],
            allowJs: true,
            skipLibCheck: true,
            strict: true,
            noEmit: true,
            module: 'esnext',
            moduleResolution: 'bundler',
            resolveJsonModule: true,
            isolatedModules: true,
            jsx: 'preserve',
            incremental: true,
            plugins: [{ name: 'next' }],
          },
          include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
          exclude: ['node_modules'],
        }, null, 2),
      },
    ],
  },
  {
    id: 'vue-ts',
    name: 'Vue + TypeScript',
    description: 'Vue 3 with TypeScript and Composition API',
    category: 'Vue',
    files: [
      {
        path: 'src/main.ts',
        content: `import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

createApp(App).mount('#app');
`,
      },
      {
        path: 'src/App.vue',
        content: `<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

function increment() {
  count.value++;
}
</script>

<template>
  <main>
    <h1>Vue + TypeScript</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </main>
</template>

<style scoped>
button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
`,
      },
      {
        path: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`,
      },
      {
        path: 'package.json',
        content: JSON.stringify({
          name: 'vue-ts',
          version: '0.1.0',
          scripts: { dev: 'vite', build: 'vue-tsc -b && vite build', preview: 'vite preview' },
          dependencies: { vue: '^3.0.0' },
          devDependencies: {
            '@vitejs/plugin-vue': '^5.0.0',
            'vue-tsc': '^2.0.0',
            typescript: '^5.0.0',
            vite: '^6.0.0',
          },
        }, null, 2),
      },
    ],
  },
];

export const templateCategories = [...new Set(templates.map(t => t.category))];
