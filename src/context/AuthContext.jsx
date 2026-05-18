import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = [
  { id: 1, username: 'admin', email: 'admin@authshield.io', password: 'admin123', role: 'admin', plan: 'Enterprise', expires: '2027-12-31', avatar: null },
  { id: 2, username: 'developer', email: 'dev@authshield.io', password: 'dev123', role: 'user', plan: 'Pro', expires: '2026-12-31', avatar: null },
];

const DEMO_LICENSES = [
  { id: 1, key: 'ASH-PRO-2026-XXXX-YYYY', type: 'Pro', status: 'active', uses: 5, maxUses: 10, created: '2026-01-15', expires: '2027-01-15', prefix: 'ASH', level: 'pro' },
  { id: 2, key: 'ASH-ENT-2026-AAAA-BBBB', type: 'Enterprise', status: 'active', uses: 12, maxUses: 100, created: '2026-03-01', expires: '2027-03-01', prefix: 'ASH', level: 'enterprise' },
  { id: 3, key: 'ASH-FREE-2026-CCCC-DDDD', type: 'Free', status: 'expired', uses: 1, maxUses: 1, created: '2025-06-01', expires: '2025-12-01', prefix: 'ASH', level: 'free' },
  { id: 4, key: 'ASH-VIP-2026-EEEE-FFFF', type: 'VIP', status: 'active', uses: 50, maxUses: 500, created: '2026-04-10', expires: '2028-04-10', prefix: 'ASH', level: 'vip' },
];

const DEMO_STATS = {
  totalUsers: 1247,
  activeUsers: 892,
  totalLicenses: 3456,
  activeLicenses: 2103,
  apiCalls: 156789,
  uptime: 99.97,
  monthlyGrowth: 12.5,
  revenue: 48250,
};

const DEMO_AUDIT_LOG = [
  { id: 1, action: 'license.created', user: 'admin', details: 'ASH-PRO-2026-XXXX-YYYY', time: '2026-05-18 14:32', ip: '192.168.1.1' },
  { id: 2, action: 'user.login', user: 'admin', details: 'Login bem sucedido', time: '2026-05-18 14:30', ip: '192.168.1.1' },
  { id: 3, action: 'license.verified', user: 'system', details: 'ASH-ENT-2026-AAAA-BBBB', time: '2026-05-18 14:25', ip: '10.0.0.5' },
  { id: 4, action: 'user.registered', user: 'developer', details: 'Novo utilizador registado', time: '2026-05-18 13:15', ip: '192.168.1.2' },
  { id: 5, action: 'license.expired', user: 'system', details: 'ASH-FREE-2026-CCCC-DDDD', time: '2026-05-18 12:00', ip: 'system' },
  { id: 6, action: 'api.key.rotated', user: 'admin', details: 'API Key principal rotada', time: '2026-05-18 11:45', ip: '192.168.1.1' },
  { id: 7, action: 'settings.updated', user: 'admin', details: 'Configurações de email atualizadas', time: '2026-05-18 10:30', ip: '192.168.1.1' },
  { id: 8, action: 'license.created', user: 'admin', details: 'ASH-VIP-2026-EEEE-FFFF', time: '2026-05-17 16:20', ip: '192.168.1.1' },
];

const DEMO_API_KEYS = [
  { id: 1, name: 'Production API', key: 'ask_live_a1b2c3d4e5f6g7h8i9j0', created: '2026-01-10', lastUsed: '2026-05-18', calls: 89432, status: 'active' },
  { id: 2, name: 'Development API', key: 'ask_test_z9y8x7w6v5u4t3s2r1q0', created: '2026-02-15', lastUsed: '2026-05-17', calls: 12345, status: 'active' },
  { id: 3, name: 'Staging API', key: 'ask_stg_m1n2o3p4q5r6s7t8u9v0', created: '2026-03-20', lastUsed: '2026-05-10', calls: 5678, status: 'inactive' },
];

