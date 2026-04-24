import { useState, useRef, useEffect } from 'react';
import './index.css';

// A beautifully styled Chat Interface
export default function App() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI Customer Assistant. How can I help you regarding our return policies or your specific orders?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'human', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: "demo-user-1",
          message: userMessage
        })
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting to my central network. Make sure the FastAPI server is running!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerTitle}>
          <div style={styles.statusDot}></div>
          <h2>Nexus AI Support</h2>
        </div>
        <p style={styles.subtitle}>Order Lookup • RAG Policies • Ticket Management</p>
      </header>

      <div style={styles.chatArea}>
        {messages.map((msg, idx) => (
          <div key={idx} style={msg.role === 'ai' ? styles.messageWrapperAI : styles.messageWrapperHuman}>
            {msg.role === 'ai' && <div style={styles.avatarAI}>AI</div>}
            <div style={msg.role === 'ai' ? styles.bubbleAI : styles.bubbleHuman}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={styles.messageWrapperAI}>
            <div style={styles.avatarAI}>AI</div>
            <div style={{ ...styles.bubbleAI, ...styles.typingIndicator }}>
              <span className="dot" style={{ animationDelay: '0s' }}></span>
              <span className="dot" style={{ animationDelay: '0.2s' }}></span>
              <span className="dot" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputArea}>
        <textarea
          style={styles.input}
          placeholder="Ask about our policies or check your order (e.g. ORD123)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows="1"
        />
        <button style={styles.sendButton} onClick={handleSend} disabled={isTyping || !input.trim()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
}

// Inline styles designed for a highly premium, dark aesthetic
const styles = {
  container: {
    width: '100%',
    maxWidth: '900px',
    height: '85vh',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.05)',
    border: '1px solid var(--border-light)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    animation: 'pulse-glow 4s infinite, slideUp 0.6s ease-out'
  },
  header: {
    padding: '1.5rem 2rem',
    borderBottom: '1px solid var(--border-light)',
    backgroundColor: 'var(--bg-tertiary)',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '4px'
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'var(--success)',
    boxShadow: '0 0 8px var(--success)'
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    opacity: 0.8
  },
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  messageWrapperAI: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-end',
    animation: 'slideUp 0.3s ease-out'
  },
  messageWrapperHuman: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    alignItems: 'flex-end',
    animation: 'slideUp 0.3s ease-out'
  },
  avatarAI: {
    width: '36px',
    height: '36px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.4)'
  },
  bubbleAI: {
    maxWidth: '75%',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '1rem 1.2rem',
    borderRadius: '16px 16px 16px 4px',
    border: '1px solid rgba(255,255,255,0.05)',
    color: 'var(--text-primary)',
    lineHeight: '1.5',
    fontSize: '0.95rem'
  },
  bubbleHuman: {
    maxWidth: '75%',
    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
    padding: '1rem 1.2rem',
    borderRadius: '16px 16px 4px 16px',
    color: '#ffffff',
    lineHeight: '1.5',
    fontSize: '0.95rem',
    boxShadow: '0 8px 20px var(--accent-glow)'
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    padding: '1rem'
  },
  inputArea: {
    padding: '1.5rem 2rem',
    borderTop: '1px solid var(--border-light)',
    backgroundColor: 'var(--bg-tertiary)',
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-end'
  },
  input: {
    flex: 1,
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-light)',
    borderRadius: '16px',
    padding: '1.2rem 1.5rem',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    resize: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  sendButton: {
    width: '54px',
    height: '54px',
    borderRadius: '16px',
    border: 'none',
    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  }
};

// Add raw CSS to document for dynamic pseudo elements and classes
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .dot {
      width: 6px;
      height: 6px;
      background-color: var(--text-secondary);
      border-radius: 50%;
      animation: typingDots 1.4s infinite ease-in-out both;
    }
    textarea:focus {
      border-color: var(--accent-secondary) !important;
      box-shadow: 0 0 0 2px var(--accent-glow) !important;
    }
    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 15px var(--accent-glow);
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--bg-primary) !important;
      color: var(--text-secondary);
      border: 1px solid var(--border-light);
    }
  `;
  document.head.appendChild(style);
}
