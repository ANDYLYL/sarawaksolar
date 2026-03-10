import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Sun, Zap, Shield, Phone, MessageCircle, Mail, ArrowRight, Menu, X, Clock, Newspaper, Send, User, Bot } from 'lucide-react';
import ChatBot from './components/ChatBot';

import SolarConfigurator from './components/SolarConfigurator';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const scrollToForm = () => {
    const form = document.getElementById('eligibility-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const [selectedNews, setSelectedNews] = useState<typeof newsItems[0] | null>(null);

  const newsItems = [
    {
      date: "February 24, 2025",
      title: "Sarawak Energy to Expand Floating Solar Projects",
      summary: "Following the success of the Batang Ai floating solar farm, Sarawak Energy is looking to replicate the model in other reservoirs to boost renewable energy capacity.",
      fullContent: "Sarawak Energy Berhad (SEB) is accelerating its renewable energy ambitions by expanding floating solar projects across the state's hydroelectric reservoirs. Following the successful commissioning of the 50MW floating solar farm at the Batang Ai reservoir, the utility company is now conducting feasibility studies for similar installations at the Bakun and Murum dams.\n\nFloating solar technology is particularly advantageous for Sarawak as it utilizes existing water surfaces, reduces evaporation, and can be integrated directly into the existing power grid infrastructure of the hydroelectric plants. This hybrid approach—combining hydro and solar—ensures a more stable and reliable renewable energy supply for the state's growing industrial and residential needs.\n\nBy leveraging its vast water bodies, Sarawak aims to become a regional leader in renewable energy, supporting both local demand and potential energy exports to neighboring regions.",
      link: "https://www.sarawakenergy.com/news-events/news-announcements"
    },
    {
      date: "January 15, 2025",
      title: "Sarawak's Net Energy Metering (NEM) Scheme Sees Record Uptake",
      summary: "Homeowners in Kuching and Miri are leading the transition to solar as the state government's RM12,000 subsidy program enters its peak phase.",
      fullContent: "The residential Net Energy Metering (NEM) scheme in Sarawak has reached a significant milestone, with record numbers of homeowners in Kuching, Miri, and Bintulu applying for solar installations in the first quarter of 2025. This surge is largely attributed to the Sarawak government's RM12,000 solar subsidy program, which significantly lowers the initial investment cost for families.\n\nUnder the NEM scheme, homeowners can generate their own clean energy and export any surplus back to the Sarawak Energy grid, receiving credits that offset their monthly electricity bills. This 'sell-back' mechanism effectively turns rooftops into mini power plants, providing long-term financial savings while contributing to environmental sustainability.\n\nIndustry experts predict that the current quota for 2025 may be fully utilized sooner than expected, prompting calls for an extension of the subsidy program to support the state's transition to a low-carbon economy.",
      link: "https://www.thestar.com.my/news/nation/2024/05/22/sarawak-to-introduce-solar-subsidy-for-residential-homes"
    },
    {
      date: "March 1, 2025",
      title: "New Solar Panel Standards for Sarawak Residential Installations",
      summary: "The Sarawak Energy Transition Policy (SET-P) has introduced new efficiency standards for residential solar panels to ensure maximum yield for homeowners.",
      fullContent: "The Ministry of Utility and Telecommunication Sarawak, in collaboration with Sarawak Energy, has introduced updated technical standards for residential solar panel installations under the Sarawak Energy Transition Policy (SET-P). These new guidelines focus on enhancing the safety, efficiency, and durability of solar systems in Sarawak's tropical climate.\n\nKey updates include mandatory Tier-1 panel certification, specific mounting requirements to withstand high wind speeds during monsoon seasons, and the integration of smart inverters capable of grid stabilization. The policy also emphasizes the importance of using SEB-registered contractors to ensure that all installations meet the rigorous safety criteria required for grid connection.\n\nThese standards are designed to protect consumers' investments and ensure that residential solar systems contribute effectively to the state's long-term energy security goals.",
      link: "https://www.theborneopost.com/tag/solar-energy/"
    }
  ];

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

          <SolarConfigurator />
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
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-emerald-600 text-sm font-semibold mb-2">{item.date}</span>
                  <h3 className="text-xl font-bold text-emerald-900 mb-3 leading-tight">{item.title}</h3>
                  <p className="text-slate-600 text-sm mb-6 flex-grow">{item.summary}</p>
                  <button 
                    onClick={() => setSelectedNews(item)}
                    className="text-emerald-700 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all w-fit"
                  >
                    Read More <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* News Modal */}
          {selectedNews && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div 
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Newspaper className="h-5 w-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">News Update</span>
                  </div>
                  <button 
                    onClick={() => setSelectedNews(null)}
                    className="p-2 rounded-full hover:bg-slate-200 transition-colors text-slate-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="p-8 overflow-y-auto">
                  <span className="text-emerald-600 text-sm font-semibold mb-2 block">{selectedNews.date}</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-6 leading-tight">
                    {selectedNews.title}
                  </h2>
                  <div className="prose prose-slate max-w-none">
                    {selectedNews.fullContent.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="text-slate-600 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  <div className="mt-10 pt-6 border-t border-slate-100">
                    <p className="text-xs text-slate-400 mb-3 uppercase font-bold tracking-widest">Original Source</p>
                    <a 
                      href={selectedNews.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 text-sm font-medium hover:underline break-all flex items-center gap-2"
                    >
                      {selectedNews.link} <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => setSelectedNews(null)}
                    className="px-6 py-2 rounded-xl bg-emerald-900 text-white font-bold hover:bg-emerald-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="absolute inset-0 -z-10" onClick={() => setSelectedNews(null)}></div>
            </div>
          )}
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
            
            <form 
              className="p-8 md:p-12 space-y-6" 
              onSubmit={(e) => { 
                e.preventDefault(); 
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name');
                const phone = formData.get('phone');
                const bill = formData.get('bill');
                const method = formData.get('contactMethod');

                if (method === 'whatsapp') {
                  const message = `Hello Sarawak Solar! I would like to check my eligibility for the 2026 NEM subsidy.%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Monthly Bill:* RM${bill}`;
                  window.open(`https://wa.me/60102841069?text=${message}`, '_blank');
                } else {
                  const subject = encodeURIComponent(`NEM Eligibility Check - ${name}`);
                  const body = encodeURIComponent(`Hello,\n\nI would like to check my eligibility for the 2026 NEM subsidy.\n\nName: ${name}\nPhone: ${phone}\nMonthly Bill: RM${bill}`);
                  window.location.href = `mailto:andy.low@neutoenergy.com?subject=${subject}&body=${body}`;
                }
              }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
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
                    name="phone"
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
                    name="bill"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    placeholder="350"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Preferred Contact Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="relative flex items-center justify-center p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 group">
                    <input type="radio" name="contactMethod" value="whatsapp" defaultChecked className="sr-only" />
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-[#25D366]" />
                      <span className="font-semibold text-slate-700 group-has-[:checked]:text-emerald-900">WhatsApp</span>
                    </div>
                  </label>
                  <label className="relative flex items-center justify-center p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 group">
                    <input type="radio" name="contactMethod" value="email" className="sr-only" />
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-emerald-600" />
                      <span className="font-semibold text-slate-700 group-has-[:checked]:text-emerald-900">Email</span>
                    </div>
                  </label>
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

      <ChatBot />
    </div>
  );
}
