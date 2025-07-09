
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageCircle, User, Bot, Paperclip, Smile } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ChatSection = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Support',
      message: 'Hello! How can I help you with your job search today? 😊',
      timestamp: '10:30 AM',
      isUser: false,
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: user?.name || 'You',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: true,
        type: 'text'
      };
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate support response
      setIsTyping(true);
      setTimeout(() => {
        const supportResponse = {
          id: messages.length + 2,
          sender: 'Support',
          message: 'Thank you for your message! I\'ll help you with that right away. 👍',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUser: false,
          type: 'text'
        };
        setMessages(prev => [...prev, supportResponse]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageTime = (timestamp: string) => {
    return timestamp;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col shadow-lg border-2">
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Support Chat</h3>
                <p className="text-sm text-gray-600">We're here to help you!</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">Online</span>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex flex-col flex-1 p-0 overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${msg.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    {msg.isUser ? (
                      <>
                        <AvatarImage src={user?.profilePhoto} alt={user?.name} />
                        <AvatarFallback className="bg-blue-500 text-white text-sm">
                          {user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </>
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-sm">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className={`rounded-2xl px-4 py-2 shadow-sm ${
                    msg.isUser 
                      ? 'bg-blue-500 text-white rounded-br-md' 
                      : 'bg-white text-gray-800 rounded-bl-md border'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {getMessageTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2 max-w-xs">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-sm">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t bg-white p-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <Paperclip className="w-4 h-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-10 rounded-full border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 h-8 w-8 p-0"
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                onClick={handleSendMessage} 
                size="sm"
                className="rounded-full bg-blue-500 hover:bg-blue-600 text-white h-10 w-10 p-0"
                disabled={!newMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatSection;
