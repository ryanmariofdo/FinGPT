import { api } from "@/lib/api";
import { useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);
    setError(null);
    try {
      const { reply } = await api.post("/chat", { messages: nextMessages });
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    input,
    setInput,
    sending,
    error,
    sendMessage,
    clearChat,
  };
}
