/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  Key, 
  Activity, 
  Power, 
  Copy, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Monitor,
  Clock
} from 'lucide-react';

// Mock HWID generation
const generateMockHWID = () => {
  const chars = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += (i > 0 && i % 4 === 0 ? '-' : '') + chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function App() {
  const [hwid] = useState(generateMockHWID());
  const [licenseKey, setLicenseKey] = useState('BHOP-9921-XCA2-091L');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<'WAITING...' | 'FOUND' | 'INJECTED'>('WAITING...');
  const [copied, setCopied] = useState(false);
  const [systemTime, setSystemTime] = useState(new Date().toLocaleString());
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${msg}`]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleLogin = () => {
    addLog('Authenticating with server...');
    setTimeout(() => {
      setIsAuthorized(true);
      addLog('License verified. Authorization OK.');
      addLog('Waiting for process: truykick.exe');
      startInjectionSimulation();
    }, 1500);
  };

  const startInjectionSimulation = () => {
    setTimeout(() => {
      setGameStatus('FOUND');
      addLog('Process found: truykick.exe (PID: 8412)');
      
      setTimeout(() => {
        setGameStatus('INJECTED');
        addLog('DLL Injected successfully. BunnyHop active.');
        addLog('Heartbeat started. Frequency: 300s');
        
        const interval = setInterval(() => {
          addLog('Heartbeat sent to server. Status: OK');
        }, 15000);
        
        return () => clearInterval(interval);
      }, 2000);
    }, 3000);
  };

  const copyHWID = () => {
    navigator.clipboard.writeText(hwid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-bg-color">
      <div className="background-effect" />
      <div className="scanline" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-[480px] h-[520px] bg-window-bg rounded-2xl border border-white/5 shadow-2xl flex flex-col relative overflow-hidden z-10"
      >
        {/* Title Bar */}
        <div className="h-[50px] bg-[#19191e] border-b border-white/5 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span className="text-[12px] font-bold text-accent tracking-widest uppercase">USSR MENU v1.0.4</span>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-danger" />
          </div>
        </div>

        {/* Bento Grid Content */}
        <div className="flex-1 grid grid-cols-2 grid-rows-[auto_auto_1fr_auto] gap-3 p-5 overflow-hidden">
          
          {/* HWID Card */}
          <div className="bento-card col-span-2">
            <div className="card-label">Your Unique Hardware ID</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 font-mono text-[13px] bg-bg-color p-2 rounded-md text-center border border-white/5 border-dashed text-text-primary">
                {hwid}
              </div>
              <button onClick={copyHWID} className="p-2 hover:bg-white/5 rounded-md transition-colors">
                {copied ? <CheckCircle2 className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4 text-text-secondary" />}
              </button>
            </div>
          </div>

          {/* Subscription Status Card */}
          <div className="bento-card col-span-1">
            <div className="card-label">Subscription</div>
            <div className="text-[18px] font-bold text-accent">
              {isAuthorized ? 'ACTIVE' : 'INACTIVE'}
            </div>
            <div className="text-[11px] text-text-secondary">
              {isAuthorized ? '364 days remaining' : 'Please activate key'}
            </div>
          </div>

          {/* Game State Card */}
          <div className="bento-card col-span-1">
            <div className="card-label">Game State</div>
            <div className={`text-[18px] font-bold ${gameStatus === 'INJECTED' ? 'text-accent' : 'text-orange-500'}`}>
              {gameStatus}
            </div>
            <div className="text-[11px] text-text-secondary">
              {gameStatus === 'INJECTED' ? 'Macro running' : 'Start Truy Kích to inject'}
            </div>
          </div>

          {/* Main Action Card */}
          <div className="bento-card col-span-2 bg-gradient-to-br from-[#1c1c23] to-[#15151a] justify-center items-center gap-4">
            <div className="w-full">
              <div className="card-label text-center">License Activation Key</div>
              <input 
                type="text" 
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                readOnly={isAuthorized}
                className="w-full bg-bg-color border border-white/10 text-yellow-400 p-3 rounded-lg text-center font-mono text-[16px] focus:outline-none focus:border-accent/30 transition-all mb-3"
              />
              <button 
                onClick={handleLogin}
                disabled={isAuthorized}
                className={`w-full py-3 rounded-lg font-extrabold text-[14px] uppercase tracking-wider transition-all active:scale-[0.98] ${
                  isAuthorized 
                  ? 'bg-accent/20 text-accent/50 cursor-not-allowed' 
                  : 'bg-accent text-black hover:brightness-110 shadow-[0_0_15px_rgba(0,255,127,0.2)]'
                }`}
              >
                {isAuthorized ? 'Successfully Injected' : 'Inject & Start BunnyHop'}
              </button>
            </div>
          </div>

          {/* Console Card */}
          <div className="bento-card col-span-2 bg-black border-accent-dim/30 h-[100px] p-3">
            <div className="card-label !mb-1">Technical Output Log</div>
            <div className="flex-1 overflow-y-auto console-scroll font-mono text-[11px] space-y-0.5">
              {logs.map((log, i) => (
                <div key={i} className="text-accent/80 opacity-90 flex gap-2">
                  <span className="text-accent/40 shrink-0">›</span>
                  {log}
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-white/20 italic">Waiting for system initialization...</div>
              )}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-5 py-3 flex justify-between items-center">
          <div className="text-[9px] text-text-secondary font-mono flex items-center gap-1">
            <Clock className="w-2 h-2" /> {systemTime}
          </div>
          <div className="text-[9px] text-text-secondary italic">
            Cracked by discord: vunguyendev
          </div>
        </div>
      </motion.div>
    </div>
  );
}
