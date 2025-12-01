"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from "framer-motion"
// Remove static imports
// import * as webllm from "@mlc-ai/web-llm"
// import { modelVersion, modelLibURLPrefix } from "@mlc-ai/web-llm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { lukesFont } from "../fonts"
import { ModernAppSidebar } from "@/components/modern-app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

const MODEL_HASH_MAP = {
  'llama': "Llama-3-8B-Instruct-q4f32_1-MLC",
  'deepseekr1': "DeepSeek-R1-Distill-Llama-8B-q4f16_1-MLC",
  'leetcode': "Llama-3.2-3B-Instruct-q4f16_1-MLC"
}

interface Message {
  content: string;
  role: "system" | "user" | "assistant";
}

interface InitProgressCallback {
  text: string;
  progress: number;
}

interface ModelUsage {
  prompt_tokens: number;
  completion_tokens: number;
  extra: {
    prefill_tokens_per_s: number;
    decode_tokens_per_s: number;
  };
}

export default function Page() {
  const [selectedModel, setSelectedModel] = useState<string>("Llama-3-8B-Instruct-q4f32_1-MLC")
  const [messages, setMessages] = useState<Message[]>([
    { content: "You are a helpful AI agent helping users.", role: "system" }
  ]);
  const [downloadStatus, setDownloadStatus] = useState<string>("");
  const [chatStats, setChatStats] = useState<string>("");
  const [isModelDownloaded, setIsModelDownloaded] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [appConfig, setAppConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const userInputRef = useRef<HTMLTextAreaElement>(null);
  const engineRef = useRef<any>(null);
  // Add a ref for the webllm module
  const webllmRef = useRef<any>(null);

  useEffect(() => {
    // Import webllm only in client-side code
    const initializeWebLLM = async () => {
      try {
        setIsLoading(true);
        // Dynamically import webllm
        const webllmModule = await import("@mlc-ai/web-llm");
        webllmRef.current = webllmModule;
        
        // Initialize the engine with the imported module
        engineRef.current = new webllmModule.MLCEngine();
        
        // Now we can safely use webllm values
        const { modelVersion, modelLibURLPrefix } = webllmModule;
        
        // Set up app config after importing webllm
        setAppConfig({
          model_list: [
            {
              model: "https://huggingface.co/mlc-ai/Llama-3-8B-Instruct-q4f32_1-MLC",
              model_id: "Llama-3-8B-Instruct-q4f32_1-MLC",
              model_lib: `${modelLibURLPrefix}${modelVersion}/Llama-3-8B-Instruct-q4f32_1-ctx4k_cs1k-webgpu.wasm`,
              model_name: "Llama-3.8B-Instruct",
            },
            {
              model: "https://huggingface.co/lbrevoort/llama-3.2-3b-it-Leetcode-Chatbot",
              model_id: "Llama-3.2-3B-Instruct-q4f16_1-MLC",
              model_lib: `${modelLibURLPrefix}${modelVersion}/Llama-3.2-3B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm`,
              model_name: "Llama-3.8B-Leetcode",
              vram_required_MB: 2263.69,
              low_resource_required: true,
              overrides: {
                context_window_size: 4096,
              },
            },
            {
              model: "https://huggingface.co/mlc-ai/DeepSeek-R1-Distill-Llama-8B-q4f16_1-MLC",
              model_id: "DeepSeek-R1-Distill-Llama-8B-q4f16_1-MLC",
              model_lib: `${modelLibURLPrefix}${modelVersion}/Llama-3_1-8B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm`,
              model_name: "DeepSeek-R1-Distill-Llama-8B",
              vram_required_MB: 5001.0,
              low_resource_required: false,
              overrides: {
                context_window_size: 4096,
              },
            },
          ]
        });
        
        // Get hash from URL and set selected model
        const hash = window.location.hash.slice(1);
        if (hash && hash in MODEL_HASH_MAP && MODEL_HASH_MAP[hash as keyof typeof MODEL_HASH_MAP]) {
          setSelectedModel(MODEL_HASH_MAP[hash as keyof typeof MODEL_HASH_MAP]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize web-llm:", error);
        setDownloadStatus("Failed to load web-llm module");
        setIsLoading(false);
      }
    };
    
    initializeWebLLM();
  }, []);

  const updateEngineInitProgressCallback = (report: InitProgressCallback) => {
    setDownloadStatus(report.text);
    setDownloadProgress(report.progress * 100);
  };

  const initializeWebLLMEngine = async () => {
    if (!engineRef.current) {
      setDownloadStatus("Engine not initialized");
      return;
    }

    engineRef.current.setInitProgressCallback(updateEngineInitProgressCallback);
    
    const config = {
      temperature: 1.0,
      top_p: 1,
      cache: false,
    };

    try {
      await engineRef.current.reload(selectedModel, config);
      setIsModelDownloaded(true);
      setDownloadStatus("");
    } catch (error) {
      console.error("Engine initialization error:", error);
      setDownloadStatus("Failed to initialize model");
    }
  };

  const streamingGenerating = async (
    currentMessages: Message[],
    onUpdate: (content: string) => void,
    onFinish: (message: string, usage: ModelUsage) => void,
    onError: (error: Error) => void
  ) => {
    try {
      let curMessage = "";
      let usage: ModelUsage | undefined;
      
      if (!engineRef.current) throw new Error("Engine not initialized");

      const completion = await engineRef.current.chat.completions.create({
        stream: true,
        messages: currentMessages,
        stream_options: { include_usage: true },
      });

      for await (const chunk of completion) {
        const curDelta = chunk.choices[0]?.delta.content;
        if (curDelta) {
          curMessage += curDelta;
          onUpdate(curMessage);
        }
        if (chunk.usage) {
          usage = chunk.usage;
        }
      }

      const finalMessage = await engineRef.current.getMessage();
      if (!usage) throw new Error("No usage data available");
      onFinish(finalMessage, usage);
    } catch (err) {
      onError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  const onMessageSend = async () => {
    if (!userInputRef.current) return;

    const input = userInputRef.current.value.trim();
    if (input.length === 0) return;

    const userMessage: Message = {
      content: input,
      role: "user",
    };

    setMessages(prev => [...prev, userMessage]);
    userInputRef.current.value = "";

    const aiMessage: Message = {
      content: "typing...",
      role: "assistant",
    };
    
    setMessages(prev => [...prev, aiMessage]);

    try {
      await streamingGenerating(
        [...messages, userMessage],
        (content) => {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content
            };
            return updated;
          });
        },
        (finalMessage, usage) => {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: finalMessage
            };
            return updated;
          });

          const usageText = 
            `prompt_tokens: ${usage.prompt_tokens}, ` +
            `completion_tokens: ${usage.completion_tokens}, ` +
            `prefill: ${usage.extra.prefill_tokens_per_s.toFixed(4)} tokens/sec, ` +
            `decoding: ${usage.extra.decode_tokens_per_s.toFixed(4)} tokens/sec`;
          
          setChatStats(usageText);
        },
        console.error
      );
    } catch (error) {
      console.error("Message send error:", error);
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading AI capabilities...</p>
      </div>
    );
  }

  return (
    <ModernAppSidebar currentPath="/models">
      <div className="min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/10">
          <div className="flex items-center gap-2 px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/models">AI Models</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto py-8 px-4"
        >
          <Card className="mb-8">
            <CardHeader className='text-4xl'>
              <CardTitle className={lukesFont.className}>Select and Initialize Model</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {appConfig && (
                <>
                  <Select 
                    value={selectedModel} 
                    onValueChange={setSelectedModel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {appConfig.model_list.map((model: any) => (
                        <SelectItem key={model.model_id} value={model.model_id}>
                          {model.model_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button 
                    onClick={initializeWebLLMEngine}
                    disabled={isModelDownloaded}
                    className="w-full"
                  >
                    {isModelDownloaded ? "Model Ready" : "Download Model"}
                  </Button>
                </>
              )}

              {downloadStatus && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <p className="text-sm text-muted-foreground">{downloadStatus}</p>
                  <Progress value={downloadProgress} />
                </motion.div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='text-4xl'>
              <CardTitle className={lukesFont.className}>Chat Interface</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div 
                layout
                className="flex flex-col gap-4 h-[400px] md:h-[600px]"
              >
                <div 
                  ref={chatBoxRef}
                  className="flex-1 overflow-y-auto space-y-4 p-4 rounded-lg border"
                >
                  <AnimatePresence>
                    {messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          msg.role === "user" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        }`}>
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {chatStats && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted-foreground p-2 bg-muted rounded-lg"
                  >
                    {chatStats}
                  </motion.div>
                )}

                <div className="flex gap-2">
                  <Textarea
                    ref={userInputRef}
                    placeholder={isModelDownloaded ? "Type a message..." : "Please download model first"}
                    disabled={!isModelDownloaded}
                    className="min-h-[60px]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onMessageSend();
                      }
                    }}
                  />
                  <Button
                    onClick={onMessageSend}
                    disabled={!isModelDownloaded}
                    className="h-auto"
                  >
                    Send
                  </Button>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ModernAppSidebar>
  );
}