const KEY_FORMATS = {
  standard: { name: 'Standard', format: 'PREFIX-XXXX-XXXX-XXXX', segments: 4, segLength: 4, separator: '-' },
  extended: { name: 'Extended', format: 'PREFIX-XXXXXX-XXXXXX-XXXXXX', segments: 3, segLength: 6, separator: '-' },
  compact: { name: 'Compact', format: 'PREFIX-XXXXXXXXXXXXXXXX', segments: 1, segLength: 16, separator: '-' },
  uuid: { name: 'UUID', format: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', segments: 5, segLengths: [8, 4, 4, 4, 12], separator: '-' },
  custom: { name: 'Custom', format: 'PREFIX-YYYYMM-XXXX-XXXX', segments: 3, segLength: 4, separator: '-' },
};

function generateKey(format = 'standard', prefix = 'ASH', level = 'pro') {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const hex = '0123456789abcdef';
  const rand = (len, set = chars) => Array.from({ length: len }, () => set[Math.floor(Math.random() * set.length)]).join('');

  switch (format) {
    case 'uuid':
      return `${rand(8, hex)}-${rand(4, hex)}-4${rand(3, hex)}-${['8', '9', 'a', 'b'][Math.floor(Math.random() * 4)]}${rand(3, hex)}-${rand(12, hex)}`;
    case 'extended':
      return `${prefix}-${level.toUpperCase()}-${rand(6)}-${rand(6)}-${rand(6)}`;
    case 'compact':
      return `${prefix}${level.toUpperCase()}${rand(16)}`;
    case 'custom': {
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      return `${prefix}-${dateStr}-${rand(4)}-${rand(4)}`;
    }
    default:
      return `${prefix}-${level.toUpperCase()}-${rand(4)}-${rand(4)}-${rand(4)}`;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [licenses, setLicenses] = useState(DEMO_LICENSES);
  const [apiKeys, setApiKeys] = useState(DEMO_API_KEYS);
  const [auditLog, setAuditLog] = useState(DEMO_AUDIT_LOG);

  useEffect(() => {
    const saved = localStorage.getItem('authshield_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const found = DEMO_USERS.find(u => (u.username === username || u.email === username) && u.password === password);
    if (found) {
      const userData = { ...found };
      delete userData.password;
      setUser(userData);
      localStorage.setItem('authshield_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, error: 'Credenciais inválidas' };
  };

  const register = (username, email, password) => {
    const exists = DEMO_USERS.find(u => u.username === username || u.email === email);
    if (exists) {
      return { success: false, error: 'Utilizador ou email já existe' };
    }
    const newUser = {
      id: DEMO_USERS.length + 1,
      username,
      email,
      role: 'user',
      plan: 'Free',
      expires: '2026-06-30',
      avatar: null,
    };
    DEMO_USERS.push({ ...newUser, password });
    setUser(newUser);
    localStorage.setItem('authshield_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authshield_user');
  };

  const updateProfile = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('authshield_user', JSON.stringify(updated));
      return updated;
    });
  };

  const generateLicense = useCallback(({ count = 1, format = 'standard', prefix = 'ASH', level = 'pro', maxUses = 10, expiresIn = '1y' }) => {
    const now = new Date();
    const expiresMap = { '1d': 1, '7d': 7, '30d': 30, '90d': 90, '1y': 365, 'lifetime': 36500 };
    const days = expiresMap[expiresIn] || 365;
    const expDate = new Date(now.getTime() + days * 86400000);
    const typeMap = { free: 'Free', pro: 'Pro', enterprise: 'Enterprise', vip: 'VIP' };

    const newLicenses = Array.from({ length: Math.min(count, 100) }, (_, i) => ({
      id: licenses.length + i + 1,
      key: generateKey(format, prefix, level),
      type: typeMap[level] || 'Pro',
      status: 'active',
      uses: 0,
      maxUses,
      created: now.toISOString().split('T')[0],
      expires: expDate.toISOString().split('T')[0],
      prefix,
      level,
    }));

    setLicenses(prev => [...newLicenses, ...prev]);
    addAuditLog('license.created', `Gerou ${count} licença(s) ${typeMap[level]}`);
    return newLicenses;
  }, [licenses.length]);

  const deleteLicense = useCallback((id) => {
    setLicenses(prev => prev.filter(l => l.id !== id));
    addAuditLog('license.deleted', `Licença removida`);
  }, []);

  const revokeLicense = useCallback((id) => {
    setLicenses(prev => prev.map(l => l.id === id ? { ...l, status: 'revoked' } : l));
    addAuditLog('license.revoked', `Licença revogada`);
  }, []);

  const addAuditLog = useCallback((action, details) => {
    const entry = {
      id: Date.now(),
      action,
      user: user?.username || 'system',
      details,
      time: new Date().toISOString().replace('T', ' ').slice(0, 16),
      ip: '192.168.1.1',
    };
    setAuditLog(prev => [entry, ...prev].slice(0, 50));
  }, [user]);

  const rotateApiKey = useCallback((id) => {
    const newKey = 'ask_live_' + Array.from({ length: 20 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');
    setApiKeys(prev => prev.map(k => k.id === id ? { ...k, key: newKey, lastUsed: 'Agora' } : k));
    addAuditLog('api.key.rotated', `API Key rotada`);
  }, [addAuditLog]);

  const getLicenses = () => licenses;
  const getStats = () => DEMO_STATS;
  const getUsers = () => DEMO_USERS.map(u => ({ ...u, password: undefined }));
  const getAuditLog = () => auditLog;
  const getApiKeys = () => apiKeys;
  const getKeyFormats = () => KEY_FORMATS;

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, updateProfile,
      getLicenses, getStats, getUsers, getAuditLog, getApiKeys, getKeyFormats,
      generateLicense, deleteLicense, revokeLicense, rotateApiKey, addAuditLog
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};