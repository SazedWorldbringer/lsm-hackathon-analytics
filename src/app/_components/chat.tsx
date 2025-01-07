'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Button } from '~/components/ui/button'
import { api } from '~/trpc/react'

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Hello! I\'m a RAG-powered AI assistant. How can I help you?' }
  ])
  const [input, setInput] = useState('')

  // const mutation = api.chat.sendMessage.useMutation({
  //   onSuccess: (data) => {
  //     setMessages((prev) => [
  //       ...prev,
  //       { role: "assistant", content: data.message },
  //     ]);
  //   },
  // });
  //
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!input.trim() || mutation.isPending) return;
  //
  //   const userMessage = input;
  //   setInput("");
  //   setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
  //
  //   await mutation.mutateAsync({ message: userMessage });
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      setMessages([...messages, { role: 'user', content: input }])
      // simulate response
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'system', content: 'This is a simulated response from the RAG model. In a real application, this would be generated based on the retrieved information and the user\'s query.' }])
      }, 1000)
      setInput('')
    }
  }

  return (
    <section id="chat" className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-black">RAG Chat Interface</h2>
        <Card className="w-full max-w-2xl mx-auto bg-white border-gray-200 rounded-none shadow-md">
          <CardHeader>
            <CardTitle className="text-black">Chat with RAG AI</CardTitle>
            <CardDescription className="text-gray-600">Ask questions about your social media data</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] mb-4 p-4 border border-gray-200 rounded-none">
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block p-2 ${message.role === 'user' ? 'bg-gray-100 text-black' : 'bg-gray-200 text-black'}`}>
                    {message.content}
                  </span>
                </div>
              ))}
            </ScrollArea>
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow bg-white border-gray-300 text-black placeholder-gray-400 rounded-none"
              />
              <Button type="submit" variant="outline" className="rounded-none border-black text-black hover:bg-black hover:text-white">Send</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default Chat
