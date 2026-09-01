'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Brain,
  Target,
  BookOpen,
  Briefcase,
  HelpCircle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isDemo?: boolean;
}

const PROMPT_SUGGESTIONS = [
  {
    icon: Target,
    label: 'How to prepare for Backend Developer role?',
    prompt: 'What competencies should I prioritize learning over the next 3 months to land a Backend Engineer position?',
  },
  {
    icon: Brain,
    label: 'Analyze my engineering competency profile',
    prompt: 'Based on Python, SQL, and REST API skills, what are my biggest skill gaps and how do I fix them?',
  },
  {
    icon: BookOpen,
    label: 'Recommend learning resources for Docker',
    prompt: 'What are the best free or structured resources to learn Docker & Kubernetes for a beginner?',
  },
  {
    icon: Briefcase,
    label: 'Help me prepare for technical interviews',
    prompt: 'What are top technical interview questions asked for Backend Developer intern roles?',
  },
];

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am your **SkillSync AI Career Copilot** for **Vishnu Institute of Technology, Bhimavaram**. Ask me anything about your competency profile, target career goals, skill gap analysis, or campus placements.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/ai/copilot', { message: query, question: query });

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        isDemo: data.isDemo,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Sorry, I encountered an issue connecting to the AI service. Please make sure the backend is running.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (!line.trim()) return <div key={idx} className="h-2" />;

      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold text-[var(--text-primary)]">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <p key={idx} className="mb-1 leading-relaxed">
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0 border-b border-[var(--border-warm)] pb-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--primary-green)] mb-0.5">
            AI Assistant
          </div>
          <h1 className="text-h1 flex items-center gap-2 text-[var(--text-primary)]">
            <Zap className="w-5 h-5 text-[var(--accent-saffron)]" />
            AI Career Copilot
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Personalized advisor for competency growth, gap analysis & opportunity matching.
          </p>
        </div>

        <Button
          onClick={() =>
            setMessages([
              {
                id: 'welcome',
                role: 'assistant',
                content:
                  'Namaste! I am your **SkillSync AI Career Copilot**. Ask me anything about your competency profile, career goals, skill gap analysis, or Ayush institutional placements.',
                timestamp: new Date(),
              },
            ])
          }
          variant="outline"
          size="sm"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Chat
        </Button>
      </div>

      {/* Main Chat Box */}
      <div className="flex-1 surface-card flex flex-col min-h-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-[#FCFBF7] font-bold text-xs flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-[#173F35]' : 'bg-[#256B58]'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div className="group relative max-w-[85%] md:max-w-[75%]">
                  <div
                    className={`p-3.5 rounded-lg text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[var(--primary-dark)] text-[var(--text-inverse)]'
                        : 'bg-[var(--surface-paper)] text-[var(--text-primary)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    {renderFormattedText(msg.content)}
                  </div>

                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.content)}
                      className="absolute -right-7 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-[var(--primary-green)]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[var(--primary-green)] text-[var(--text-inverse)] flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="px-3.5 py-2 rounded-lg text-xs bg-[var(--surface-paper)] border border-[var(--border-subtle)] text-[var(--text-secondary)] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-saffron)] animate-pulse" />
                Analyzing competency taxonomy...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 py-3 border-t border-[var(--border-subtle)] bg-[var(--surface-paper)]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-2 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-[var(--primary-dark)]" /> Suggested Institutional Prompts
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {PROMPT_SUGGESTIONS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleSend(item.prompt)}
                    className="flex items-center gap-2 p-2 rounded-md bg-[var(--surface-bg)] border border-[var(--border-warm)] text-left text-xs text-[var(--text-primary)] hover:border-[var(--primary-dark)] transition-all"
                  >
                    <Icon className="w-3.5 h-3.5 text-[var(--primary-dark)] flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 border-t border-[var(--border-warm)] bg-[var(--surface-paper)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot about skills, career goals, gap analysis..."
              className="flex-1 px-3.5 py-2 rounded-md text-xs bg-[var(--surface-bg)] border border-[var(--border-warm)] text-[var(--text-primary)] outline-none focus:border-[var(--primary-dark)]"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              variant="primary"
              size="sm"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
