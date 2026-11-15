import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Zap,
  BookOpen,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCheck,
} from 'lucide-react';
import {
  AthleteProfileState,
  CalculatedHourlyTargets,
  PhaseStrategyPlan,
  WorkoutInputVector,
} from '../../types/pyrofit';
import {
  ChatMessage,
  generateRaceDayBriefing,
  askSportsScientist,
} from '../../lib/aiCopilot';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  input: WorkoutInputVector;
  targets: CalculatedHourlyTargets;
  phasePlan: PhaseStrategyPlan;
  profile: AthleteProfileState;
}

const QUICK_QUESTIONS = [
  'Why do I need electrolytes before I feel thirsty?',
  'How does heat affect carbohydrate oxidation rate?',
  'What is the difference between hydrogel and standard gel?',
  'When should I switch from glucose to glucose+fructose combo?',
  'What causes the "bonk" and how do I avoid it?',
  'How do I train my gut for 90g carbs per hour?',
];

function MarkdownText({ content }: { content: string }) {
  // Simple markdown-to-JSX renderer for bold, bullets, numbered lists
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 text-xs leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Headings
        if (trimmed.startsWith('### ')) {
          return (
            <div key={idx} className="text-strava font-space font-bold text-[11px] uppercase tracking-wider pt-1">
              {trimmed.slice(4)}
            </div>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <div key={idx} className="text-fg font-space font-bold text-[12px] pt-1">
              {trimmed.slice(3)}
            </div>
          );
        }

        // Bullet points
        if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
          const text = trimmed.slice(2);
          return (
            <div key={idx} className="flex gap-2 ml-2">
              <span className="text-strava mt-0.5 flex-shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: boldify(text) }} />
            </div>
          );
        }

        // Numbered
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex gap-2 ml-2">
              <span className="text-strava font-bold flex-shrink-0 min-w-[16px]">{numMatch[1]}.</span>
              <span dangerouslySetInnerHTML={{ __html: boldify(numMatch[2]) }} />
            </div>
          );
        }

        return (
          <p key={idx} dangerouslySetInnerHTML={{ __html: boldify(trimmed) }} />
        );
      })}
    </div>
  );
}

