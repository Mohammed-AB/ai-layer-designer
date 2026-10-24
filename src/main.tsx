import { createRoot } from 'react-dom/client';
import './index.css';

const root = createRoot(document.getElementById('root')!);
const entry = new URLSearchParams(window.location.search).has('demo')
  ? import('./demo/Demo')
  : import('./App');
entry.then(({ default: App }) => root.render(<App />));
