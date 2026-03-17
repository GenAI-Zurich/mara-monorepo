import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import type { ChatMessage, ConstraintSuggestion } from "@/types/product";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChatWindowProps {
  messages: ChatMessage[];
  isThinking: boolean;
  onSendMessage: (text: string) => void;
  onConstraintAction: (suggestion: ConstraintSuggestion, accepted: boolean) => void;
}

const ChatWindow = ({ messages, isThinking, onSendMessage, onConstraintAction }: ChatWindowProps) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isThinking) return;
    setInput("");
    onSendMessage(text);
  };

  return (
    <div className="fixed bottom-5 right-[18px] z-[190] w-[380px] bg-card border border-border rounded-[18px] shadow-[var(--shadow-deep)] flex flex-col overflow-hidden max-[820px]:w-[calc(100vw-24px)] max-[820px]:right-3 max-[820px]:left-3">
      {/* Header */}
      <div className="px-3.5 pt-2.5 pb-2 flex items-center gap-2 border-b border-border">
        <div
          className={`w-[7px] h-[7px] rounded-full bg-gold shadow-[0_0_6px_hsl(var(--gold))] ${isThinking ? 'animate-[dotPulse_0.8s_ease-in-out_infinite]' : ''}`}
        />
        <span className="text-xs font-medium tracking-[0.06em] uppercase text-muted-foreground">
          {t('chat_header')}
        </span>
      </div>

      {/* Messages */}
      <div className="h-[234px] overflow-y-auto px-3.5 py-3 flex flex-col gap-[7px]">
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div
              className={`max-w-[85%] text-[12.5px] leading-[1.5] animate-[msgIn_0.25s_ease-out] ${
                msg.role === 'user'
                  ? 'self-end bg-gold text-primary-foreground rounded-[12px_12px_3px_12px] px-[11px] py-[7px]'
                  : 'self-start bg-secondary text-foreground rounded-[12px_12px_12px_3px] px-[11px] py-[7px]'
              }`}
              dangerouslySetInnerHTML={{
                __html: msg.role === 'assistant'
                  ? msg.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold font-medium">$1</strong>')
                  : msg.content
              }}
            />
            {/* Constraint suggestion chips */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="self-start flex flex-wrap gap-1.5 ml-1 mt-1">
                {msg.suggestions.map((s, j) => (
                  <div key={j} className="flex items-center gap-1 text-[11px] bg-secondary/60 rounded-lg px-2 py-1 border border-border">
                    <span className="text-muted-foreground">{s.label}:</span>
                    <span className="font-medium text-foreground">{String(s.value)}</span>
                    <button
                      onClick={() => onConstraintAction(s, true)}
                      className="ml-1 px-1.5 py-0.5 rounded bg-gold text-primary-foreground text-[10px] font-medium hover:opacity-80 transition-opacity"
                    >
                      {t('yes')}
                    </button>
                    <button
                      onClick={() => onConstraintAction(s, false)}
                      className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px] font-medium hover:opacity-80 transition-opacity"
                    >
                      {t('skip')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="self-start bg-secondary text-foreground rounded-[12px_12px_12px_3px] px-[11px] py-[7px] animate-[msgIn_0.25s_ease-out]">
            <div className="flex gap-1 py-1 items-center">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-[5px] h-[5px] rounded-full bg-gold inline-block animate-[dotBounce_1.2s_ease-in-out_infinite]"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Gold line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-30" />

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={t('chat_placeholder')}
          className="flex-1 bg-transparent border-none outline-none font-body text-[12.5px] text-foreground placeholder:text-muted-foreground"
          autoComplete="off"
        />
        <button
          onClick={handleSend}
          className={`w-[30px] h-[30px] rounded-full bg-gold flex items-center justify-center flex-shrink-0 cursor-pointer transition-transform hover:scale-110 hover:bg-gold-light ${isThinking ? 'opacity-50' : ''}`}
        >
          <Send size={14} className="text-primary-foreground" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
