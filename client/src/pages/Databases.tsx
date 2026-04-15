import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Database, ChevronRight, ChevronLeft, ChevronDown, Rows, FolderOpen, FileText } from 'lucide-react';
import { databases as dbApi } from '../api';
import type { Database as DB, Collection, DocumentPage } from '../types';

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const k = 1024, s = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(Math.max(bytes, 1)) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${s[i]}`;
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: 'hsl(120 100% 50% / 0.5)', borderTopColor: 'transparent' }} />
    </div>
  );
}

export default function Databases() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dbs, setDbs] = useState<DB[]>([]);
  const [selectedDb, setSelectedDb] = useState<string | null>(searchParams.get('db'));
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCol, setSelectedCol] = useState<string | null>(searchParams.get('col'));
  const [docPage, setDocPage] = useState<DocumentPage | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [colLoading, setColLoading] = useState(false);
  const [docLoading, setDocLoading] = useState(false);

  useEffect(() => {
    dbApi.list().then((r) => setDbs(r.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedDb) { setCollections([]); setSelectedCol(null); setDocPage(null); return; }
    setColLoading(true);
    dbApi.collections(selectedDb).then((r) => setCollections(r.data)).finally(() => setColLoading(false));
  }, [selectedDb]);

  useEffect(() => {
    if (!selectedDb || !selectedCol) { setDocPage(null); return; }
    setDocLoading(true);
    dbApi.documents(selectedDb, selectedCol, page).then((r) => setDocPage(r.data)).finally(() => setDocLoading(false));
  }, [selectedDb, selectedCol, page]);

  const selectDb = (name: string) => {
    const next = selectedDb === name ? null : name;
    setSelectedDb(next); setSelectedCol(null); setPage(1);
    setSearchParams(next ? { db: next } : {});
  };

  const selectCol = (name: string) => {
    const next = selectedCol === name ? null : name;
    setSelectedCol(next); setPage(1);
    if (selectedDb) setSearchParams(next ? { db: selectedDb, col: next } : { db: selectedDb });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      <div>
        <h1 className="font-display font-bold text-white tracking-widest">DATABASES</h1>
        <p className="text-xs font-mono mt-0.5" style={{ color: 'hsl(120 100% 50% / 0.45)' }}>
          browse collections and documents
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3 space-y-3">
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid hsl(120 100% 50% / 0.12)' }}>
            <div className="flex items-center gap-2 px-4 py-3" style={{ background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid hsl(120 100% 50% / 0.08)' }}>
              <Database className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-white">
                Databases {dbs.length > 0 && <span style={{ color: 'hsl(120 100% 50% / 0.5)' }}>({dbs.length})</span>}
              </span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.25)' }}>
              {loading ? <Spinner /> : dbs.length === 0 ? (
                <div className="py-8 text-center">
                  <Database className="w-7 h-7 mx-auto mb-2" style={{ color: 'hsl(120 100% 50% / 0.12)' }} />
                  <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>no databases</p>
                </div>
              ) : dbs.map((db) => {
                const active = selectedDb === db.name;
                return (
                  <button key={db.name} onClick={() => selectDb(db.name)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-xs font-mono transition-all"
                    style={{
                      borderBottom: '1px solid hsl(120 100% 50% / 0.05)',
                      background: active ? 'hsl(120 100% 50% / 0.08)' : 'transparent',
                      color: active ? 'hsl(120 100% 60%)' : 'rgba(255,255,255,0.4)',
                    }}>
                    {active ? <ChevronDown className="w-3 h-3 shrink-0 text-primary" /> : <ChevronRight className="w-3 h-3 shrink-0" />}
                    <span className="flex-1 truncate">{db.name}</span>
                    <span style={{ color: 'rgba(255,255,255,0.2)' }}>{formatBytes(db.sizeOnDisk)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDb && (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid hsl(120 100% 50% / 0.12)' }}>
              <div className="flex items-center gap-2 px-4 py-3" style={{ background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid hsl(120 100% 50% / 0.08)' }}>
                <FolderOpen className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-white">Collections</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.25)' }}>
                {colLoading ? <Spinner /> : collections.length === 0 ? (
                  <p className="text-xs font-mono text-center py-8" style={{ color: 'rgba(255,255,255,0.25)' }}>no collections</p>
                ) : collections.map((col) => {
                  const active = selectedCol === col.name;
                  return (
                    <button key={col.name} onClick={() => selectCol(col.name)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-xs font-mono transition-all"
                      style={{
                        borderBottom: '1px solid hsl(120 100% 50% / 0.05)',
                        background: active ? 'rgba(59,130,246,0.1)' : 'transparent',
                        color: active ? '#93c5fd' : 'rgba(255,255,255,0.4)',
                      }}>
                      <Rows className="w-3 h-3 shrink-0" />
                      <span className="flex-1 truncate">{col.name}</span>
                      <span style={{ color: 'rgba(255,255,255,0.2)' }}>{col.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-9">
          {!selectedCol ? (
            <div className="rounded-xl flex flex-col items-center justify-center py-20 text-center"
              style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid hsl(120 100% 50% / 0.08)', minHeight: '400px' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'hsl(120 100% 50% / 0.06)', border: '1px solid hsl(120 100% 50% / 0.12)' }}>
                <FileText className="w-7 h-7" style={{ color: 'hsl(120 100% 50% / 0.3)' }} />
              </div>
              <p className="font-mono text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {!selectedDb ? 'select a database to explore' : 'select a collection to view documents'}
              </p>
            </div>
          ) : docLoading ? (
            <div className="rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid hsl(120 100% 50% / 0.1)', minHeight: '400px' }}>
              <Spinner />
            </div>
          ) : docPage ? (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid hsl(120 100% 50% / 0.12)' }}>
              <div className="flex items-center justify-between px-5 py-3.5"
                style={{ background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid hsl(120 100% 50% / 0.08)' }}>
                <div>
                  <p className="text-sm font-mono font-semibold text-white">
                    <span className="text-primary">{selectedDb}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>.</span>
                    <span className="text-blue-300">{selectedCol}</span>
                  </p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {docPage.total.toLocaleString()} documents · page {docPage.page}/{docPage.pages}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-1.5 rounded-lg transition-colors disabled:opacity-25 hover:bg-white/5"
                    style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                    {page} / {docPage.pages}
                  </span>
                  <button onClick={() => setPage((p) => Math.min(docPage.pages, p + 1))} disabled={page >= docPage.pages}
                    className="p-1.5 rounded-lg transition-colors disabled:opacity-25 hover:bg-white/5"
                    style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-auto" style={{ background: 'rgba(0,0,0,0.2)', maxHeight: 'calc(100vh - 260px)' }}>
                {docPage.documents.length === 0 ? (
                  <p className="text-center py-10 text-xs font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>empty collection</p>
                ) : docPage.documents.map((doc, i) => (
                  <div key={i} className="group relative transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: '1px solid hsl(120 100% 50% / 0.05)' }}>
                    <div className="px-1 py-1" style={{ borderLeft: '3px solid hsl(120 100% 50% / 0.15)' }}>
                      <pre className="px-4 py-3 text-xs font-mono whitespace-pre-wrap break-words leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.7)' }}>
                        {JSON.stringify(doc, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
