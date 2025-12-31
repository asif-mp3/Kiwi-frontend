'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Database, Filter, SortAsc, SortDesc, Calculator, Table as TableIcon, Eye, ListFilter } from "lucide-react";

interface QueryPlanViewerProps {
  plan: any;
}

export function QueryPlanViewer({ plan }: QueryPlanViewerProps) {
  if (!plan) return null;

  const renderValue = (val: any) => {
    if (typeof val === 'string') return <span className="text-green-400 font-mono">"{val}"</span>;
    if (typeof val === 'number') return <span className="text-blue-400 font-mono">{val}</span>;
    return <span className="text-zinc-400 font-mono">{JSON.stringify(val)}</span>;
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex items-center gap-3 pb-3 border-b border-white/10">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
          <Database className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Target Table</div>
          <div className="text-sm font-semibold text-white">{plan.table}</div>
        </div>
        <div className="ml-auto">
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 capitalize">
            {plan.query_type?.replace(/_/g, ' ')}
          </Badge>
        </div>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4 text-sm">

          {/* Selects & Metrics */}
          {(plan.select_columns || plan.metrics) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <Eye className="w-3 h-3" /> Select / Aggregations
              </div>
              <div className="flex flex-wrap gap-2">
                {plan.select_columns?.map((col: string) => (
                  <Badge key={col} variant="secondary" className="font-mono bg-zinc-800 text-zinc-300 border-zinc-700">
                    {col}
                  </Badge>
                ))}
                {plan.metrics?.map((metric: string) => (
                  <Badge key={metric} variant="secondary" className="font-mono bg-purple-500/10 text-purple-400 border-purple-500/20">
                    {metric}
                  </Badge>
                ))}
                {plan.aggregation_function && (
                  <Badge variant="secondary" className="font-mono bg-purple-500/10 text-purple-400 border-purple-500/20">
                    {plan.aggregation_function}({plan.aggregation_column || '*'})
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Filters */}
          {plan.filters && plan.filters.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <Filter className="w-3 h-3" /> Filters
              </div>
              <div className="space-y-1.5">
                {plan.filters.map((f: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 bg-zinc-800/50 p-2 rounded-md border border-zinc-800 font-mono text-xs">
                    <span className="text-zinc-300">{f.column}</span>
                    <span className="text-amber-400 font-bold">{f.operator}</span>
                    {renderValue(f.value)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group By */}
          {plan.group_by && plan.group_by.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <ListFilter className="w-3 h-3" /> Group By
              </div>
              <div className="flex flex-wrap gap-2">
                {plan.group_by.map((col: string) => (
                  <Badge key={col} variant="secondary" className="font-mono bg-zinc-800 text-zinc-300 border-zinc-700">
                    {col}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Order By */}
          {plan.order_by && plan.order_by.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <SortAsc className="w-3 h-3" /> Order By
              </div>
              <div className="space-y-1.5">
                {plan.order_by.map((order: any[], i: number) => (
                  <div key={i} className="flex items-center gap-2 bg-zinc-800/50 p-2 rounded-md border border-zinc-800 font-mono text-xs">
                    <span className="text-zinc-300">{order[0]}</span>
                    <span className="text-indigo-400 font-bold">{order[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Limit */}
          {plan.limit && (
            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Limit:</span>
              <span className="text-sm font-mono text-white">{plan.limit}</span>
            </div>
          )}

        </div>
      </ScrollArea>
    </div>
  );
}
