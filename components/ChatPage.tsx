import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ConversationProvider,
  useConversation,
} from '@elevenlabs/react';
import { Loader2, MessageCircle, Mic, Send, Square, X } from 'lucide-react';
import { INBOUND_AGENT_ID } from '../lib/elevenlabsAgent';

const WEB_FIRST_MESSAGE =
  "Hi! I'm Macy with Opek Junk Removal. I can help with quotes, bookings, or questions — talk or type.";

type ChatRole = 'agent' | 'user';

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}

function messageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function LiveChatModal({
  agentId,
  initialMode,
  onClose,
}: {
  agentId: string;
  initialMode: 'text' | 'voice' | null;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(Boolean(initialMode));
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const streamingIdRef = useRef<string | null>(null);
  const usedStreamingRef = useRef(false);

  const conversation = useConversation({
    onConnect: () => {
      setConnecting(false);
      setError(null);
      window.setTimeout(() => inputRef.current?.focus(), 50);
    },
    onDisconnect: () => {
      setConnecting(false);
      streamingIdRef.current = null;
      usedStreamingRef.current = false;
    },
    onError: (message) => {
      setConnecting(false);
      setError(typeof message === 'string' ? message : 'Chat connection failed. Please try again.');
    },
    onMessage: (payload) => {
      const source = (payload as { source?: string }).source;
      const message = (payload as { message?: string }).message;
      if (!message?.trim()) return;
      if (source === 'ai' && usedStreamingRef.current) return;

      if (source === 'user') {
        setMessages((prev) => {
          const recentUser = prev[prev.length - 1];
          if (recentUser?.role === 'user' && recentUser.text === message) return prev;
          return [...prev, { id: messageId(), role: 'user', text: message }];
        });
        return;
      }

      if (source === 'ai') {
        setMessages((prev) => [...prev, { id: messageId(), role: 'agent', text: message }]);
      }
    },
    onAgentChatResponsePart: (part) => {
      const eventType = (part as { type?: string; text?: string }).type;
      const text = (part as { text?: string }).text ?? '';

      if (eventType === 'start') {
        usedStreamingRef.current = true;
        const id = messageId();
        streamingIdRef.current = id;
        setMessages((prev) => [...prev, { id, role: 'agent', text: '' }]);
        return;
      }

      if (eventType === 'delta' && streamingIdRef.current) {
        const id = streamingIdRef.current;
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, text: `${m.text}${text}` } : m)),
        );
        return;
      }

      if (eventType === 'stop') {
        streamingIdRef.current = null;
      }
    },
  });

  const connected = conversation.status === 'connected';

  const startChat = (preferVoice = false) => {
    setError(null);
    setConnecting(true);
    setMessages([]);
    streamingIdRef.current = null;
    usedStreamingRef.current = false;

    try {
      conversation.startSession({
        agentId,
        connectionType: preferVoice ? 'webrtc' : 'websocket',
        overrides: {
          agent: {
            firstMessage: WEB_FIRST_MESSAGE,
          },
          conversation: {
            textOnly: !preferVoice,
          },
        },
        dynamicVariables: {
          channel: 'web_chat',
        },
      });
    } catch (err) {
      setConnecting(false);
      setError(err instanceof Error ? err.message : 'Could not start chat.');
    }
  };

  const startChatRef = useRef(startChat);
  startChatRef.current = startChat;

  useEffect(() => {
    if (!initialMode) return;
    const timer = window.setTimeout(() => {
      startChatRef.current(initialMode === 'voice');
    }, 250);
    return () => window.clearTimeout(timer);
  }, [initialMode]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, connected]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const endAndClose = () => {
    try {
      if (conversation.status !== 'disconnected') {
        conversation.endSession();
      }
    } catch {
      // ignore
    }
    onClose();
  };

  const sendDraft = () => {
    const text = draft.trim();
    if (!text || !connected) return;
    setDraft('');
    setMessages((prev) => [...prev, { id: messageId(), role: 'user', text }]);
    conversation.sendUserMessage(text);
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-stretch sm:items-center justify-center p-0 sm:p-6 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="live-chat-heading"
      data-opek-live-chat="true"
    >
      <style>{`
        [data-opek-live-chat] textarea.opek-chat-input {
          background-color: #16161c !important;
          color: #f4f4f5 !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          box-shadow: none !important;
        }
        [data-opek-live-chat] textarea.opek-chat-input::placeholder {
          color: #73737f !important;
          opacity: 1 !important;
        }
        [data-opek-live-chat] textarea.opek-chat-input:focus {
          background-color: #1a1a22 !important;
          border-color: #ff006e !important;
          box-shadow: 0 0 0 4px rgba(255, 0, 110, 0.18) !important;
        }
      `}</style>
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        aria-label="Close chat"
        onClick={endAndClose}
      />

      <div className="relative z-10 flex h-[100dvh] sm:h-[min(860px,92dvh)] w-full sm:max-w-3xl flex-col overflow-hidden bg-[#0c0c10] sm:rounded-3xl border-0 sm:border border-white/10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.85)] animate-scale-in">
        <div className="absolute inset-0 bg-dark-grid opacity-40 pointer-events-none" aria-hidden />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-brand/25 blur-[100px] pointer-events-none" aria-hidden />

        <header className="relative z-10 flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-white/10 bg-[#101014]/90 backdrop-blur">
          <div className="flex items-center gap-3 min-w-0">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand/20 text-brand">
              <span className="absolute inline-flex h-full w-full animate-ping-dot rounded-2xl bg-brand/25" aria-hidden />
              <MessageCircle size={20} className="relative" />
            </span>
            <div className="min-w-0">
              <h1
                id="live-chat-heading"
                className="font-sans text-base sm:text-lg font-bold text-white tracking-tight truncate"
              >
                Live chat with Macy
              </h1>
              <p className="text-[11px] sm:text-xs text-neutral-400 truncate">
                {connecting
                  ? 'Connecting…'
                  : connected
                    ? 'Online · quotes, bookings & questions'
                    : 'Opek Junk Removal assistant'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={endAndClose}
            className="shrink-0 h-10 w-10 rounded-full border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 flex items-center justify-center transition-colors"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </header>

        <div className="relative z-10 flex-1 min-h-0 flex flex-col">
          {!connected && !connecting ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
              <div className="mb-6 h-16 w-16 rounded-3xl bg-brand/15 border border-brand/25 flex items-center justify-center text-brand">
                <MessageCircle size={28} />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-white mb-3">How can we help?</h2>
              <p className="text-neutral-400 text-sm sm:text-base max-w-md mb-8 leading-relaxed">
                Get instant quotes, book junk removal or moving help, and ask questions — by text or
                voice.
              </p>
              <div className="w-full max-w-sm space-y-3">
                <button
                  type="button"
                  onClick={() => startChat(false)}
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 text-sm font-semibold bg-brand text-white hover:bg-brand-600 rounded-full transition-colors shadow-[0_0_28px_-8px_rgba(255,0,110,0.65)]"
                >
                  <MessageCircle size={16} /> Start text chat
                </button>
                <button
                  type="button"
                  onClick={() => startChat(true)}
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 text-sm font-semibold rounded-full border border-white/15 bg-white/[0.03] text-neutral-100 hover:bg-white/[0.08] transition-colors"
                >
                  <Mic size={16} /> Start voice chat
                </button>
              </div>
              {error && <p className="mt-4 text-brand text-xs font-bold">{error}</p>}
            </div>
          ) : (
            <>
              <div
                ref={listRef}
                className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-3.5"
              >
                {connecting && messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-neutral-400">
                    <Loader2 size={22} className="animate-spin text-brand" />
                    <p className="text-sm">Connecting to Macy…</p>
                  </div>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap ${
                        m.role === 'user'
                          ? 'bg-brand text-white rounded-br-md'
                          : 'bg-white/[0.07] text-neutral-100 rounded-bl-md border border-white/10'
                      }`}
                    >
                      {m.text || (m.role === 'agent' ? '…' : '')}
                    </div>
                  </div>
                ))}
              </div>

              <form
                className="shrink-0 flex items-end gap-2 p-3 sm:p-4 border-t border-white/10 bg-[#101014]"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendDraft();
                }}
              >
                <textarea
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendDraft();
                    }
                  }}
                  disabled={!connected}
                  rows={2}
                  placeholder={
                    connected
                      ? 'Ask about pricing, bookings, or anything else…'
                      : 'Connecting…'
                  }
                  className="opek-chat-input flex-1 resize-none rounded-2xl border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-brand disabled:opacity-50"
                  style={{
                    backgroundColor: '#16161c',
                    color: '#f4f4f5',
                    caretColor: '#ff006e',
                  }}
                />
                <button
                  type="submit"
                  disabled={!connected || !draft.trim()}
                  className="shrink-0 h-11 w-11 rounded-2xl bg-brand text-white flex items-center justify-center hover:bg-brand-600 disabled:opacity-40 transition-colors"
                  aria-label="Send message"
                >
                  <Send size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => conversation.endSession()}
                  disabled={!connected}
                  className="shrink-0 h-11 w-11 rounded-2xl border border-white/15 text-neutral-400 hover:text-white hover:bg-white/5 flex items-center justify-center transition-colors disabled:opacity-40"
                  aria-label="End chat"
                  title="End chat"
                >
                  <Square size={15} />
                </button>
              </form>
              {error && <p className="px-4 pb-3 text-brand text-xs font-bold">{error}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const modeParam = params.get('mode');
  const initialMode: 'text' | 'voice' =
    modeParam === 'voice' ? 'voice' : 'text';

  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/contact');
    }
  };

  return (
    <ConversationProvider>
      <LiveChatModal
        agentId={INBOUND_AGENT_ID}
        initialMode={initialMode}
        onClose={handleClose}
      />
    </ConversationProvider>
  );
};
