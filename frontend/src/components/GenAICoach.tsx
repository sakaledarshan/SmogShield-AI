"use client";

import React, { useState } from "react";
import { Bot, Send, Wrench, Sparkles, BookOpen } from "lucide-react";
import { ChatCoachResponse, HouseholdProfile } from "@/types";
import { api } from "@/services/api";

interface GenAICoachProps {
  profile: HouseholdProfile;
  currentAQI: number;
  initialPrompt?: string;
}

export const GenAICoach: React.FC<GenAICoachProps> = ({
  profile,
  currentAQI,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<Array<{ role: "user" | "coach"; content: string; response?: ChatCoachResponse }>>([
    {
      role: "coach",
      content: `Hello! I am your SmogShield AI Coach. Based on your household profile (${profile.has_infants ? "Infant present, " : ""}${profile.has_respiratory_conditions ? "Asthma vulnerability, " : ""}budget tier: ${profile.budget_tier}) and current ambient AQI of ${currentAQI}, I'm here to provide verified, low-cost indoor air protection hacks and routine adjustments. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState(initialPrompt || "");
  const [loading, setLoading] = useState(false);

  const sampleChips = [
    "How do I prep infant nursery for tonight's inversion?",
    "Build a DIY Corsi-Rosenthal box under $60",
    "Can I use an ozone generator to clean the air?",
    "Best wet mopping protocol to stop dust resuspension",
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    setInput("");
    const newMsgs = [...messages, { role: "user" as const, content: query }];
    setMessages(newMsgs);
    setLoading(true);

    try {
      const res = await api.askCoach(query, profile, currentAQI);
      setMessages([...newMsgs, { role: "coach", content: res.reply, response: res }]);
    } catch {
      setMessages([
        ...newMsgs,
        {
          role: "coach",
          content: "Sorry, I had trouble retrieving guidance. Please ensure mechanical HEPA filtration and envelope sealing.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-white">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-800/40 p-4 sm:p-5 flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">
              Guardrailed SmogShield AI Coach
            </h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              WHO / EPA RAG
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Grounded environmental guidance with automatic safety interceptions against dangerous DIY hacks.
          </p>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex flex-wrap gap-1.5">
        {sampleChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition active:scale-95"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Thread */}
      <div className="rounded-2xl bg-slate-850 border border-slate-750 p-4 min-h-[380px] max-h-[520px] overflow-y-auto space-y-3.5 shadow-inner">
        {messages.map((m, idx) => {
          const isUser = m.role === "user";
          const res = m.response;

          return (
            <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 text-xs ${
                  isUser
                    ? "bg-blue-600 text-white rounded-br-none shadow-md"
                    : "bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none shadow"
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{m.content}</div>

                {/* Grounded RAG Frameworks */}
                {res && res.grounded_frameworks?.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                    <BookOpen className="w-3 h-3 text-teal-400" />
                    <span>Grounded Sources:</span>
                    {res.grounded_frameworks.map((fw, fIdx) => (
                      <span
                        key={fIdx}
                        className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-750 text-teal-300 font-mono"
                      >
                        {fw}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actionable DIY Hack Cards */}
                {res && res.actionable_hacks?.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {res.actionable_hacks.map((hack, hIdx) => (
                      <div
                        key={hIdx}
                        className="p-2.5 rounded-xl bg-slate-900/90 border border-teal-500/30 text-teal-200"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold flex items-center gap-1.5 text-xs text-teal-300">
                            <Wrench className="w-3.5 h-3.5" />
                            {hack.title}
                          </span>
                          {hack.cost && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 font-mono">
                              {hack.cost}
                            </span>
                          )}
                        </div>
                        {hack.cadr && (
                          <div className="text-[10px] text-slate-300 mb-1">
                            Clean Air Delivery: <strong className="text-white">{hack.cadr}</strong>
                          </div>
                        )}
                        <p className="text-[11px] text-slate-300">{hack.steps || hack.instructions}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Non-Diagnostic Disclaimer */}
                {res && (
                  <div className="mt-2 text-[9px] text-slate-500 italic">
                    {res.safety_disclaimer}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl p-3 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              Synthesizing RAG environmental guidelines & deterministic formulas...
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2 bg-slate-850 border border-slate-750 rounded-2xl p-2 shadow-lg">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask SmogShield Coach (e.g. how to build Corsi-Rosenthal filter)..."
          className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium transition active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
