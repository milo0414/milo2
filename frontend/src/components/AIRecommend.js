import React, { useState, useRef, useEffect } from 'react';

function AIRecommend({ menu, addToCart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: '您好！我是您的智能点餐顾问 🍽️\n\n请问今天是什么用餐场景呢？比如：约会、家庭聚餐、朋友聚会、还是一人食？'
      }]);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          messages: newMessages,
          menu: menu
        })
      });

      if (!response.ok) {
        throw new Error('AI 服务调用失败');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addRecommendedItem = (item) => {
    addToCart(item);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `已将「${item.name}」添加到购物车 🛒`
    }]);
  };

  const resetChat = () => {
    setMessages([]);
    setInput('');
    setError(null);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        className="btn btn-primary ai-float-btn"
        onClick={() => setIsOpen(true)}
        title="AI 智能推荐"
      >
        🤖 AI 推荐
      </button>
    );
  }

  return (
    <div className="ai-chat-panel">
      <div className="ai-chat-header">
        <span>🤖 AI 智能推荐</span>
        <div className="ai-chat-header-actions">
          <button type="button" className="btn-text" onClick={resetChat} title="重新开始">🔄</button>
          <button type="button" className="btn-text" onClick={() => setIsOpen(false)}>✕</button>
        </div>
      </div>

      <div className="ai-chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content loading">思考中...</div>
          </div>
        )}
        {error && (
          <div className="message error">
            <div className="message-content">{error}</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-chat-input">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入您的用餐偏好..."
          rows={2}
          disabled={isLoading}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
        >
          发送
        </button>
      </div>
    </div>
  );
}

export default AIRecommend;
