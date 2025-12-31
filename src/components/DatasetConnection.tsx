'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Table,
  Database,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  BarChart3,
  Lock,
  AlertCircle,
  ArrowRight,
  Layout,
  TableProperties
} from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { DetectedTable } from '@/lib/types';
import { api } from '@/services/api';

interface DatasetConnectionProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (url: string) => void;
  initialUrl?: string;
  isLocked?: boolean;
}

type LoadingStep = {
  id: number;
  label: string;
  icon: React.ElementType;
  duration: number; // Simulated duration in ms
};

const LOADING_STEPS: LoadingStep[] = [
  { id: 1, label: 'Validating Spreadsheet ID', icon: Search, duration: 1500 },
  { id: 2, label: 'Detecting Sheets & Tables', icon: FileSpreadsheet, duration: 2000 },
  { id: 3, label: 'Creating DuckDB Snapshot', icon: Database, duration: 2500 },
  { id: 4, label: 'Generating Compliance Embeddings', icon: Sparkles, duration: 3000 },
  { id: 5, label: 'Finalizing Context Intelligence', icon: Table, duration: 1000 },
];

const TABLE_SCHEMAS = [
  {
    name: 'Month_Table1',
    rows: 363,
    cols: 8,
    schema: [
      { name: 'S.no', type: 'BIGINT' },
      { name: 'Lineitem name', type: 'VARCHAR' },
      { name: 'M Category', type: 'VARCHAR' },
      { name: 'August', type: 'BIGINT' },
      { name: 'September', type: 'BIGINT' }
    ]
  },
  {
    name: 'Monthly_Fulfilled_Profit_Summary',
    rows: 6,
    cols: 12,
    schema: [
      { name: 'Month', type: 'VARCHAR' },
      { name: 'Total Revenue', type: 'DECIMAL' },
      { name: 'Cost', type: 'DECIMAL' },
      { name: 'Profit Margin', type: 'PERCENT' }
export function DatasetConnection({ isOpen, onClose, onSuccess, initialUrl = '', isLocked = false }: DatasetConnectionProps) {
    const [url, setUrl] = useState(initialUrl);

    // Stages: 'idle' -> 'loading' -> 'success' (briefly) -> 'details' (if locked) or close
    // We use the status prop OR internal state for loading
    const [internalStatus, setInternalStatus] = useState<'idle' | 'loading' | 'success' | 'details'>('idle');
    const [loadingStep, setLoadingStep] = useState(0);
    const [datasetStats, setDatasetStats] = useState<any>(null); // Type: LoadDataResponse['stats']

    // Reset internal state when modal opens
    useEffect(() => {
  if (isOpen) {
    setStatus('connected');
    setUrl(initialUrl);
  } else {
    setStatus('idle');
    setCurrentStep(0);
    setProgress(0);
    setUrl(initialUrl);
  }
}
  }, [isOpen, initialUrl, isLocked]);

const extractSpreadsheetId = (input: string) => {
  const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : input.length > 20 ? input : null;
};

const startLoadingSimulation = async () => {
  const sheetId = extractSpreadsheetId(url);
  if (!sheetId) {
    toast.error('Invalid URL', { description: 'Please enter a valid Google Sheets URL.' });
    return;
  }

  setStatus('loading');

  // Simulate steps
  for (let i = 0; i < LOADING_STEPS.length; i++) {
    setCurrentStep(i + 1);
    const step = LOADING_STEPS[i];

    const stepStartProgress = (i / LOADING_STEPS.length) * 100;
    const stepEndProgress = ((i + 1) / LOADING_STEPS.length) * 100;

    const interval = 50;
    const steps = step.duration / interval;
    const increment = (stepEndProgress - stepStartProgress) / steps;

    for (let j = 0; j < steps; j++) {
      await new Promise(r => setTimeout(r, interval));
      setProgress(p => Math.min(p + increment, stepEndProgress));
    }
  }

  setStatus('success');
  setProgress(100);

  // Wait a bit on success before triggering the callback, but allow user to see the success state
  setTimeout(() => {
    onSuccess(url);
    // We don't auto-close here anymore, we stay in success/connected state or let parent handle close
    // But for "new connection", parent usually handles close.
    // If parent doesn't close, we switch to connected view
    setStatus('connected');
  }, 1500);
};

return (
  <Dialog open={isOpen} onOpenChange={(open) => !open && status !== 'loading' && onClose()}>
    <DialogContent className={`bg-card border-border transition-all duration-300 ${status === 'details' ? 'sm:max-w-2xl' : 'sm:max-w-md'} max-h-[85vh] overflow-y-auto`}>
      <DialogHeader>
        <DialogTitle className="text-xl font-display font-bold flex items-center gap-2">
          {status === 'details' && <Database className="w-5 h-5 text-green-500" />}
          {status === 'success' || status === 'connected' || status === 'details' ? 'Dataset Intelligence' : 'Connect Dataset'}
        </DialogTitle>
        {status !== 'details' && (
          <DialogDescription>
            {status === 'connected'
              ? 'Dataset is locked for this chat session'
              : 'Link your Google Sheet to enable RAG analytics for this chat.'}
          </DialogDescription>
        )}
      </DialogHeader>

      <div className="py-4 space-y-6">
        <AnimatePresence mode="wait">

          {/* IDLE / CONNECTED State (Input View) */}
          {(status === 'idle' || status === 'connected') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {status === 'connected' && (
                <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Connected to: Draft1</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                  <span>Google Sheets URL</span>
                  {status === 'connected' && <Lock className="w-3 h-3 text-muted-foreground" />}
                </label>
                <Input
                  value={url}
                  onChange={(e) => status !== 'connected' && setUrl(e.target.value)}
                  disabled={status === 'connected'}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className={`h-12 bg-background border-border rounded-xl ${status === 'connected' ? 'opacity-70 cursor-not-allowed' : 'focus:border-green-500/50'}`}
                />
                {status !== 'connected' && (
                  <p className="text-xs text-muted-foreground ml-1">
                    Ensure the sheet is publicly accessible or shared with the service account.
                  </p>
                )}
              </div>

              {status === 'connected' ? (
                <Button
                  onClick={() => setStatus('details')}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  View Details
                </Button>
              ) : (
                <Button
                  onClick={startLoadingSimulation}
                  disabled={!url}
                  className="w-full h-12 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start Analysis
                </Button>
              )}
            </motion.div>
          )}

          {/* LOADING State */}
          {status === 'loading' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r="60" className="stroke-muted fill-none stroke-[4]" />
                  <motion.circle
                    cx="64" cy="64" r="60"
                    className="stroke-green-500 fill-none stroke-[4] stroke-linecap-round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: progress / 100 }}
                    transition={{ ease: "linear", duration: 0.5 }}
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold font-display">{Math.round(progress)}%</span>
                </div>
              </div>

              <div className="space-y-3">
                {LOADING_STEPS.map((step) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? 'bg-green-500/10 border border-green-500/20' :
                        isCompleted ? 'opacity-50' : 'opacity-30'
                        }`}
                    >
                      <div className={`p-2 rounded-full ${isActive ? 'bg-green-500 text-white animate-pulse' :
                        isCompleted ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'
                        }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                      </div>
                      <span className={`text-sm font-medium ${isActive ? 'text-green-500' : ''}`}>
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* SUCCESS Transition State */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center py-4"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold font-display text-white">Analysis Complete</h3>
            </motion.div>
          )}

          {/* DETAILS Dashboard State */}
          {status === 'details' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Top Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Table className="w-12 h-12" />
                  </div>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Tables Detected</div>
                  <div className="text-3xl font-display font-bold text-white">25 <span className="text-sm font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full ml-1">Active</span></div>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Database className="w-12 h-12" />
                  </div>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Records</div>
                  <div className="text-3xl font-display font-bold text-white">1,305</div>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FileSpreadsheet className="w-12 h-12" />
                  </div>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Source Sheets</div>
                  <div className="text-3xl font-display font-bold text-white">5 <span className="text-sm font-medium text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full ml-1">Connected</span></div>
                </div>
              </div>

              {/* Chart Section */}
              <div className="bg-zinc-900/30 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-lg">Row Distribution</h4>
                </div>

                {/* Mock Bar Chart */}
                <div className="h-40 flex items-end justify-between gap-2 px-2 pb-2 border-b border-white/5">
                  {[35, 65, 15, 45, 10, 80, 25, 55, 20, 40].map((h, i) => (
                    <div key={i} className="w-full relative group">
                      <div
                        className={`w-full rounded-t-sm transition-all duration-500 hover:opacity-80 ${i === 1 ? 'bg-green-500' : i === 5 ? 'bg-blue-500' : 'bg-zinc-700'}`}
                        style={{ height: `${h}%` }}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {h * 12} rows
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-zinc-500 uppercase font-medium">
                  <span>November_Detail</span>
                  <span>Calculation_of...</span>
                  <span>Freshggies_Shop...</span>
                </div>
              </div>

              {/* Schema List */}
              <div className="space-y-4">
                <h4 className="font-bold text-lg">Structure Analysis</h4>
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-4">
                    {TABLE_SCHEMAS.map((table, idx) => (
                      <div key={idx} className="bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden">
                        <div className="p-4 bg-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500">
                              <Table className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold">{table.name}</div>
                              <div className="text-xs text-muted-foreground">Sheet: {table.name.split('_')[0]}</div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">{table.rows} ROWS</Badge>
                        </div>
                        <div className="p-4">
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3">Schema</div>
                          <div className="flex flex-wrap gap-2">
                            {table.schema.map((col, cIdx) => (
                              <div key={cIdx} className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-white/5 text-xs font-mono flex items-center gap-2">
                                <span className="text-zinc-300">{col.name}</span>
                                <span className="text-zinc-600 text-[10px]">{col.type}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <Button variant="ghost" onClick={() => setStatus('connected')}>Back</Button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </DialogContent>
  </Dialog>
);
}
