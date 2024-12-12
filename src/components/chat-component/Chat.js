import React, { useState, useEffect, useRef } from 'react'
import * as webllm from "@mlc-ai/web-llm";
import "./Chat.css"

function Chat() {
    // State for managing messages, model, and UI
    const [messages, setMessages] = useState([
        {
            content: "You are a helpful AI agent helping users.",
            role: "system",
        }
    ]);
    const [availableModels, setAvailableModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState("Llama-3.1-8B-Instruct-q4f32_1-1k");
    const [downloadStatus, setDownloadStatus] = useState("");
    const [chatStats, setChatStats] = useState("");
    const [isModelDownloaded, setIsModelDownloaded] = useState(false);

    // Refs
    const engineRef = useRef(null);
    const chatBoxRef = useRef(null);
    const userInputRef = useRef(null);

    // Initialize models and engine on component mount
    useEffect(() => {
        // Create engine instance
        engineRef.current = new webllm.MLCEngine();
        
        // Populate available models
        const models = webllm.prebuiltAppConfig.model_list.map((m) => m.model_id);
        setAvailableModels(models);
    }, []);

    // Callback for initializing progress
    const updateEngineInitProgressCallback = (report) => {
        setDownloadStatus(report.text);
    };

    // Initialize WebLLM Engine
    const initializeWebLLMEngine = async () => {
        if (!engineRef.current) return;

        engineRef.current.setInitProgressCallback(updateEngineInitProgressCallback);
        
        const config = {
            temperature: 1.0,
            top_p: 1,
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

    // Streaming message generation
    const streamingGenerating = async (currentMessages, onUpdate, onFinish, onError) => {
        try {
            let curMessage = "";
            let usage;
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
            onFinish(finalMessage, usage);
        } catch (err) {
            onError(err);
        }
    };

    // Send message handler
    const onMessageSend = async () => {
        if (!userInputRef.current) return;

        const input = userInputRef.current.value.trim();
        if (input.length === 0) return;

        const userMessage = {
            content: input,
            role: "user",
        };

        // Update messages with user message
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        // Clear input
        userInputRef.current.value = "";
        userInputRef.current.setAttribute("placeholder", "Generating...");

        // Add AI typing message
        const aiMessage = {
            content: "typing...",
            role: "assistant",
        };
        setMessages(prev => [...prev, aiMessage]);

        try {
            await streamingGenerating(
                updatedMessages,
                (content) => {
                    // Update last message with streaming content
                    setMessages(prev => {
                        const updatedMessages = [...prev];
                        updatedMessages[updatedMessages.length - 1] = {
                            ...updatedMessages[updatedMessages.length - 1],
                            content
                        };
                        return updatedMessages;
                    });
                },
                (finalMessage, usage) => {
                    // Update last message and show stats
                    setMessages(prev => {
                        const updatedMessages = [...prev];
                        updatedMessages[updatedMessages.length - 1] = {
                            ...updatedMessages[updatedMessages.length - 1],
                            content: finalMessage
                        };
                        return updatedMessages;
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

    // Scroll to bottom when messages change
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className='container'>
            
            <h1>Initialize WebLLM and Download Model</h1>
            <div className="download-container">
                <select className='chat--select'
                    value={selectedModel} 
                    onChange={(e) => setSelectedModel(e.target.value)}
                >
                    {availableModels.map((modelId) => (
                        <option key={modelId} value={modelId}>
                            {modelId}
                        </option>
                    ))}
                </select>
                <button 
                    onClick={initializeWebLLMEngine}
                >
                    Download
                </button>
            </div>
            
            {downloadStatus && <p>{downloadStatus}</p>}

            <h1>Chat</h1>
            <div className="chat-container">
                <div 
                    ref={chatBoxRef} 
                    className="chat-box"
                >
                    {messages.map((msg, index) => (
                        <div 
                            key={index} 
                            className={`message-container ${msg.role}`}
                        >
                            <div className="message">{msg.content}</div>
                        </div>
                    ))}
                </div>
                
                {chatStats && (
                    <div className="chat-stats">{chatStats}</div>
                )}
                
                <div className="chat-input-container">
                <textarea 
                        className='chat-input'
                        ref={userInputRef}
                        placeholder="Type a message..."
                        rows={1}
                        style={{
                            resize: 'none',
                            overflow: 'hidden',
                            minHeight: '40px',
                            maxHeight: '150px',
                            width: '100%',
                            lineHeight: '20px',
                            padding: '10px',
                            boxSizing: 'border-box'
                        }}
                        onInput={(e) => {
                            // Auto-resize logic
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                    />
                    <button 
                    
                        onClick={onMessageSend}
                        disabled={!isModelDownloaded}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat