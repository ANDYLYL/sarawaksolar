import React, { useState, useMemo } from 'react';
import { Zap, Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface Inverter {
  model: string;
  phase: number;
  maxDc: number;
  ratedAc: number;
  efficiency: number;
}

const inverterLibrary: Inverter[] = [
  { model: "1.0kW", phase: 1, maxDc: 1300, ratedAc: 1000, efficiency: 0.973 },
  { model: "1.5kW", phase: 1, maxDc: 2000, ratedAc: 1500, efficiency: 0.973 },
  { model: "2.0kW", phase: 1, maxDc: 2600, ratedAc: 2000, efficiency: 0.973 },
  { model: "2.2kW", phase: 1, maxDc: 2900, ratedAc: 2200, efficiency: 0.973 },
  { model: "2.5kW", phase: 1, maxDc: 3300, ratedAc: 2500, efficiency: 0.973 },
  { model: "2.7kW", phase: 1, maxDc: 3500, ratedAc: 2700, efficiency: 0.973 },
  { model: "3.0kW", phase: 1, maxDc: 3900, ratedAc: 3000, efficiency: 0.975 },
  { model: "3.3kW", phase: 1, maxDc: 4300, ratedAc: 3300, efficiency: 0.975 },
  { model: "3.6kW", phase: 1, maxDc: 4700, ratedAc: 3600, efficiency: 0.975 },
  { model: "4.0kW", phase: 1, maxDc: 5200, ratedAc: 4000, efficiency: 0.975 },
  { model: "3.6kW", phase: 1, maxDc: 5400, ratedAc: 3600, efficiency: 0.975 },
  { model: "4.0kW", phase: 1, maxDc: 6000, ratedAc: 4000, efficiency: 0.975 },
  { model: "4.2kW", phase: 1, maxDc: 6300, ratedAc: 4200, efficiency: 0.975 },
  { model: "4.6kW", phase: 1, maxDc: 6900, ratedAc: 4600, efficiency: 0.975 },
  { model: "5.0kW", phase: 1, maxDc: 7500, ratedAc: 5000, efficiency: 0.975 },
  { model: "5.2kW", phase: 1, maxDc: 7800, ratedAc: 5200, efficiency: 0.975 },
  { model: "6.0kW", phase: 1, maxDc: 9000, ratedAc: 6000, efficiency: 0.975 },
  { model: "6.2kW", phase: 1, maxDc: 9300, ratedAc: 6200, efficiency: 0.975 },
  { model: "9.0kW", phase: 1, maxDc: 13500, ratedAc: 9000, efficiency: 0.975 },
  { model: "10.0kW", phase: 1, maxDc: 15000, ratedAc: 10000, efficiency: 0.975 },
  { model: "10.5kW", phase: 1, maxDc: 15800, ratedAc: 105000, efficiency: 0.975 },
  { model: "3.0kW", phase: 3, maxDc: 4500, ratedAc: 3000, efficiency: 0.981 },
  { model: "4.0kW", phase: 3, maxDc: 6000, ratedAc: 4000, efficiency: 0.981 },
  { model: "5.0kW", phase: 3, maxDc: 7500, ratedAc: 5000, efficiency: 0.982 },
  { model: "6.0kW", phase: 3, maxDc: 9000, ratedAc: 6000, efficiency: 0.982 },
  { model: "7.0kW", phase: 3, maxDc: 10500, ratedAc: 7000, efficiency: 0.983 },
  { model: "8.0kW", phase: 3, maxDc: 12000, ratedAc: 8000, efficiency: 0.983 },
  { model: "9.0kW", phase: 3, maxDc: 13500, ratedAc: 9000, efficiency: 0.983 },
  { model: "10.0kW", phase: 3, maxDc: 15000, ratedAc: 10000, efficiency: 0.983 },
  { model: "12.0kW", phase: 3, maxDc: 18000, ratedAc: 12000, efficiency: 0.983 },
  { model: "15.0kW", phase: 3, maxDc: 22500, ratedAc: 15000, efficiency: 0.985 },
  { model: "18.0kW", phase: 3, maxDc: 23400, ratedAc: 18000, efficiency: 0.985 },
  { model: "20.0kW", phase: 3, maxDc: 26000, ratedAc: 20000, efficiency: 0.985 },
  { model: "22.0kW", phase: 3, maxDc: 28600, ratedAc: 22000, efficiency: 0.985 },
  { model: "23.0kW", phase: 3, maxDc: 29900, ratedAc: 23000, efficiency: 0.985 },
  { model: "25.0kW", phase: 3, maxDc: 32500, ratedAc: 25000, efficiency: 0.985 },
  { model: "30.0kW", phase: 3, maxDc: 39000, ratedAc: 30000, efficiency: 0.986 },
];

export default function SolarConfigurator() {
  const [panelCount, setPanelCount] = useState<string>('10');
  const [phaseFilter, setPhaseFilter] = useState<'all' | 1 | 3>('all');
  const PANEL_WATTAGE = 620;

  const pdc = useMemo(() => (parseInt(panelCount) || 0) * PANEL_WATTAGE, [panelCount]);

  const filteredInverters = useMemo(() => {
    return inverterLibrary
      .filter(inv => {
        const isCompatible = pdc <= inv.maxDc;
        const isUnderpowered = pdc < inv.ratedAc * 0.5; // DC is less than 50% of AC rating
        const phaseMatch = phaseFilter === 'all' || inv.phase === phaseFilter;
        
        return phaseMatch && isCompatible && !isUnderpowered;
      })
      .sort((a, b) => a.maxDc - b.maxDc);
  }, [pdc, phaseFilter]);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-emerald-900 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="h-6 w-6 text-yellow-400" />
          <h2 className="text-2xl font-bold">Solar Configurator</h2>
        </div>
        <p className="text-emerald-100 text-sm">Select your system size to find compatible inverters.</p>
      </div>

      <div className="p-6 space-y-8">
        {/* Input Section */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <label htmlFor="panel-count" className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Number of 620Wp Panels
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="panel-count"
                  type="number"
                  min="0"
                  max="100"
                  value={panelCount}
                  onChange={(e) => {
                    let val = e.target.value;
                    // Strip leading zeros if there's a following digit
                    if (val.length > 1 && val.startsWith('0')) {
                      val = val.replace(/^0+/, '');
                    }
                    // Only allow numbers and max 100
                    if (val === '' || (/^\d+$/.test(val) && parseInt(val) <= 100)) {
                      setPanelCount(val);
                    }
                  }}
                  onFocus={(e) => {
                    if (panelCount === '0') setPanelCount('');
                  }}
                  onBlur={(e) => {
                    if (panelCount === '') setPanelCount('0');
                  }}
                  className="w-32 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-lg"
                />
                <span className="text-slate-400 font-medium">× 620Wp</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Zap className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-tight">Total DC Power</div>
                <div className="text-2xl font-black text-slate-900">
                  {(pdc / 1000).toFixed(2)} <span className="text-sm font-bold text-slate-400">kWp</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selection Panel */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              Recommended Inverters
              <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
                {filteredInverters.length} Found
              </span>
            </h3>
            
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              {(['all', 1, 3] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPhaseFilter(p)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    phaseFilter === p 
                      ? 'bg-white text-emerald-700 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {p === 'all' ? 'All Phases' : `${p} Phase`}
                </button>
              ))}
            </div>
          </div>

          {filteredInverters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInverters.map((inv, idx) => {
                const loadPercentage = Math.min(100, (pdc / inv.maxDc) * 100);
                const acLoadPercentage = (pdc / inv.ratedAc) * 100;
                
                return (
                  <div 
                    key={`${inv.model}-${idx}`}
                    className="relative p-5 rounded-2xl border bg-white border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-lg font-black text-slate-900">{inv.model}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {inv.phase} Phase Inverter
                        </div>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500 uppercase">Load Capacity</span>
                        <span className="text-emerald-600">
                          {loadPercentage.toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            loadPercentage > 90 ? 'bg-orange-400' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${loadPercentage}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Max DC Input</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase text-right">AC Rating</div>
                        <div className="text-xs font-bold text-slate-700">{inv.maxDc}W</div>
                        <div className="text-xs font-bold text-slate-700 text-right">{inv.ratedAc}W</div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Efficiency</span>
                        <span className="text-xs font-bold text-emerald-600">{(inv.efficiency * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center">
              <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-slate-600 mb-2">No Matching Inverters</h4>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                Try adjusting your panel count or changing the phase filter to find compatible options.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
