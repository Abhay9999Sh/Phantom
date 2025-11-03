// app/page.tsx
'use client'

import { useState, FormEvent } from 'react'
import { SparklesIcon, UserIcon, ArrowRightIcon, BookOpenIcon, MapPinIcon, ChatBubbleBottomCenterTextIcon, BuildingLibraryIcon } from '@heroicons/react/24/solid'

// Define the message type
type Message = {
  sender: 'user' | 'bot'
  text: string
}

export default function StudentChat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Welcome to TaskStitch Co-pilot. How can I help you today?" }
  ])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    // Add user message
    const userMessage: Message = { sender: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    
    // Clear input
    setInput('')
    
    // TODO: Add bot thinking indicator
    // TODO: Call your /api/agent endpoint with the 'input'
    
    // Fake bot response for demo
    setTimeout(() => {
      const botMessage: Message = { sender: 'bot', text: `I am processing your request for: "${input}"` }
      setMessages(prev => [...prev, botMessage])
    }, 1000)
  }

  const ExamplePrompt = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
    <button className="flex items-center p-3 bg-neutral-800 rounded-lg text-left hover:bg-neutral-700 transition-colors duration-200">
      {icon}
      <span className="ml-3 text-sm text-neutral-300">{text}</span>
    </button>
  )

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-3xl bg-neutral-900 rounded-xl shadow-2xl flex flex-col" style={{height: '90vh'}}>
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-800">
          <h1 className="text-xl font-semibold text-white flex items-center">
            <SparklesIcon className="w-6 h-6 text-purple-500 mr-3" />
            TaskStitch Co-pilot
          </h1>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Example Prompts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ExamplePrompt icon={<BookOpenIcon className="w-5 h-5 text-purple-400" />} text="Book a lab for my team." />
            <ExamplePrompt icon={<MapPinIcon className="w-5 h-5 text-purple-400" />} text="Find Professor Smith's office hours." />
            <ExamplePrompt icon={<BuildingLibraryIcon className="w-5 h-5 text-purple-400" />} text="What are the library's opening times?" />
            <ExamplePrompt icon={<ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-purple-400" />} text="Summarize the latest campus circular." />
          </div>

          {/* Chat Messages */}
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mr-3 flex-shrink-0">
                    <SparklesIcon className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-md p-4 rounded-xl ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-neutral-800 text-neutral-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-6 border-t border-neutral-800">
          <form onSubmit={handleSubmit} className="flex items-center space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about campus..."
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <ArrowRightIcon className="w-6 h-6" />
            </button>
          </form>
        </div>
        
      </div>
    </div>
  )
}