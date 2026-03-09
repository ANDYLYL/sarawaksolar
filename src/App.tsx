import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Sun, Zap, Shield, Phone, MessageCircle, ArrowRight, Menu, X, Clock, Newspaper, Send, User, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini for the chat feature
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Hello! I am your Sarawak Solar assistant. How can I help you with the 2026 NEM subsidy today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set target date for NEM 2026 Quota (e.g., Dec 31, 2026)
    const targetDate = new Date('2026-12-31T23:59:59').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const scrollToForm = () => {
    const form = document.getElementById('eligibility-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg = userInput;
    setUserInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ role: "user", parts: [{ text: `You are a helpful solar energy consultant for SarawakSolar.com. You are helping a customer in Sarawak, Malaysia. 
        Context:
        - 2026 Sarawak Energy NEM Subsidy is active.
        - Subsidies: RM8k (2-3.5kW), RM10k (3.5-6kW), RM12k (6-50kW).
        - Benefits: 1:1 energy offset, 15-year SEB contract.
        - Requirements: SEB Registered Contractor, SET-P compliance.
        Answer the following question briefly and professionally: ${userMsg}` }] }],
      });
      setChatMessages(prev => [...prev, { role: 'bot', text: response.text || "I'm sorry, I couldn't generate a response." }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { role: 'bot', text: "I'm sorry, I'm having trouble connecting. Please try again or contact us via WhatsApp!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const newsItems = [
    {
      date: "February 24, 2025",
      title: "Sarawak Energy to Expand Floating Solar Projects",
      summary: "Following the success of the Batang Ai floating solar farm, Sarawak Energy is looking to replicate the model in other reservoirs to boost renewable energy capacity.",
      image: "https://picsum.photos/seed/sarawaksolar1/400/250",
      link: "https://www.sarawakenergy.com/news-events/news-announcements"
    },
    {
      date: "January 15, 2025",
      title: "Sarawak's Net Energy Metering (NEM) Scheme Sees Record Uptake",
      summary: "Homeowners in Kuching and Miri are leading the transition to solar as the state government's RM12,000 subsidy program enters its peak phase.",
      image: "https://picsum.photos/seed/sarawaksolar2/400/250",
      link: "https://www.thestar.com.my/news/nation/2024/05/22/sarawak-to-introduce-solar-subsidy-for-residential-homes"
    },
    {
      date: "March 1, 2025",
      title: "New Solar Panel Standards for Sarawak Residential Installations",
      summary: "The Sarawak Energy Transition Policy (SET-P) has introduced new efficiency standards for residential solar panels to ensure maximum yield for homeowners.",
      image: "https://picsum.photos/seed/sarawaksolar3/400/250",
      link: "https://www.theborneopost.com/tag/solar-energy/"
    }
  ];

  // Configurator State
  const [billAmount, setBillAmount] = useState<number>(350);
  const [selectedPhase, setSelectedPhase] = useState<1 | 3>(1);
  const [panelCount, setPanelCount] = useState(10);
  const PANEL_WATTAGE = 620; // Wp
  const DC_AC_RATIO = 1.2;
  const SUN_HOURS_PER_DAY = 3.6; // Average for Sarawak

  // Sarawak Residential Tariff Calculation (Bill RM -> kWh)
  const calculateKWhFromBill = (bill: number) => {
    let remainingBill = bill;
    let kwh = 0;

    const tiers = [
      { limit: 100, rate: 0.070 }, // 0-100
      { limit: 100, rate: 0.120 }, // 101-200
      { limit: 100, rate: 0.185 }, // 201-300
      { limit: 100, rate: 0.230 }, // 301-400
      { limit: 300, rate: 0.275 }, // 401-700
      { limit: 600, rate: 0.280 }, // 701-1300
      { limit: Infinity, rate: 0.295 } // > 1300
    ];

    for (const tier of tiers) {
      const maxCostInTier = tier.limit * tier.rate;
      if (remainingBill > maxCostInTier) {
        kwh += tier.limit;
        remainingBill -= maxCostInTier;
      } else {
        kwh += remainingBill / tier.rate;
        remainingBill = 0;
        break;
      }
    }
    return kwh;
  };

  // Update panel count based on bill (75% offset)
  useEffect(() => {
    const monthlyKWh = calculateKWhFromBill(billAmount);
    const targetKWh = monthlyKWh * 0.75;
    const requiredKWp = targetKWh / (SUN_HOURS_PER_DAY * 30);
    const recommendedPanels = Math.ceil((requiredKWp * 1000) / PANEL_WATTAGE);
    // Ensure even number of panels for typical string sizing
    const evenPanels = recommendedPanels % 2 === 0 ? recommendedPanels : recommendedPanels + 1;
    setPanelCount(Math.max(4, Math.min(60, evenPanels)));
  }, [billAmount]);

  const totalDCkWp = (panelCount * PANEL_WATTAGE) / 1000;

  const inverters = [
    { id: '1p-3', name: '1-Phase 3kW', ac: 3, phase: 1 },
    { id: '1p-5', name: '1-Phase 5kW', ac: 5, phase: 1 },
    { id: '1p-8', name: '1-Phase 8kW', ac: 8, phase: 1 },
    { id: '1p-10', name: '1-Phase 10kW', ac: 10, phase: 1 },
    { id: '3p-5', name: '3-Phase 5kW', ac: 5, phase: 3 },
    { id: '3p-10', name: '3-Phase 10kW', ac: 10, phase: 3 },
    { id: '3p-15', name: '3-Phase 15kW', ac: 15, phase: 3 },
    { id: '3p-20', name: '3-Phase 20kW', ac: 20, phase: 3 },
    { id: '3p-25', name: '3-Phase 25kW', ac: 25, phase: 3 },
    { id: '3p-30', name: '3-Phase 30kW', ac: 30, phase: 3 },
  ];

  const getInverterStatus = (ac: number) => {
    const maxDC = ac * DC_AC_RATIO;
    const minDC = ac * 0.6; // Arbitrary lower bound for efficiency

    if (totalDCkWp > maxDC) return { label: 'Overpowered', color: 'amber' };
    if (totalDCkWp < minDC) return { label: 'Underpowered', color: 'amber' };
    if (totalDCkWp >= ac * 0.9 && totalDCkWp <= maxDC) return { label: 'Optimized', color: 'green' };
    return { label: 'Compatible', color: 'emerald' };
  };

  const filteredInverters = inverters.filter(inv => inv.phase === selectedPhase);
  const recommendedInverter = filteredInverters.find(inv => totalDCkWp <= inv.ac * DC_AC_RATIO);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* Top Banner Countdown */}
      <div className="bg-yellow-400 text-emerald-900 py-2 px-4 text-center font-bold text-sm md:text-base flex items-center justify-center gap-4 overflow-hidden">
        <div className="flex items-center gap-2 animate-pulse">
          <Clock className="h-4 w-4" />
          <span>2026 NEM QUOTA CLOSING IN:</span>
        </div>
        <div className="flex gap-3 tabular-nums">
          <span>{timeLeft.days}d</span>
          <span>{timeLeft.hours}h</span>
          <span>{timeLeft.minutes}m</span>
          <span>{timeLeft.seconds}s</span>
        </div>
      </div>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-emerald-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <Sun className="h-8 w-8 text-yellow-400" />
              <span className="font-bold text-2xl text-emerald-900 tracking-tight">SarawakSolar</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#subsidy" className="text-slate-600 hover:text-emerald-900 font-medium transition-colors">Subsidy Info</a>
              <a href="#benefits" className="text-slate-600 hover:text-emerald-900 font-medium transition-colors">NEM Benefits</a>
              <a href="#configurator" className="text-slate-600 hover:text-emerald-900 font-medium transition-colors">Configurator</a>
              <a href="#news" className="text-slate-600 hover:text-emerald-900 font-medium transition-colors">Latest News</a>
              <button 
                onClick={scrollToForm}
                className="bg-emerald-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-emerald-800 transition-colors shadow-md hover:shadow-lg"
              >
                Check Eligibility
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-emerald-900 hover:text-emerald-700"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-emerald-900/10 absolute w-full">
            <div className="px-4 pt-2 pb-6 space-y-2 shadow-lg">
              <a href="#subsidy" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-slate-600 font-medium hover:bg-emerald-50 rounded-lg">Subsidy Info</a>
              <a href="#benefits" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-slate-600 font-medium hover:bg-emerald-50 rounded-lg">NEM Benefits</a>
              <a href="#configurator" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-slate-600 font-medium hover:bg-emerald-50 rounded-lg">Configurator</a>
              <a href="#news" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-slate-600 font-medium hover:bg-emerald-50 rounded-lg">Latest News</a>
              <button 
                onClick={scrollToForm}
                className="w-full mt-4 bg-emerald-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-800 transition-colors"
              >
                Check Eligibility
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://picsum.photos/seed/solar/1920/1080?blur=2" 
            alt="Solar Panels on Roof" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-emerald-900/80 mix-blend-multiply"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/20 text-yellow-400 font-semibold mb-6 border border-yellow-400/30">
              <Zap className="h-4 w-4" />
              <span>2026 Sarawak Energy NEM Subsidy</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Get up to <span className="text-yellow-400">RM12,000 Subsidy</span> for Rooftop Solar in Sarawak.
            </h1>
            <p className="text-xl text-emerald-100 mb-10 max-w-2xl leading-relaxed">
              Lock in your NEM Quota for 2026 today! Slash your electricity bills and join the green energy revolution with government-backed incentives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={scrollToForm}
                className="bg-yellow-400 text-emerald-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(250,204,21,0.4)] flex items-center justify-center gap-2"
              >
                Claim Your RM12,000 Subsidy Now
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Subsidy Breakdown Section */}
      <section id="subsidy" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">Clear, Transparent Subsidy Pricing</h2>
            <p className="text-lg text-slate-600">The Sarawak Government provides tiered subsidies based on your solar system capacity. See how much you can save.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Tier 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 hover:border-emerald-500 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:bg-emerald-100 transition-colors"></div>
              <h3 className="text-xl font-semibold text-slate-500 mb-2">Small Homes</h3>
              <div className="text-4xl font-bold text-emerald-900 mb-2">2 - 3.5 <span className="text-xl text-slate-500 font-medium">kWac</span></div>
              <div className="text-2xl font-bold text-yellow-500 mb-6">RM 8,000 <span className="text-sm text-slate-500 font-normal">Subsidy</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-slate-600">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Perfect for monthly bills RM150 - RM300</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Requires ~150 sqft roof space</span>
                </li>
              </ul>
              <button onClick={scrollToForm} className="w-full py-3 rounded-xl font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 transition-colors">Check Eligibility</button>
            </div>

            {/* Tier 2 */}
            <div className="bg-emerald-900 rounded-2xl shadow-xl p-8 border border-emerald-800 relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-yellow-400 text-emerald-900 text-sm font-bold px-4 py-1 rounded-b-lg">MOST POPULAR</div>
              <h3 className="text-xl font-semibold text-emerald-300 mb-2 mt-4">Medium Homes</h3>
              <div className="text-4xl font-bold text-white mb-2">3.5 - 6 <span className="text-xl text-emerald-200 font-medium">kWac</span></div>
              <div className="text-2xl font-bold text-yellow-400 mb-6">RM 10,000 <span className="text-sm text-emerald-200 font-normal">Subsidy</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-emerald-50">
                  <CheckCircle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                  <span>Perfect for monthly bills RM300 - RM600</span>
                </li>
                <li className="flex items-start gap-3 text-emerald-50">
                  <CheckCircle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                  <span>Requires ~300 sqft roof space</span>
                </li>
              </ul>
              <button onClick={scrollToForm} className="w-full py-3 rounded-xl font-bold text-emerald-900 bg-yellow-400 hover:bg-yellow-300 transition-colors shadow-lg">Check Eligibility</button>
            </div>

            {/* Tier 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 hover:border-emerald-500 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:bg-emerald-100 transition-colors"></div>
              <h3 className="text-xl font-semibold text-slate-500 mb-2">Large Homes</h3>
              <div className="text-4xl font-bold text-emerald-900 mb-2">6 - 50 <span className="text-xl text-slate-500 font-medium">kWac</span></div>
              <div className="text-2xl font-bold text-yellow-500 mb-6">RM 12,000 <span className="text-sm text-slate-500 font-normal">Subsidy</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-slate-600">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Perfect for monthly bills RM600+</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Requires 400+ sqft roof space</span>
                </li>
              </ul>
              <button onClick={scrollToForm} className="w-full py-3 rounded-xl font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 transition-colors">Check Eligibility</button>
            </div>
          </div>
        </div>
      </section>

      {/* NEM Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-6">How the Two-Meter NEM System Works</h2>
              <p className="text-lg text-slate-600 mb-8">
                Under the Sarawak Energy NEM scheme, your roof becomes a mini power plant. All solar energy generated is exported directly to the grid via a dedicated solar meter.
              </p>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                    <Zap className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-emerald-900 mb-2">100% Export & 1:1 Offset</h4>
                    <p className="text-slate-600">
                      Every unit (kWh) of solar energy you generate is exported to the grid and credited against your total consumption at the exact same tariff rate. It's a true unit-for-unit exchange.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Shield className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-emerald-900 mb-2">Two-Meter Configuration</h4>
                    <p className="text-slate-600">
                      Sesco installs two meters: one for your household consumption (Import) and one for your solar generation (Export). Your bill is calculated based on the net difference.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-900 rounded-3xl transform translate-x-4 translate-y-4 opacity-10"></div>
              <img 
                src="https://picsum.photos/seed/house/800/600" 
                alt="Modern house with solar" 
                className="rounded-3xl shadow-2xl relative z-10 object-cover w-full h-[400px]"
                referrerPolicy="no-referrer"
              />
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-900 rounded-full flex items-center justify-center">
                    <Sun className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 font-medium">Average Savings</div>
                    <div className="text-2xl font-bold text-emerald-900">Up to 80%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solar Configuration Tool */}
      <section id="configurator" className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">Real-time Solar Configuration Tool</h2>
            <p className="text-lg text-slate-600">Estimate your system size and find the perfect inverter match instantly.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-200">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Left Column: Input */}
              <div className="lg:col-span-1 space-y-8">
                <div>
                  <label className="block text-sm font-bold text-emerald-900 uppercase tracking-wider mb-4">1. Monthly Electricity Bill (RM)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">RM</span>
                    <input 
                      type="number" 
                      value={billAmount}
                      onChange={(e) => setBillAmount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-900 outline-none transition-all font-bold text-emerald-900"
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500 italic">We recommend sizing to offset 75% of your total bill via 100% export (~{calculateKWhFromBill(billAmount).toFixed(0)} kWh/month)</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-emerald-900 uppercase tracking-wider mb-4">2. Select House Phase Supply</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setSelectedPhase(1)}
                      className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${
                        selectedPhase === 1 
                        ? 'bg-emerald-900 text-white border-emerald-900 shadow-lg' 
                        : 'bg-white text-emerald-900 border-slate-200 hover:border-emerald-900'
                      }`}
                    >
                      1-Phase
                    </button>
                    <button 
                      onClick={() => setSelectedPhase(3)}
                      className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${
                        selectedPhase === 3 
                        ? 'bg-emerald-900 text-white border-emerald-900 shadow-lg' 
                        : 'bg-white text-emerald-900 border-slate-200 hover:border-emerald-900'
                      }`}
                    >
                      3-Phase
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-emerald-900 uppercase tracking-wider mb-4">3. Fine-tune Number of Panels</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="4" 
                      max="60" 
                      step="2"
                      value={panelCount}
                      onChange={(e) => setPanelCount(parseInt(e.target.value))}
                      className="flex-grow h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <span className="text-2xl font-bold text-emerald-900 w-12">{panelCount}</span>
                  </div>
                </div>

                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="text-sm text-emerald-700 font-semibold uppercase mb-1">Total DC Power</div>
                  <div className="text-4xl font-bold text-emerald-900">{totalDCkWp.toFixed(2)} <span className="text-xl">kWp</span></div>
                </div>

                {recommendedInverter && (
                  <div className="p-6 bg-yellow-400 rounded-2xl shadow-lg">
                    <div className="text-sm text-emerald-900 font-bold uppercase mb-1">Recommended Inverter</div>
                    <div className="text-2xl font-bold text-emerald-900">{recommendedInverter.name}</div>
                    <div className="text-sm text-emerald-800 mt-2 font-medium">Optimized for {totalDCkWp.toFixed(2)}kWp DC load.</div>
                  </div>
                )}
              </div>

              {/* Right Column: Inverter Selection */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-emerald-900">Inverter Compatibility Matrix</h3>
                  <div className="flex gap-4 text-xs font-bold uppercase">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Optimized</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Compatible</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-500 rounded-full"></div> Sub-optimal</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {filteredInverters.map((inv) => {
                    const status = getInverterStatus(inv.ac);
                    const isRecommended = recommendedInverter?.id === inv.id;
                    return (
                      <div 
                        key={inv.id}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-default relative overflow-hidden ${
                          isRecommended ? 'border-yellow-400 ring-2 ring-yellow-400 ring-offset-2' : 'border-slate-100'
                        } ${
                          status.color === 'green' ? 'bg-green-50 border-green-200' : 
                          status.color === 'amber' ? 'bg-amber-50 border-amber-200' : 'bg-white'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-500 mb-1">{inv.phase === 1 ? '1-PHASE' : '3-PHASE'}</div>
                        <div className="text-lg font-bold text-emerald-900">{inv.ac}kW AC</div>
                        <div className={`mt-3 inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          status.color === 'green' ? 'bg-green-500 text-white' : 
                          status.color === 'amber' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                        }`}>
                          {status.label}
                        </div>
                        <div className="mt-2 text-[10px] text-slate-500">Max DC: {(inv.ac * 1.2).toFixed(1)}kW</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <Newspaper className="h-8 w-8 text-emerald-700" />
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">Latest Solar News in Sarawak</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {newsItems.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-slate-100 flex flex-col">
                <img src={item.image} alt={item.title} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-emerald-600 text-sm font-semibold mb-2">{item.date}</span>
                  <h3 className="text-xl font-bold text-emerald-900 mb-3 leading-tight">{item.title}</h3>
                  <p className="text-slate-600 text-sm mb-6 flex-grow">{item.summary}</p>
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-700 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    Read More <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Trust Signals */}
      <section id="trust" className="py-16 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-emerald-800 flex items-center justify-center shrink-0 border border-emerald-700">
                <Shield className="h-8 w-8 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">SET-P Compliant</h3>
                <p className="text-emerald-100">Our installations fully comply with the Sarawak Energy Transition Policy (SET-P), ensuring you qualify for all state incentives.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-emerald-800 flex items-center justify-center shrink-0 border border-emerald-700">
                <CheckCircle className="h-8 w-8 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">SEB Registered Contractors</h3>
                <p className="text-emerald-100">Only Sarawak Energy Berhad (SEB) registered contractors can apply for the NEM quota. We handle the entire application process for you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Magnet Form */}
      <section id="eligibility-form" className="py-24 bg-slate-50 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="bg-emerald-900 p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Check Your Eligibility</h2>
              <p className="text-emerald-100">Find out exactly how much subsidy you qualify for. No obligations.</p>
            </div>
            
            <form className="p-8 md:p-12 space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Form submitted! We will contact you shortly.'); }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    placeholder="+60 12-345 6789"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="bill" className="block text-sm font-medium text-slate-700">Average Monthly SEB Bill (RM)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">RM</span>
                  <input 
                    type="number" 
                    id="bill" 
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    placeholder="350"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-yellow-400 text-emerald-900 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2"
                >
                  Claim Your RM12,000 Subsidy Now
                  <ArrowRight className="h-5 w-5" />
                </button>
                <p className="text-center text-sm text-slate-500 mt-4">
                  By submitting, you agree to our privacy policy. Your data is secure.
                </p>
              </div>
            </form>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-64 bg-emerald-900/5 -skew-y-3 transform origin-top-left"></div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Sun className="h-6 w-6 text-slate-500" />
              <span className="font-bold text-xl text-slate-300 tracking-tight">SarawakSolar</span>
            </div>
            <div className="text-sm text-center md:text-left">
              &copy; 2026 Sarawak Solar Solutions. All rights reserved.<br/>
              Not affiliated with Sarawak Energy Berhad. We are an independent registered contractor.
            </div>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
        {isChatOpen && (
          <div className="bg-white w-[350px] h-[500px] rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-4 duration-300">
            {/* Chat Header */}
            <div className="bg-emerald-900 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Solar Assistant</div>
                  <div className="text-emerald-300 text-xs flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    Online
                  </div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-emerald-300 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                    ? 'bg-emerald-900 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 rounded-tl-none flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask about subsidies..."
                className="flex-grow px-4 py-2 rounded-full bg-slate-100 border-none focus:ring-2 focus:ring-emerald-500 text-sm outline-none"
              />
              <button type="submit" className="bg-emerald-900 text-white p-2 rounded-full hover:bg-emerald-800 transition-colors">
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}

        <div className="flex gap-4">
          {/* WhatsApp Button */}
          <a 
            href="https://wa.me/60102841069" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="h-8 w-8" />
          </a>

          {/* Chat Toggle Button */}
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="bg-emerald-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center relative"
            aria-label="Open Chat"
          >
            {isChatOpen ? <X className="h-8 w-8" /> : <Bot className="h-8 w-8" />}
            {!isChatOpen && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