function boldify(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-fg font-bold">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-surface px-1 rounded text-strava font-mono text-[10px]">$1</code>');
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  input,
  targets,
  phasePlan,
  profile,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'briefing'>('chat');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [briefingContent, setBriefingContent] = useState<string | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [quickQOpen, setQuickQOpen] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const generateBriefing = async () => {
    setBriefingLoading(true);
    setBriefingContent(null);
    setActiveTab('briefing');
    try {
      const result = await generateRaceDayBriefing(input, targets, phasePlan, profile);
      setBriefingContent(result);
    } catch (err) {
      setBriefingContent('⚠️ Could not generate briefing. Check that FreeLLMAPI is running on port 3001.');
    } finally {
      setBriefingLoading(false);
    }
  };

  const sendMessage = async (question?: string) => {
    const text = question || inputText.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setChatHistory((h) => [...h, userMsg]);
    setInputText('');
    setIsLoading(true);
    setQuickQOpen(false);

    try {
      const reply = await askSportsScientist(text, chatHistory, {
        input,
        targets,
        profile,
      });
      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      };
      setChatHistory((h) => [...h, assistantMsg]);
    } catch (err) {
      const errMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: '⚠️ AI Sports Scientist is temporarily offline. Please ensure FreeLLMAPI is running on port 3001.',
        timestamp: new Date().toISOString(),
      };
      setChatHistory((h) => [...h, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 pointer-events-auto"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-bg border-l border-border flex flex-col pointer-events-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-carbon flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-strava/20 border border-strava/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-strava" />
            </div>
            <div>
              <div className="text-fg text-xs font-space font-bold uppercase tracking-wider">
                AI Sports Scientist
              </div>
              <div className="text-faint text-[10px]">
                Multi-provider AI · Context-aware
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-fg transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Context Bar */}
        <div className="px-3 py-2 bg-surface border-b border-border flex gap-2 flex-wrap flex-shrink-0">
          <span className="text-[10px] font-space px-2 py-0.5 bg-carbon border border-border text-muted">
            {input.workout_duration_mins}min · {input.intensity_level} · {input.temperature_celsius}°C
          </span>
          <span className="text-[10px] font-space px-2 py-0.5 bg-strava/10 border border-strava/30 text-strava">
            {targets.carbs_hourly_g}g carbs/hr · {targets.sodium_hourly_mg}mg Na/hr
          </span>
          {profile.carb_multiplier !== 1 && (
            <span className="text-[10px] font-space px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400">
              Adaptive ×{profile.carb_multiplier.toFixed(2)}
            </span>
          )}
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-border flex-shrink-0">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2.5 text-[11px] font-space font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'chat'
                ? 'text-strava border-b-2 border-strava'
                : 'text-muted hover:text-fg'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Copilot Chat
          </button>
          <button
            onClick={() => setActiveTab('briefing')}
            className={`flex-1 py-2.5 text-[11px] font-space font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'briefing'
                ? 'text-strava border-b-2 border-strava'
                : 'text-muted hover:text-fg'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Race Briefing
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {/* ─── CHAT TAB ─── */}
          {activeTab === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
                {/* Welcome */}
                {chatHistory.length === 0 && (
                  <div className="p-3 bg-surface border border-border">
                    <div className="flex items-start gap-2 mb-2">
                      <Bot className="w-4 h-4 text-strava flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-fg font-space font-bold">
                        AI Sports Scientist Online
                      </div>
                    </div>
                    <p className="text-[11px] text-muted ml-6">
                      I'm calibrated to your session: <strong>{input.workout_duration_mins}min</strong> at <strong>{input.intensity_level}</strong> in <strong>{input.temperature_celsius}°C</strong>.
                      Ask me anything about fueling strategy, gut training, electrolyte kinetics, or race execution.
                    </p>
                  </div>
                )}

                {/* Quick Questions Accordion */}
                {chatHistory.length === 0 && (
                  <div className="border border-border">
                    <button
                      onClick={() => setQuickQOpen(!quickQOpen)}
                      className="w-full px-3 py-2 flex items-center justify-between text-[11px] font-space font-bold uppercase text-muted hover:text-fg bg-surface transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-strava" />
                        Quick Questions
                      </span>
                      {quickQOpen ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {quickQOpen && (
                      <div className="p-2 space-y-1">
                        {QUICK_QUESTIONS.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => sendMessage(q)}
                            className="w-full text-left text-[11px] text-muted hover:text-fg px-2 py-1.5 hover:bg-surface border border-transparent hover:border-border transition-all"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Messages */}
                {chatHistory.map((msg) => (
                  <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-5 h-5 bg-strava/20 border border-strava/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-3 h-3 text-strava" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] p-2.5 relative group ${
                        msg.role === 'user'
                          ? 'bg-strava text-on-brand text-xs'
                          : 'bg-surface border border-border text-fg'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <>
                          <MarkdownText content={msg.content} />
                          <button
                            onClick={() => copyToClipboard(msg.content, msg.id)}
                            className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-faint hover:text-muted"
                          >
                            {copiedId === msg.id ? (
                              <CheckCheck className="w-3 h-3 text-strava" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </>
                      ) : (
                        <span className="text-xs">{msg.content}</span>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-5 h-5 bg-fg/10 border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-3 h-3 text-fg" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex gap-2 items-start">
                    <div className="w-5 h-5 bg-strava/20 border border-strava/40 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3 h-3 text-strava" />
                    </div>
                    <div className="bg-surface border border-border p-2.5 flex items-center gap-2">
                      <Loader2 className="w-3 h-3 text-strava animate-spin" />
                      <span className="text-[11px] text-muted font-space">Analyzing sports science data...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Bar */}
              <div className="p-3 border-t border-border bg-surface flex-shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask about fueling, electrolytes, gut training..."
                    className="flex-1 bg-bg border border-border px-3 py-2 text-xs text-fg placeholder:text-faint focus:outline-none focus:border-strava/60 font-space"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!inputText.trim() || isLoading}
                    className="px-3 py-2 bg-strava text-on-brand hover:bg-strava/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ─── RACE BRIEFING TAB ─── */}
          {activeTab === 'briefing' && (
            <div className="flex-1 overflow-y-auto p-4 min-h-0 space-y-4">
              <button
                onClick={generateBriefing}
                disabled={briefingLoading}
                className="w-full py-3 bg-strava text-on-brand text-xs font-space font-bold uppercase tracking-wider hover:bg-strava/90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {briefingLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating AI Race Briefing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {briefingContent ? 'Regenerate Race Briefing' : 'Generate AI Race-Day Briefing'}
                  </>
                )}
              </button>

              {!briefingContent && !briefingLoading && (
                <div className="p-4 bg-surface border border-border text-center">
                  <Sparkles className="w-8 h-8 text-strava/40 mx-auto mb-2" />
                  <p className="text-xs text-muted font-space">
                    Click above to generate a personalized race-day fueling briefing powered by AI Sports Science, tailored to your exact workout parameters and adaptive profile.
                  </p>
                </div>
              )}

              {briefingContent && (
                <div className="bg-surface border border-border p-4 relative group">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                    <div className="text-strava font-space font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5" />
                      AI Race-Day Briefing
                    </div>
                    <button
                      onClick={() => copyToClipboard(briefingContent, 'briefing')}
                      className="text-faint hover:text-muted transition-colors"
                    >
                      {copiedId === 'briefing' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-strava" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <MarkdownText content={briefingContent} />
                </div>
              )}

              {/* Session summary always visible */}
              <div className="bg-carbon border border-border p-3 space-y-2">
                <div className="text-[10px] font-space uppercase tracking-wider text-muted font-bold">Session Parameters</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-faint">Duration</span>
                    <div className="text-fg font-bold">{input.workout_duration_mins} min</div>
                  </div>
                  <div>
                    <span className="text-faint">Intensity</span>
                    <div className="text-strava font-bold">{input.intensity_level}</div>
                  </div>
                  <div>
                    <span className="text-faint">Temperature</span>
                    <div className="text-fg font-bold">{input.temperature_celsius}°C (E={targets.environmental_factor_E})</div>
                  </div>
                  <div>
                    <span className="text-faint">Carbs Target</span>
                    <div className="text-fg font-bold">{targets.carbs_hourly_g}g/hr</div>
                  </div>
                  <div>
                    <span className="text-faint">Sodium Target</span>
                    <div className="text-amber-400 font-bold">{targets.sodium_hourly_mg}mg/hr</div>
                  </div>
                  <div>
                    <span className="text-faint">Fluids Target</span>
                    <div className="text-sky-400 font-bold">{targets.fluids_hourly_ml}ml/hr</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
