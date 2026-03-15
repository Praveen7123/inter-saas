"use client"

import { IconPhone, IconPhoneOff, IconMicrophone, IconMicrophoneOff, IconSend } from "@tabler/icons-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

import { useAuth } from "@/components/providers/auth-provider";
import { sessionService } from "@/services/sessionService";
import { toast } from "sonner";

export function CallSimulator() {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello, this is Sarah from Acme Corp. How can I help you?" }
  ])
  const [input, setInput] = useState("")

  const startCall = async () => {
    if (!user) {
      toast.error("Please log in to start a call");
      return;
    }
    try {
      const id = await sessionService.createSession(user.uid, 'call');
      setSessionId(id);
      setIsActive(true);
      toast.success("Call connected");
    } catch (err: any) {
      toast.error(`Connection failed: ${err.message}`);
    }
  };

  const endCall = async () => {
    if (!sessionId) return;
    try {
      await sessionService.completeSession(sessionId);
      setIsActive(false);
      setSessionId(null);
      toast.success("Call ended and saved");
    } catch (err: any) {
      toast.error("Failed to save session");
    }
  };

  const handleSend = () => {
    if (!input.trim() || !isActive) return;
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages)
    setInput("")
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'ai', text: "That sounds interesting, but we already have a solution for that." }])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-xl bg-card overflow-hidden shadow-xs">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-primary/5">
        <div className="flex items-center gap-3">
          <div className={`size-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-muted'}`} />
          <div>
            <h3 className="font-semibold text-sm">Prospect: Sarah Miller</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">CTO — TechStream Solutions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">Session: Active</Badge>
          {!isActive ? (
            <Button size="sm" onClick={startCall} className="gap-2 bg-green-600 hover:bg-green-700 rounded-full">
              <IconPhone className="size-4" /> Start Call
            </Button>
          ) : (
            <Button size="sm" onClick={endCall} variant="destructive" className="gap-2 rounded-full">
              <IconPhoneOff className="size-4" /> End Call
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                m.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-none' 
                  : 'bg-muted rounded-tl-none border'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="shrink-0 rounded-full">
            <IconMicrophone className="size-4" />
          </Button>
          <Input 
            placeholder="Type your response..." 
            className="flex-1 rounded-full px-4 border-transparent bg-background shadow-xs focus-visible:ring-primary"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={!isActive}
          />
          <Button size="icon" onClick={handleSend} disabled={!isActive} className="shrink-0 rounded-full">
            <IconSend className="size-4 text-primary-foreground" />
          </Button>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-2 italic">
          Tip: Try to ask an open-ended discovery question.
        </p>
      </div>
    </div>
  )
}
