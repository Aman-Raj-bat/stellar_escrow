import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Code, Network, FileJson, ArrowRight } from 'lucide-react';

type DocSection = 'introduction' | 'architecture' | 'testnet' | 'lifecycle' | 'factory' | 'events';

export const Docs: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DocSection>('introduction');

  const contentMap: Record<DocSection, React.ReactNode> = {
    introduction: (
      <>
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">Documentation</h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
            Everything you need to know about TrustPay's technical architecture. Explore guides, contract specifications, and integration tutorials for the Stellar Soroban network.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              icon: <Network className="w-6 h-6 text-[#9945FF]" />,
              title: "Soroban Smart Contract",
              description: "Learn how the TrustPay escrow contract manages XLM locks, deposits, and release mechanics safely on the Stellar testnet.",
            },
            {
              icon: <Terminal className="w-6 h-6 text-[#08B5E5]" />,
              title: "CLI & Deployment",
              description: "Quickstart guide on compiling the Rust contract to Wasm and deploying it via the stellar-cli.",
            },
            {
              icon: <Code className="w-6 h-6 text-emerald-400" />,
              title: "Frontend Integration",
              description: "Documentation on the stellar-sdk integration, freighter wallet connection, and invoking contract methods via React.",
            },
            {
              icon: <FileJson className="w-6 h-6 text-amber-400" />,
              title: "Contract Types & SDK",
              description: "Explore the generated TypeScript bindings and the data structures (EscrowData, Status) used in the application.",
            }
          ].map((section, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-[#111216]/60 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:bg-white/[0.02] hover:border-white/10 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center border border-white/5 mb-5 shadow-inner">
                {section.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{section.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">{section.description}</p>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">
                Read more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-black/40 border border-white/5 rounded-2xl p-8 shadow-inner">
          <h3 className="text-xl font-bold text-white mb-3">Looking for the GitHub repository?</h3>
          <p className="text-sm text-slate-300 mb-6">Access the full source code for the frontend and Soroban smart contracts.</p>
          <a href="#" className="inline-flex items-center gap-2 bg-white text-black hover:bg-slate-200 px-6 py-3 rounded-xl font-bold transition-colors">
            View on GitHub
          </a>
        </div>
      </>
    ),
    architecture: (
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Architecture Overview</h1>
        <p className="text-slate-300 leading-relaxed">TrustPay is built using a modern Web3 stack consisting of a React frontend and Stellar Soroban smart contracts written in Rust.</p>
        <div className="bg-[#111216]/60 backdrop-blur-md rounded-2xl p-6 border border-white/5">
          <h3 className="text-xl font-bold text-white mb-2">Frontend</h3>
          <p className="text-slate-300 mb-4">React, Vite, TailwindCSS, Framer Motion, and stellar-sdk.</p>
          <h3 className="text-xl font-bold text-white mb-2">Smart Contracts</h3>
          <p className="text-slate-300">Rust, Soroban SDK, deployed on the Stellar Testnet.</p>
        </div>
      </div>
    ),
    testnet: (
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Testnet Setup</h1>
        <p className="text-slate-300 leading-relaxed">To interact with TrustPay, you need to configure your Freighter wallet for the Stellar Testnet.</p>
        <div className="bg-[#111216]/60 backdrop-blur-md rounded-2xl p-6 border border-white/5">
          <ol className="list-decimal list-inside text-slate-300 space-y-3">
            <li>Open the Freighter Wallet extension.</li>
            <li>Go to Settings {'>'} Preferences.</li>
            <li>Enable "Testnet" mode.</li>
            <li>Fund your wallet using the Stellar Laboratory Friendbot.</li>
          </ol>
        </div>
      </div>
    ),
    lifecycle: (
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Escrow Lifecycle</h1>
        <p className="text-slate-300 leading-relaxed">The state machine of a TrustPay escrow contract ensures safety and immutability.</p>
        <div className="bg-[#111216]/60 backdrop-blur-md rounded-2xl p-6 border border-white/5 space-y-4">
          <div><strong className="text-white">Created:</strong> Contract deployed by Factory.</div>
          <div><strong className="text-white">Funded:</strong> Client deposits XLM.</div>
          <div><strong className="text-white">Accepted:</strong> Freelancer agrees to terms.</div>
          <div><strong className="text-white">Released / Refunded:</strong> Terminal states where funds are distributed.</div>
        </div>
      </div>
    ),
    factory: (
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Factory Pattern</h1>
        <p className="text-slate-300 leading-relaxed">TrustPay uses a Factory Smart Contract to programmatically deploy new Escrow contracts.</p>
        <div className="bg-[#111216]/60 backdrop-blur-md rounded-2xl p-6 border border-white/5">
          <p className="text-slate-300">This ensures each freelance gig is isolated in its own unique contract address, providing security and preventing state overlap.</p>
        </div>
      </div>
    ),
    events: (
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Events</h1>
        <p className="text-slate-300 leading-relaxed">The smart contracts emit events for every major state change.</p>
        <div className="bg-[#111216]/60 backdrop-blur-md rounded-2xl p-6 border border-white/5">
          <p className="text-slate-300">Events such as <code>EscrowCreated</code>, <code>Funded</code>, and <code>Released</code> are indexed by the Stellar network and parsed by our frontend to build the Activity Timeline.</p>
        </div>
      </div>
    )
  };

  const navLinkClass = (section: DocSection) => 
    `transition-colors cursor-pointer ${activeSection === section ? 'text-[#08B5E5] font-bold' : 'text-slate-400 hover:text-white'}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="absolute top-0 right-0 w-full h-[600px] bg-[#08B5E5]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="flex flex-col md:flex-row gap-12 relative z-10">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Getting Started</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><button onClick={() => setActiveSection('introduction')} className={navLinkClass('introduction')}>Introduction</button></li>
              <li><button onClick={() => setActiveSection('architecture')} className={navLinkClass('architecture')}>Architecture Overview</button></li>
              <li><button onClick={() => setActiveSection('testnet')} className={navLinkClass('testnet')}>Testnet Setup</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Smart Contracts</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><button onClick={() => setActiveSection('lifecycle')} className={navLinkClass('lifecycle')}>Escrow Lifecycle</button></li>
              <li><button onClick={() => setActiveSection('factory')} className={navLinkClass('factory')}>Factory Pattern</button></li>
              <li><button onClick={() => setActiveSection('events')} className={navLinkClass('events')}>Events</button></li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {contentMap[activeSection]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
