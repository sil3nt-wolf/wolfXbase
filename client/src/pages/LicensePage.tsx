import LegalLayout from '../components/LegalLayout';

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-display font-bold text-white mt-10 mb-3 first:mt-0 tracking-wide">{children}</h2>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-500 text-sm leading-relaxed mb-4 font-mono">{children}</p>;
}
function Highlight({ children }: { children: React.ReactNode }) {
  return <strong className="text-gray-200 font-semibold">{children}</strong>;
}

const licenseText = `Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

const dependencies: { name: string; license: string; url: string }[] = [
  { name: 'MongoDB Community Server', license: 'SSPL v1', url: 'https://www.mongodb.com/licensing/server-side-public-license' },
  { name: 'Express.js', license: 'MIT', url: 'https://expressjs.com' },
  { name: 'React', license: 'MIT', url: 'https://react.dev' },
  { name: 'Vite', license: 'MIT', url: 'https://vitejs.dev' },
  { name: 'Tailwind CSS', license: 'MIT', url: 'https://tailwindcss.com' },
  { name: 'Axios', license: 'MIT', url: 'https://axios-http.com' },
  { name: 'sharp', license: 'Apache-2.0', url: 'https://sharp.pixelplumbing.com' },
  { name: 'connect-mongo', license: 'MIT', url: 'https://github.com/jdesboeufs/connect-mongo' },
  { name: 'lucide-react', license: 'ISC', url: 'https://lucide.dev' },
  { name: 'react-router-dom', license: 'MIT', url: 'https://reactrouter.com' },
  { name: 'express-session', license: 'MIT', url: 'https://github.com/expressjs/session' },
];

export default function LicensePage() {
  const year = new Date().getFullYear();

  return (
    <LegalLayout
      title="License"
      subtitle="wolfXbase is open-source software released under the MIT License."
      lastUpdated="January 2025"
    >
      <H2>MIT License</H2>
      <P>
        Copyright &copy; {year} <Highlight>WOLF TECH ~ Silent Wolf</Highlight>
      </P>

      <div className="rounded-lg p-5 mb-8 font-mono" style={{ background: '#080808', border: '1px solid hsl(120 100% 50% / 0.15)' }}>
        <pre className="text-gray-600 text-xs leading-relaxed whitespace-pre-wrap font-mono">
          {licenseText}
        </pre>
      </div>

      <H2>What the MIT License Means</H2>
      <P>In plain language, the MIT License grants you the right to:</P>
      <ul className="list-disc list-inside space-y-1.5 text-gray-500 text-sm leading-relaxed mb-6 pl-2 font-mono">
        <li><Highlight>Use</Highlight> wolfXbase freely, for personal or commercial purposes</li>
        <li><Highlight>Modify</Highlight> the source code to suit your needs</li>
        <li><Highlight>Distribute</Highlight> original or modified copies</li>
        <li><Highlight>Include</Highlight> it in proprietary products</li>
      </ul>
      <P>
        The only requirement is that you include the original copyright notice and the MIT License text in any
        substantial copy or distribution of the software.
      </P>

      <H2>Third-Party Licenses</H2>
      <P>
        wolfXbase bundles and depends on the following open-source packages. Each retains its own licence:
      </P>

      <div className="card divide-y mb-8" style={{ borderColor: 'hsl(120 100% 50% / 0.1)' }}>
        {dependencies.map(({ name, license, url }) => (
          <div key={name} className="flex items-center justify-between px-5 py-3.5 gap-4" style={{ borderColor: 'hsl(120 100% 50% / 0.08)' }}>
            <div className="flex-1 min-w-0">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 text-sm font-mono hover:text-primary transition-colors"
              >
                {name}
              </a>
            </div>
            <span className={`text-xs font-mono px-2 py-0.5 rounded font-semibold ${
              license === 'MIT' ? 'text-primary' :
              license === 'Apache-2.0' ? 'text-blue-400' :
              license === 'ISC' ? 'text-gray-400' :
              'text-amber-400'
            }`} style={{
              background: 'hsl(120 100% 50% / 0.06)',
              border: '1px solid hsl(120 100% 50% / 0.15)',
            }}>
              {license}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-lg p-4" style={{ background: 'hsl(38 100% 50% / 0.05)', border: '1px solid hsl(38 100% 50% / 0.2)' }}>
        <p className="text-amber-400 font-semibold text-sm mb-2 font-mono">MongoDB Community Server — SSPL v1 Notice</p>
        <p className="text-gray-500 text-sm leading-relaxed font-mono">
          wolfXbase starts and manages a local MongoDB Community Server process. MongoDB Community Server is
          licensed under the <Highlight>Server Side Public License (SSPL) v1</Highlight>. Your use of MongoDB is
          subject to the terms of that license. Review the{' '}
          <a
            href="https://www.mongodb.com/licensing/server-side-public-license"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            full SSPL v1 text
          </a>{' '}
          to understand your obligations.
        </p>
      </div>
    </LegalLayout>
  );
}
