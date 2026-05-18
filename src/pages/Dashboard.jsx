import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Ico = ({ d, size = 18, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);

const S = {
  dash: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  key: <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  api: <><path d="M4 17l6-6-6-6"/><path d="M12 19h8"/></>,
  audit: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  code: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
  copy: <><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
  check: <polyline points="20 6 9 17 4 12"/>,
  trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  refresh: <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  chart: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  email: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
};

const Icon = ({ name, size = 18, ...p }) => <Ico d={S[name]} size={size} {...p} />;

const LANG_TABS = [
  { id: 'js', label: 'JavaScript', color: '#f7df1e', emoji: '🟡' },
  { id: 'csharp', label: 'C#', color: '#68217a', emoji: '🟣' },
  { id: 'lua', label: 'Lua', color: '#000080', emoji: '🔵' },
  { id: 'c', label: 'C/C++', color: '#555', emoji: '⚪' },
];

const CODE_SNIPPETS = {
  js: `// AuthShield - JavaScript SDK\nconst AuthShield = require('authshield');\nconst client = new AuthShield({\n  appKey: 'YOUR_APP_KEY',\n  secret: 'YOUR_SECRET'\n});\nconst license = await client.verifyLicense('KEY');\nif (license.valid) {\n  console.log('Valid!', license.type);\n}`,
  csharp: `// AuthShield - C# SDK\nusing AuthShield;\nvar client = new AuthShieldClient(new Config {\n    AppKey = "YOUR_APP_KEY",\n    Secret = "YOUR_SECRET"\n});\nvar license = await client.VerifyLicenseAsync("KEY");\nif (license.IsValid)\n    Console.WriteLine($"Valid! {license.Type}");`,
  lua: `-- AuthShield - Lua SDK\nlocal AuthShield = require("authshield")\nlocal client = AuthShield.new({\n    appKey = "YOUR_APP_KEY",\n    secret = "YOUR_SECRET"\n})\nlocal license = client:verifyLicense("KEY")\nif license.valid then\n    print("Valid! " .. license.type)\nend`,
  c: `// AuthShield - C SDK\n#include <authshield.h>\nint main() {\n    AS_Client* client = as_create_client(\n        "YOUR_APP_KEY", "YOUR_SECRET");\n    AS_License* lic = as_verify_license(client, "KEY");\n    if (lic->valid)\n        printf("Valid! %s\\n", lic->type);\n    as_destroy_client(client);\n}`,
};

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'dash' },
  { id: 'keys', label: 'Licenças', icon: 'key' },
  { id: 'sdk', label: 'SDK', icon: 'code' },
  { id: 'apikeys', label: 'API Keys', icon: 'api' },
  { id: 'users', label: 'Users', icon: 'users' },
  { id: 'audit', label: 'Audit Log', icon: 'audit' },
  { id: 'profile', label: 'Perfil', icon: 'user' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const card = { padding: 24, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' };
const inp = { width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' };
const sel = { ...inp, cursor: 'pointer', appearance: 'none', paddingRight: 36 };
const bP = { padding: '10px 20px', borderRadius: 10, background: 'var(--accent)', color: 'white', fontSize: 13, fontWeight: 600, border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' };
const bS = { padding: '8px 16px', borderRadius: 10, background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500, border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' };
const bdg = (c, bg) => ({ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: bg || 'var(--accent-light)', color: c || 'var(--accent)', display: 'inline-block' });

function MiniChart({ data, color = 'var(--accent)', h = 60 }) {
  const mx = Math.max(...data), mn = Math.min(...data), r = mx - mn || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${h - ((v - mn) / r) * (h - 10)}`).join(' ');
  return (
    <svg width="100%" height={h} viewBox={`0 0 100 ${h}`} preserveAspectRatio="none">
      <defs><linearGradient id={`g${h}${color.length}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <polygon points={`0,${h} ${pts} 100,${h}`} fill={`url(#g${h}${color.length})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke"/>
    </svg>
  );
}

function StatCard({ icon, label, value, change, color, chartData }) {
  return (
    <motion.div whileHover={{ y: -3 }} style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: color || 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: color ? 'white' : 'var(--accent)' }}>{icon}</div>
        {change !== undefined && <span style={bdg(change > 0 ? 'var(--success)' : 'var(--danger)', change > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)')}>{change > 0 ? '+' : ''}{change}%</span>}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 12 }}>{label}</div>
      {chartData && <MiniChart data={chartData} color={color || 'var(--accent)'} />}
    </motion.div>
  );
}

/* ─── OVERVIEW ─── */
function OverviewTab({ stats, licenses }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard icon={<Icon name="users"/>} label="Total Utilizadores" value={stats.totalUsers.toLocaleString()} change={12.5} chartData={[45,52,48,61,55,72,68,80,75,88,92,89]} />
        <StatCard icon={<Icon name="shield"/>} label="Licenças Ativas" value={stats.activeLicenses.toLocaleString()} change={8.3} color="var(--success)" chartData={[20,25,28,22,35,30,42,38,45,50,48,55]} />
        <StatCard icon={<Icon name="chart"/>} label="API Calls" value={stats.apiCalls.toLocaleString()} change={15.2} color="#8b5cf6" chartData={[100,120,115,130,125,140,135,150,155,160,158,165]} />
        <StatCard icon={<Icon name="star" size={16}/>} label="Uptime" value={`${stats.uptime}%`} change={0.02} color="#f59e0b" chartData={[99.9,99.95,99.97,99.92,99.98,99.97,99.99,99.97,99.96,99.98,99.97,99.97]} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Receita Mensal</h3>
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>€{stats.revenue.toLocaleString()}</div>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 16 }}>+12.5% vs mês anterior</div>
          <MiniChart data={[15,22,18,28,32,30,38,35,42,40,45,48]} h={80} />
        </div>
        <div style={card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Licenças por Tipo</h3>
          {[{n:'Enterprise',c:845,t:3456,cl:'#8b5cf6'},{n:'Pro',c:1200,t:3456,cl:'var(--accent)'},{n:'VIP',c:358,t:3456,cl:'#f59e0b'},{n:'Free',c:1053,t:3456,cl:'var(--text-tertiary)'}].map((it,i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{it.n}</span>
                <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{it.c.toLocaleString()}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-tertiary)' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${(it.c/it.t)*100}%` }} transition={{ duration: 1, delay: i*0.1 }} style={{ height: '100%', borderRadius: 3, background: it.cl }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={card}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Licenças Recentes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {licenses.slice(0,5).map((lic,i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border)', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: 'var(--accent)' }}><Icon name="key" size={16}/></span>
                <code style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>{lic.key}</code>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={bdg(lic.status==='active'?'var(--success)':lic.status==='expired'?'var(--danger)':'#f59e0b', lic.status==='active'?'rgba(34,197,94,0.1)':lic.status==='expired'?'rgba(239,68,68,0.1)':'rgba(245,158,11,0.1)')}>{lic.status}</span>
                <span style={bdg()}>{lic.type}</span>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{lic.uses}/{lic.maxUses}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── KEYS TAB ─── */
function KeysTab({ licenses, generateLicense, deleteLicense, revokeLicense, keyFormats }) {
  const [showGen, setShowGen] = useState(false);
  const [count, setCount] = useState(1);
  const [format, setFormat] = useState('standard');
  const [prefix, setPrefix] = useState('ASH');
  const [level, setLevel] = useState('pro');
  const [maxUses, setMaxUses] = useState(10);
  const [expiresIn, setExpiresIn] = useState('1y');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [copied, setCopied] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const rand = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    let key;
    switch (format) {
      case 'uuid': key = `${rand(8)}-${rand(4)}-4${rand(3)}-${rand(4)}-${rand(12)}`; break;
      case 'extended': key = `${prefix}-${level.toUpperCase()}-${rand(6)}-${rand(6)}-${rand(6)}`; break;
      case 'compact': key = `${prefix}${level.toUpperCase()}${rand(16)}`; break;
      case 'custom': key = `${prefix}-20260518-${rand(4)}-${rand(4)}`; break;
      default: key = `${prefix}-${level.toUpperCase()}-${rand(4)}-${rand(4)}-${rand(4)}`;
    }
    setPreview(key);
  }, [format, prefix, level]);

  const handleGenerate = () => {
    generateLicense({ count: parseInt(count), format, prefix, level, maxUses: parseInt(maxUses), expiresIn });
    setShowGen(false);
  };

  const copyKey = (key) => { navigator.clipboard.writeText(key); setCopied(key); setTimeout(() => setCopied(null), 2000); };

  const filtered = licenses.filter(l => {
    if (filterStatus !== 'all' && l.status !== filterStatus) return false;
    if (search && !l.key.toLowerCase().includes(search.toLowerCase()) && !l.type.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <AnimatePresence>
        {showGen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ ...card, marginBottom: 24, overflow: 'hidden' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="key" /> Gerar Licenças
            </h3>
            <div style={{ padding: '16px 20px', borderRadius: 12, marginBottom: 20, background: 'var(--bg-code)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <code style={{ fontSize: 16, fontFamily: "'JetBrains Mono', monospace", color: '#818cf8', letterSpacing: '1px' }}>{preview}</code>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Preview</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Formato</label>
                <select value={format} onChange={e => setFormat(e.target.value)} style={sel}>
                  {Object.entries(keyFormats).map(([k, v]) => <option key={k} value={k}>{v.name} — {v.format}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Prefixo</label>
                <input value={prefix} onChange={e => setPrefix(e.target.value)} style={inp} maxLength={6} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Nível</label>
                <select value={level} onChange={e => setLevel(e.target.value)} style={sel}>
                  <option value="free">Free</option><option value="pro">Pro</option><option value="enterprise">Enterprise</option><option value="vip">VIP</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Quantidade</label>
                <input type="number" value={count} onChange={e => setCount(e.target.value)} min={1} max={100} style={inp} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Max Usos</label>
                <input type="number" value={maxUses} onChange={e => setMaxUses(e.target.value)} min={1} style={inp} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Expira em</label>
                <select value={expiresIn} onChange={e => setExpiresIn(e.target.value)} style={sel}>
                  <option value="1d">1 Dia</option><option value="7d">7 Dias</option><option value="30d">30 Dias</option><option value="90d">90 Dias</option><option value="1y">1 Ano</option><option value="lifetime">Lifetime</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleGenerate} style={bP}>
                <Icon name="key" size={14} /> Gerar {count > 1 ? `${count} Keys` : 'Key'}
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowGen(false)} style={bS}>Cancelar</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input placeholder="Pesquisar licenças..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, width: 250 }} />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...sel, width: 150 }}>
            <option value="all">Todos</option><option value="active">Ativas</option><option value="expired">Expiradas</option><option value="revoked">Revogadas</option>
          </select>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowGen(true)} style={bP}>
          <Icon name="key" size={14} /> Gerar Nova Licença
        </motion.button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 && (
          <div style={{ ...card, textAlign: 'center', padding: 40, color: 'var(--text-tertiary)' }}>
            <div style={{ marginBottom: 12 }}><Icon name="key" size={32} /></div>
            Nenhuma licença encontrada
          </div>
        )}
        {filtered.map((lic) => (
          <motion.div key={lic.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border)', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 200 }}>
              <span style={{ color: 'var(--accent)' }}><Icon name="key" size={16} /></span>
              <code style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>{lic.key}</code>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={bdg(lic.status==='active'?'var(--success)':lic.status==='expired'?'var(--danger)':'#f59e0b', lic.status==='active'?'rgba(34,197,94,0.1)':lic.status==='expired'?'rgba(239,68,68,0.1)':'rgba(245,158,11,0.1)')}>{lic.status}</span>
              <span style={bdg()}>{lic.type}</span>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{lic.uses}/{lic.maxUses}</span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{lic.expires}</span>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => copyKey(lic.key)} style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: copied===lic.key?'rgba(34,197,94,0.1)':'var(--bg-tertiary)', color: copied===lic.key?'var(--success)':'var(--text-tertiary)', border: '1px solid var(--border)', cursor: 'pointer' }}>
                {copied===lic.key ? <Icon name="check" size={12}/> : <Icon name="copy" size={12}/>}
              </motion.button>
              {lic.status === 'active' && (
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => revokeLicense(lic.id)} style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.05)', color: 'var(--danger)', border: '1px solid var(--border)', cursor: 'pointer' }}>
                  <Icon name="trash" size={12}/>
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── SDK TAB ─── */
function SDKTab() {
  const [activeTab, setActiveTab] = useState('js');
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(CODE_SNIPPETS[activeTab]); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={card}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>SDK — Integração Multi-Linguagem</h3>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {LANG_TABS.map(tab => (
          <motion.button key={tab.id} whileTap={{ scale: 0.95 }} onClick={() => setActiveTab(tab.id)} style={{ ...bS, background: activeTab===tab.id?'var(--accent)':'var(--bg-secondary)', color: activeTab===tab.id?'white':'var(--text-secondary)', borderColor: activeTab===tab.id?'var(--accent)':'var(--border)' }}>
            {tab.emoji} {tab.label}
          </motion.button>
        ))}
      </div>
      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-code)' }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{LANG_TABS.find(t=>t.id===activeTab)?.label}</span>
          <motion.button whileTap={{ scale: 0.9 }} onClick={copy} style={{ ...bS, padding: '4px 10px', fontSize: 11 }}>
            {copied ? <><Icon name="check" size={11}/> Copiado!</> : <><Icon name="copy" size={11}/> Copiar</>}
          </motion.button>
        </div>
        <pre style={{ padding: '16px 20px', margin: 0, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6, overflowX: 'auto', color: 'var(--text-secondary)' }}>
          <code>{CODE_SNIPPETS[activeTab]}</code>
        </pre>
      </div>
    </div>
  );
}

/* ─── API KEYS TAB ─── */
function ApiKeysTab({ apiKeys, rotateApiKey }) {
  const [copied, setCopied] = useState(null);
  const [showMasked, setShowMasked] = useState({});
  const copy = (k) => { navigator.clipboard.writeText(k); setCopied(k); setTimeout(()=>setCopied(null), 2000); };
  const toggleMask = (id) => setShowMasked(p => ({...p, [id]: !p[id]}));
  const mask = (k) => k.slice(0,12) + '•'.repeat(12);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>API Keys</h3>
        <motion.button whileTap={{ scale: 0.95 }} style={bP}><Icon name="key" size={14}/> Nova API Key</motion.button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {apiKeys.map(k => (
          <motion.div key={k.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ ...card, padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: k.status==='active'?'var(--success)':'var(--danger)' }}/>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{k.name}</span>
                <span style={bdg(k.status==='active'?'var(--success)':'var(--text-tertiary)', k.status==='active'?'rgba(34,197,94,0.1)':'rgba(255,255,255,0.05)')}>{k.status}</span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{k.calls.toLocaleString()} calls</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-code)', padding: '10px 14px', borderRadius: 10, marginBottom: 8 }}>
              <code style={{ flex: 1, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: '#818cf8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {showMasked[k.id] ? k.key : mask(k.key)}
              </code>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleMask(k.id)} style={{ ...bS, padding: '4px 8px', fontSize: 11 }}>{showMasked[k.id] ? 'Ocultar' : 'Mostrar'}</motion.button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => copy(k.key)} style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: copied===k.key?'rgba(34,197,94,0.1)':'var(--bg-tertiary)', color: copied===k.key?'var(--success)':'var(--text-tertiary)', border: '1px solid var(--border)', cursor: 'pointer' }}>
                {copied===k.key ? <Icon name="check" size={11}/> : <Icon name="copy" size={11}/>}
              </motion.button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Criado: {k.created} • Último uso: {k.lastUsed}</span>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => rotateApiKey(k.id)} style={{ ...bS, padding: '4px 10px', fontSize: 11 }}><Icon name="refresh" size={11}/> Rotar</motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── USERS TAB ─── */
function UsersTab() {
  const { getUsers } = useAuth();
  const users = getUsers();
  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Utilizadores</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {users.map(u => (
          <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border)', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>{u.username[0].toUpperCase()}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{u.username}</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{u.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={bdg()}>{u.plan}</span>
              <span style={bdg(u.role==='admin'?'#f59e0b':'var(--text-tertiary)', u.role==='admin'?'rgba(245,158,11,0.1)':'rgba(255,255,255,0.05)')}>{u.role}</span>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Exp: {u.expires}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── AUDIT TAB ─── */
function AuditTab() {
  const { getAuditLog } = useAuth();
  const logs = getAuditLog();
  const actionColors = { 'license.created': 'var(--success)', 'license.deleted': 'var(--danger)', 'license.revoked': '#f59e0b', 'user.login': 'var(--accent)', 'user.registered': '#8b5cf6', 'license.verified': 'var(--success)', 'license.expired': 'var(--danger)', 'api.key.rotated': '#f59e0b', 'settings.updated': 'var(--accent)' };

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Audit Log</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {logs.map(log => (
          <div key={log.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border)', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ width: 4, height: 32, borderRadius: 2, background: actionColors[log.action] || 'var(--text-tertiary)', flexShrink: 0 }}/>
            <div style={{ flex: 1, minWidth: 150 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{log.action}</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{log.details}</div>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-tertiary)' }}>
              <span>{log.user}</span><span>{log.ip}</span><span>{log.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── PROFILE TAB ─── */
function ProfileTab() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => { updateProfile({ username: name, email }); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
      <div style={card}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24 }}>Editar Perfil</h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 12, boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}>
            {user?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <span style={{ fontSize: 18, fontWeight: 700 }}>{user?.username}</span>
          <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{user?.role}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Nome de Utilizador</label>
            <input value={name} onChange={e => setName(e.target.value)} style={inp} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} style={inp} type="email" />
          </div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave} style={{ ...bP, alignSelf: 'flex-start' }}>
            {saved ? <><Icon name="check" size={14}/> Guardado!</> : 'Guardar Alterações'}
          </motion.button>
        </div>
      </div>
      <div style={card}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24 }}>Informações da Conta</h3>
        {[{ l: 'Plano', v: user?.plan }, { l: 'Role', v: user?.role }, { l: 'Expira', v: user?.expires }, { l: 'ID', v: user?.id }].map((it, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{it.l}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{it.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SETTINGS TAB ─── */
function SettingsTab() {
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [webhook, setWebhook] = useState('');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
      <div style={card}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24 }}>Preferências</h3>
        {[{ l: 'Notificações', v: notifications, t: setNotifications }, { l: '2FA', v: twoFactor, t: setTwoFactor }].map((s, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i === 0 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ fontSize: 14 }}>{s.l}</span>
            <motion.div onClick={() => s.t(!s.v)} style={{ width: 44, height: 24, borderRadius: 12, background: s.v ? 'var(--accent)' : 'var(--bg-tertiary)', cursor: 'pointer', padding: 2, display: 'flex', alignItems: s.v ? 'center' : 'center', justifyContent: s.v ? 'flex-end' : 'flex-start' }}>
              <motion.div layout style={{ width: 20, height: 20, borderRadius: '50%', background: 'white' }}/>
            </motion.div>
          </div>
        ))}
      </div>
      <div style={card}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24 }}>Webhook</h3>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>URL do Webhook</label>
          <input value={webhook} onChange={e => setWebhook(e.target.value)} placeholder="https://seu-site.com/webhook" style={inp} />
        </div>
        <motion.button whileTap={{ scale: 0.95 }} style={{ ...bP, alignSelf: 'flex-start' }}>Guardar Webhook</motion.button>
      </div>
    </div>
  );
}

/* ─── MAIN DASHBOARD ─── */
export default function Dashboard() {
  const { user, logout, getLicenses, getStats, getApiKeys, getKeyFormats, generateLicense, deleteLicense, revokeLicense, rotateApiKey } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => { if (!user) navigate('/authshield-site/login'); }, [user, navigate]);
  if (!user) return null;

  const stats = getStats();
  const licenses = getLicenses();
  const apiKeys = getApiKeys();
  const keyFormats = getKeyFormats();
  const sw = sidebarOpen ? 260 : 64;

  const tabContent = { overview: <OverviewTab stats={stats} licenses={licenses}/>, keys: <KeysTab licenses={licenses} generateLicense={generateLicense} deleteLicense={deleteLicense} revokeLicense={revokeLicense} keyFormats={keyFormats}/>, sdk: <SDKTab/>, apikeys: <ApiKeysTab apiKeys={apiKeys} rotateApiKey={rotateApiKey}/>, users: <UsersTab/>, audit: <AuditTab/>, profile: <ProfileTab/>, settings: <SettingsTab/> };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ─── HEADER ─── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 56,
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
      }}>
        {/* Left: Toggle + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <motion.button
            whileHover={{ background: 'var(--bg-tertiary)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'transparent',
              border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-secondary)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {sidebarOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              ) : (
                <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              )}
            </svg>
          </motion.button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span style={{
              fontSize: 16, fontWeight: 800, letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>AuthShield</span>
          </div>
        </div>

        {/* Center: Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Dashboard</span>
          <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            {TABS.find(t => t.id === activeTab)?.label}
          </span>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ background: 'var(--bg-tertiary)' }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'transparent', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-secondary)',
            }}
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ background: 'var(--bg-tertiary)' }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'transparent', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-secondary)', position: 'relative',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <div style={{
              position: 'absolute', top: 7, right: 7, width: 8, height: 8,
              borderRadius: '50%', background: 'var(--danger)', border: '2px solid var(--bg-card)',
            }}/>
          </motion.button>

          {/* Divider */}
          <div style={{ width: 1, height: 28, background: 'var(--border)', margin: '0 4px' }}/>

          {/* User Avatar + Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'white',
            }}>{user?.username?.[0]?.toUpperCase()}</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{user?.username}</span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.2 }}>{user?.plan}</span>
            </div>
          </div>

          {/* Logout */}
          <motion.button
            whileHover={{ background: 'rgba(239,68,68,0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { logout(); navigate('/authshield-site/'); }}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'transparent', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--danger)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </motion.button>
        </div>
      </header>

      <div style={{ display: 'flex', marginTop: 56 }}>
        {/* ─── SIDEBAR ─── */}
        <motion.aside
          animate={{ width: sw }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{
            width: sw, height: 'calc(100vh - 56px)', position: 'fixed', left: 0, top: 56,
            background: 'var(--bg-card)', borderRight: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', zIndex: 100,
            overflow: 'hidden',
          }}
        >
          {/* Nav */}
          <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TABS.map(tab => (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(tab.id)}
                title={!sidebarOpen ? tab.label : ''}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: sidebarOpen ? '10px 14px' : '10px 0',
                  justifyContent: 'center',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: activeTab===tab.id ? 600 : 500,
                  color: activeTab===tab.id ? 'var(--accent)' : 'var(--text-secondary)',
                  background: activeTab===tab.id ? 'var(--accent-light)' : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s', position: 'relative',
                  height: 42,
                }}
              >
                <span style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={tab.icon} size={18}/>
                </span>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    style={{ marginLeft: 10, whiteSpace: 'nowrap', overflow: 'hidden' }}
                  >
                    {tab.label}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          {sidebarOpen && (
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0,
                }}>{user?.username?.[0]?.toUpperCase()}</div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.username}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{user?.role}</div>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { logout(); navigate('/authshield-site/'); }}
                style={{
                  ...bS, width: '100%', justifyContent: 'center', padding: '8px 16px',
                }}
              >
                <Icon name="logout" size={14}/>
                <span style={{ marginLeft: 6 }}>Sair</span>
              </motion.button>
            </div>
          )}
        </motion.aside>

        {/* ─── MAIN CONTENT ─── */}
        <motion.main
          animate={{ marginLeft: sw }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{
            flex: 1, padding: 32, minHeight: 'calc(100vh - 56px)',
            background: 'var(--bg-primary)',
          }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>
                {TABS.find(t => t.id === activeTab)?.label}
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-tertiary)', marginTop: 4 }}>
                Bem-vindo de volta, {user?.username}
              </p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
                {tabContent[activeTab]}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}
