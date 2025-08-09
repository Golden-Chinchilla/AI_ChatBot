import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import './App.css'

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是AI助手，有什么可以帮助你的吗？',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 模拟AI回复
  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // 简单的模拟AI回复逻辑
    const responses = [
      `我理解你提到的"${userMessage}"，让我为你分析一下...`,
      `关于"${userMessage}"这个问题，我的建议是...`,
      `很有趣的问题！关于"${userMessage}"，我认为...`,
      `谢谢你的问题。对于"${userMessage}"，我可以这样解释...`,
      `这是一个很好的观点。关于"${userMessage}"，我想补充说...`
    ];

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await simulateAIResponse(inputMessage.trim());

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，我现在无法回复。请稍后再试。',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="w-10 h-10 text-blue-600" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">AI助手</h1>
            <p className="text-sm text-gray-500">在线 - 随时为您服务</p>
          </div>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} items-start space-x-2`}
          >
            {message.sender === 'ai' && (
              <div className="flex-shrink-0">
                <Bot className="w-8 h-8 text-blue-600 bg-blue-100 rounded-full p-1.5" />
              </div>
            )}

            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${message.sender === 'user'
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-white text-gray-800 shadow-sm border border-gray-200 rounded-bl-md'
              }`}>
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>

            {message.sender === 'user' && (
              <div className="flex-shrink-0">
                <User className="w-8 h-8 text-gray-600 bg-gray-200 rounded-full p-1.5" />
              </div>
            )}
          </div>
        ))}

        {/* 加载状态 */}
        {isLoading && (
          <div className="flex justify-start items-start space-x-2">
            <div className="flex-shrink-0">
              <Bot className="w-8 h-8 text-blue-600 bg-blue-100 rounded-full p-1.5" />
            </div>
            <div className="bg-white text-gray-800 shadow-sm border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-gray-500">AI正在思考...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的问题..."
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-400 text-center">
          按 Enter 发送消息，Shift + Enter 换行
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;