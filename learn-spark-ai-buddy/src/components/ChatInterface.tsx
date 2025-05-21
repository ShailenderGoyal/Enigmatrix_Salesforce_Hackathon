
// import React, { useState, useRef, useEffect } from 'react';
// import { useLearning } from '@/contexts/LearningContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card } from '@/components/ui/card';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import ChatMessage from './ChatMessage';
// import { ArrowUp, MessageCircle, CircleX, FileText, Book, Mic, Image, Save, Volume, VolumeX } from 'lucide-react';
// import { toast } from 'sonner';

// const ChatInterface: React.FC = () => {
//   const { messages, sendMessage, currentModule, activeSubtopicId, summarizeConversation, reviseSubtopic } = useLearning();
//   const [inputValue, setInputValue] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const [isSummarizing, setIsSummarizing] = useState(false);
//   const [isRevising, setIsRevising] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

//   const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
//   const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

//    // Initialize media recorder
//   useEffect(() => {
//     const initializeRecorder = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         const recorder = new MediaRecorder(stream);
        
//         recorder.ondataavailable = (e) => {
//           if (e.data.size > 0) {
//             setAudioChunks((prev) => [...prev, e.data]);
//           }
//         };

//         recorder.onstop = async () => {
//           const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
//           await handleAudioUpload(audioBlob);
//           setAudioChunks([]);
//         };

//         setMediaRecorder(recorder);
//       } catch (error) {
//         toast.error('Microphone access is required for voice recording');
//       }
//     };

//     initializeRecorder();

//     return () => {
//       mediaRecorder?.stream?.getTracks().forEach(track => track.stop());
//     };
//   }, []);

//   // Handle audio upload to Whisper API
//   const handleAudioUpload = async (audioBlob: Blob) => {
//     const formData = new FormData();
//     formData.append('audio', audioBlob, 'recording.webm');
//     formData.append('moduleId', currentModule?.id || '');
//     formData.append('subtopicId', activeSubtopicId || '');

//     try {
//       const response = await fetch('/api/transcribe', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) throw new Error('Transcription failed');
      
//       const { text } = await response.json();
//       if (text) {
//         sendMessage(text, currentModule?.id, activeSubtopicId || undefined);
//       }
//     } catch (error) {
//       toast.error('Error transcribing audio');
//     }
//   };

//     // Voice recording toggle
//   const handleVoiceToggle = () => {
//     if (!mediaRecorder) {
//       toast.error('Audio recorder not initialized');
//       return;
//     }

//     if (isRecording) {
//       mediaRecorder.stop();
//       setIsRecording(false);
//       toast.dismiss();
//       toast.success('Processing voice message...');
//     } else {
//       setAudioChunks([]);
//       mediaRecorder.start(1000); // Collect data every 1 second
//       setIsRecording(true);
//       toast('Recording... Click again to stop', {
//         duration: Infinity,
//         action: {
//           label: 'Stop',
//           onClick: () => handleVoiceToggle(),
//         },
//       });
//     }
//   };
//   // Scroll to the bottom when messages change
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//   // Clean up speech synthesis on unmount
//   useEffect(() => {
//     return () => {
//       if (speechSynthRef.current && window.speechSynthesis) {
//         window.speechSynthesis.cancel();
//       }
//     };
//   }, []);

//   const handleSendMessage = () => {
//     if (inputValue.trim()) {
//       console.log("message is "+ inputValue);
      
//       sendMessage(inputValue, currentModule?.id, activeSubtopicId || undefined);
//       setInputValue('');
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const handleSpeakMessage = (text: string) => {
//     if (!window.speechSynthesis) {
//       toast.error('Speech synthesis is not supported in your browser');
//       return;
//     }

//     // Cancel any ongoing speech
//     if (isSpeaking) {
//       window.speechSynthesis.cancel();
//       setIsSpeaking(false);
//       return;
//     }

//     // Clean text (remove markdown and other non-readable content)
//     const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1')
//                          .replace(/\[.*?\]/g, '')
//                          .replace(/```[\s\S]*?```/g, 'code snippet');

//     const utterance = new SpeechSynthesisUtterance(cleanText);
//     speechSynthRef.current = utterance;
    
//     utterance.onend = () => {
//       setIsSpeaking(false);
//     };
    
//     utterance.onerror = () => {
//       setIsSpeaking(false);
//       toast.error('Error occurred while speaking');
//     };
    
//     // Use a slightly lower rate for better comprehension
//     utterance.rate = 0.9;
    
//     // Try to find a good voice
//     const voices = window.speechSynthesis.getVoices();
//     const englishVoices = voices.filter(voice => voice.lang.includes('en'));
//     if (englishVoices.length > 0) {
//       utterance.voice = englishVoices[0];
//     }
    
//     setIsSpeaking(true);
//     window.speechSynthesis.speak(utterance);
//   };

//   const stopSpeaking = () => {
//     if (window.speechSynthesis) {
//       window.speechSynthesis.cancel();
//       setIsSpeaking(false);
//     }
//   };

//   const handleSummarize = async () => {
//     setIsSummarizing(true);
//     try {
//       const summary = await summarizeConversation();
//       toast.success('Summary generated!');
//       sendMessage(`[SUMMARY] ${summary}`, currentModule?.id, activeSubtopicId || undefined);
//     } catch (error) {
//       toast.error('Failed to generate summary');
//     } finally {
//       setIsSummarizing(false);
//     }
//   };

//   const handleRevise = async () => {
//     if (!activeSubtopicId) {
//       toast.error('Please select a subtopic to revise');
//       return;
//     }
    
//     setIsRevising(true);
//     try {
//       await reviseSubtopic(activeSubtopicId);
//       toast.success('Revision started!');
//     } catch (error) {
//       toast.error('Failed to start revision');
//     } finally {
//       setIsRevising(false);
//     }
//   };

//   const handleFileSelect = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
      
//       if (file.type.startsWith('image/')) {
//         toast.success('Image selected. Processing...');
//         // Simulate image processing
//         setTimeout(() => {
//           sendMessage(`[Analyzing image: ${file.name}]`, currentModule?.id, activeSubtopicId || undefined);
//           // Simulate AI response about the image
//           setTimeout(() => {
//             sendMessage(`I've analyzed the image ${file.name}. What would you like to know about it?`, 
//               currentModule?.id, 
//               activeSubtopicId || undefined,
//               'ai');
//           }, 1500);
//         }, 1000);
//       } else if (file.type === 'application/pdf' || file.type === 'text/plain') {
//         toast.success('Document selected. Processing...');
//         // Simulate document processing
//         setTimeout(() => {
//           sendMessage(`[Analyzing document: ${file.name}]`, currentModule?.id, activeSubtopicId || undefined);
//           // Simulate AI response about the document
//           setTimeout(() => {
//             sendMessage(`I've analyzed the document ${file.name}. You can ask me questions about its content.`, 
//               currentModule?.id, 
//               activeSubtopicId || undefined,
//               'ai');
//           }, 1500);
//         }, 1000);
//       } else {
//         toast.error('Unsupported file type');
//       }
      
//       // Reset file input
//       e.target.value = '';
//     }
//   };

//   const handleSaveNotes = () => {
//     toast.success('Notes saved successfully!');
//   };

//   const handleQnA = () => {
//     if (!selectedFile) {
//       toast.error('Please upload a document first');
//       return;
//     }
    
//     sendMessage(`Please answer questions about the document ${selectedFile.name}`, 
//       currentModule?.id, 
//       activeSubtopicId || undefined);
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-semibold">Chat with AI Assistant</h2>
//         <div className="flex space-x-2">
//           <Button 
//             variant="outline" 
//             size="sm" 
//             onClick={handleSummarize}
//             disabled={isSummarizing || messages.length <= 1}
//           >
//             <FileText className="mr-1 h-4 w-4" />
//             {isSummarizing ? 'Summarizing...' : 'Summarize'}
//           </Button>
//           <Button 
//             variant="outline" 
//             size="sm" 
//             onClick={handleRevise}
//             disabled={isRevising || !activeSubtopicId}
//           >
//             <Book className="mr-1 h-4 w-4" />
//             {isRevising ? 'Starting...' : 'Revise Topic'}
//           </Button>
//           <Button 
//             variant="outline" 
//             size="sm"
//             onClick={handleQnA}
//             disabled={!selectedFile}
//           >
//             <MessageCircle className="mr-1 h-4 w-4" />
//             Q&A on Document
//           </Button>
//           <Button 
//             variant="outline" 
//             size="sm"
//             onClick={handleSaveNotes}
//           >
//             <Save className="mr-1 h-4 w-4" />
//             Save Notes
//           </Button>
//           <Button
//             variant={isSpeaking ? "destructive" : "outline"}
//             size="sm"
//             onClick={stopSpeaking}
//             disabled={!isSpeaking}
//           >
//             <VolumeX className="mr-1 h-4 w-4" />
//             Stop Audio
//           </Button>
//         </div>
//       </div>
      
//       <Card className="flex-1 overflow-hidden border p-0">
//         <div className="flex flex-col h-full">
//           <div className="flex-1 overflow-y-auto p-4">
//             {messages.length === 0 ? (
//               <div className="h-full flex items-center justify-center text-muted-foreground">
//                 <p>No messages yet. Start a conversation!</p>
//               </div>
//             ) : (
//               <>
//                 {messages.map((message) => (
//                   <div key={message.id}>
//                     <ChatMessage message={message} />
//                     {message.sender === 'ai' && (
//                       <div className="ml-10 mb-4">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           className="text-xs"
//                           onClick={() => handleSpeakMessage(message.content)}
//                         >
//                           <Volume className="mr-1 h-4 w-4" />
//                           {isSpeaking ? 'Speaking...' : 'Listen'}
//                         </Button>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
                
//                 {/* Typing indicator (shown when AI is "thinking") */}
//                 {messages.length > 0 && messages[messages.length - 1].sender === 'user' && (
//                   <div className="flex items-center ml-10 mb-4">
//                     <div className="bg-secondary/20 py-2 px-4 rounded-full typing-indicator">
//                       <span></span>
//                       <span></span>
//                       <span></span>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
          
//           <div className="p-4 border-t bg-card">
//             <div className="flex items-center space-x-2">
//               <Input
//                 placeholder="Type your message..."
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 disabled={isRecording}
//                 className="flex-1"
//               />
//               <input 
//                 type="file" 
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 accept="image/*,application/pdf,text/plain"
//                 className="hidden"
//               />
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={handleFileSelect}
//                 title="Upload image or document"
//                 disabled={!activeSubtopicId}
//               >
//                 <Image size={20} />
//               </Button>
//               <Button
//             variant={isRecording ? "destructive" : "outline"}
//             size="icon"
//             onClick={handleVoiceToggle}
//             title={isRecording ? "Stop recording" : "Start voice recording"}
//             disabled={!activeSubtopicId || !mediaRecorder}
//           >
//                 {isRecording ? (
//               <div className="flex items-center justify-center">
//                 <div className="h-2 w-2 bg-white rounded-full animate-pulse mr-1" />
//                 <div className="h-2 w-2 bg-white rounded-full animate-pulse mr-1" style={{ animationDelay: '0.2s' }} />
//                 <div className="h-2 w-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
//               </div>
//             ) : (
//               <Mic size={20} />
//             )}
//           </Button>

//               <Button
//             variant="default"
//             size="icon"
//             onClick={handleSendMessage}
//             disabled={!inputValue.trim() || isRecording || !activeSubtopicId}
//           >
//             <ArrowUp size={18} />
//           </Button>
//         </div>
            
//             {!activeSubtopicId && (
//           <p className="text-xs text-muted-foreground mt-2">
//             Select a learning topic to start the conversation
//           </p>
//         )}
        
//         {isRecording && (
//           <div className="text-sm text-destructive mt-2 animate-pulse">
//             Recording... Click the microphone button again to stop.
//           </div>
//         )}
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default ChatInterface;


import React, { useState, useRef, useEffect } from 'react';
import { useLearning } from '@/contexts/LearningContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import ChatMessage from './ChatMessage';
import { ArrowUp, MessageCircle, CircleX, FileText, Book, Mic, Image, Save, Volume, VolumeX, HelpCircle, Send, Users } from 'lucide-react';
import { toast } from 'sonner';

const ChatInterface: React.FC = () => {
  const { messages, sendMessage, currentModule, activeSubtopicId, summarizeConversation, reviseSubtopic } = useLearning();
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isRevising, setIsRevising] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  
  // Feedback section state
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackQuery, setFeedbackQuery] = useState('');
  const [expertType, setExpertType] = useState('community');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

   // Initialize media recorder
  useEffect(() => {
    const initializeRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            setAudioChunks((prev) => [...prev, e.data]);
          }
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          await handleAudioUpload(audioBlob);
          setAudioChunks([]);
        };

        setMediaRecorder(recorder);
      } catch (error) {
        toast.error('Microphone access is required for voice recording');
      }
    };

    initializeRecorder();

    return () => {
      mediaRecorder?.stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // Handle audio upload to Whisper API
  const handleAudioUpload = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('moduleId', currentModule?.id || '');
    formData.append('subtopicId', activeSubtopicId || '');

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Transcription failed');
      
      const { text } = await response.json();
      if (text) {
        sendMessage(text, currentModule?.id, activeSubtopicId || undefined);
      }
    } catch (error) {
      toast.error('Error transcribing audio');
    }
  };

    // Voice recording toggle
  const handleVoiceToggle = () => {
    if (!mediaRecorder) {
      toast.error('Audio recorder not initialized');
      return;
    }

    if (isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      toast.dismiss();
      toast.success('Processing voice message...');
    } else {
      setAudioChunks([]);
      mediaRecorder.start(1000); // Collect data every 1 second
      setIsRecording(true);
      toast('Recording... Click again to stop', {
        duration: Infinity,
        action: {
          label: 'Stop',
          onClick: () => handleVoiceToggle(),
        },
      });
    }
  };
  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (speechSynthRef.current && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue, currentModule?.id, activeSubtopicId || undefined);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSpeakMessage = (text: string) => {
    if (!window.speechSynthesis) {
      toast.error('Speech synthesis is not supported in your browser');
      return;
    }

    // Cancel any ongoing speech
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean text (remove markdown and other non-readable content)
    const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1')
                         .replace(/\[.*?\]/g, '')
                         .replace(/```[\s\S]*?```/g, 'code snippet');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    speechSynthRef.current = utterance;
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast.error('Error occurred while speaking');
    };
    
    // Use a slightly lower rate for better comprehension
    utterance.rate = 0.9;
    
    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter(voice => voice.lang.includes('en'));
    if (englishVoices.length > 0) {
      utterance.voice = englishVoices[0];
    }
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis && speechSynthRef.current) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      // Find the last AI message and speak it
      const lastAiMessage = [...messages].reverse().find(m => m.sender === 'ai');
      if (lastAiMessage) {
        handleSpeakMessage(lastAiMessage.content);
      }
    }
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const summary = await summarizeConversation();
      toast.success('Summary generated!');
      sendMessage(`[SUMMARY] ${summary}`, currentModule?.id, activeSubtopicId || undefined);
    } catch (error) {
      toast.error('Failed to generate summary');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleRevise = async () => {
    if (!activeSubtopicId) {
      toast.error('Please select a subtopic to revise');
      return;
    }
    
    setIsRevising(true);
    try {
      await reviseSubtopic(activeSubtopicId);
      toast.success('Revision started!');
    } catch (error) {
      toast.error('Failed to start revision');
    } finally {
      setIsRevising(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      if (file.type.startsWith('image/')) {
        toast.success('Image selected. Processing...');
        // Simulate image processing
        setTimeout(() => {
          sendMessage(`[Analyzing image: ${file.name}]`, currentModule?.id, activeSubtopicId || undefined);
          // Simulate AI response about the image
          setTimeout(() => {
            sendMessage(`I've analyzed the image ${file.name}. What would you like to know about it?`, 
              currentModule?.id, 
              activeSubtopicId || undefined,
              'ai');
          }, 1500);
        }, 1000);
      } else if (file.type === 'application/pdf' || file.type === 'text/plain') {
        toast.success('Document selected. Processing...');
        // Simulate document processing
        setTimeout(() => {
          sendMessage(`[Analyzing document: ${file.name}]`, currentModule?.id, activeSubtopicId || undefined);
          // Simulate AI response about the document
          setTimeout(() => {
            sendMessage(`I've analyzed the document ${file.name}. You can ask me questions about its content.`, 
              currentModule?.id, 
              activeSubtopicId || undefined,
              'ai');
          }, 1500);
        }, 1000);
      } else {
        toast.error('Unsupported file type');
      }
      
      // Reset file input
      e.target.value = '';
    }
  };

  const handleSaveNotes = () => {
    toast.success('Notes saved successfully!');
  };

  const handleQnA = () => {
    if (!selectedFile) {
      toast.error('Please upload a document first');
      return;
    }
    
    sendMessage(`Please answer questions about the document ${selectedFile.name}`, 
      currentModule?.id, 
      activeSubtopicId || undefined);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border/40 py-1.5 px-3 flex justify-between items-center bg-muted/20">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xs font-medium text-muted-foreground">AI Assistant</h2>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 text-xs px-2 rounded-sm"
              onClick={handleSummarize}
              disabled={isSummarizing || messages.length <= 1}
            >
              <FileText className="mr-1 h-3 w-3" />
              {isSummarizing ? 'Summarizing...' : 'Summarize'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 text-xs px-2 rounded-sm"
              onClick={handleRevise}
              disabled={isRevising || !activeSubtopicId}
            >
              <Book className="mr-1 h-3 w-3" />
              {isRevising ? 'Revising...' : 'Revise'}
            </Button>
          </div>
        </div>
        <div className="flex gap-1">
          <Button 
            variant={isSpeaking ? "secondary" : "ghost"}
            size="sm"
            className="h-6 text-xs px-2 rounded-sm"
            onClick={toggleSpeaking}
            disabled={messages.length <= 1}
          >
            <Volume className="mr-1 h-3 w-3" />
            Read
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-6 text-xs px-2 rounded-sm"
            onClick={stopSpeaking}
            disabled={!isSpeaking}
          >
            <VolumeX className="mr-1 h-3 w-3" />
            Stop
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div key={message.id}>
                    <ChatMessage message={message} />
                    {message.sender === 'ai' && (
                      <div className="ml-10 mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleSpeakMessage(message.content)}
                        >
                          <Volume className="mr-1 h-4 w-4" />
                          {isSpeaking ? 'Speaking...' : 'Listen'}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
                
                {/* Typing indicator (shown when AI is "thinking") */}
                {messages.length > 0 && messages[messages.length - 1].sender === 'user' && (
                  <div className="flex items-center ml-10 mb-4">
                    <div className="bg-secondary/20 py-2 px-4 rounded-full typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="p-4 border-t bg-card">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isRecording}
                className="flex-1"
              />
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,application/pdf,text/plain"
                className="hidden"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleFileSelect}
                title="Upload image or document"
                disabled={!activeSubtopicId}
              >
                <Image size={20} />
              </Button>
              <Button
            variant={isRecording ? "destructive" : "outline"}
            size="icon"
            onClick={handleVoiceToggle}
            title={isRecording ? "Stop recording" : "Start voice recording"}
            disabled={!activeSubtopicId || !mediaRecorder}
          >
                {isRecording ? (
              <div className="flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full animate-pulse mr-1" />
                <div className="h-2 w-2 bg-white rounded-full animate-pulse mr-1" style={{ animationDelay: '0.2s' }} />
                <div className="h-2 w-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            ) : (
              <Mic size={20} />
            )}
          </Button>

              <Button
            variant="default"
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isRecording || !activeSubtopicId}
          >
            <ArrowUp size={18} />
          </Button>
        </div>
            
            {!activeSubtopicId && (
          <p className="text-xs text-muted-foreground mt-2">
            Select a learning topic to start the conversation
          </p>
        )}
        
        {isRecording && (
          <div className="text-sm text-destructive mt-2 animate-pulse">
            Recording... Click the microphone button again to stop.
          </div>
        )}
          </div>
          
          {/* Feedback Section */}
          <div className="mt-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setShowFeedback(!showFeedback)}
            >
              <HelpCircle size={16} />
              {showFeedback ? 'Hide Community Help' : 'Need help from Salesforce experts?'}
            </Button>
            
            {showFeedback && (
              <Card className="mt-3 p-4 border border-primary/20 bg-accent/20">
                {!feedbackSubmitted ? (
                  <>
                    <div className="text-center mb-3">
                      <CardTitle className="text-md font-medium mb-2">
                        Connect with Salesforce Experts
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Share your query with our community of Salesforce experts
                      </p>
                    </div>
                    
                    <div className="mt-4 mb-3">
                      <Label htmlFor="expert-type" className="text-sm font-medium mb-2 block">Who would you like to reach?</Label>
                      <RadioGroup 
                        id="expert-type" 
                        className="flex gap-4" 
                        value={expertType} 
                        onValueChange={setExpertType}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="community" id="community" />
                          <Label htmlFor="community" className="cursor-pointer flex items-center gap-1">
                            <Users size={14} />
                            Salesforce Community
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="expert" id="expert" />
                          <Label htmlFor="expert" className="cursor-pointer flex items-center gap-1">
                            <HelpCircle size={14} />
                            Subject Matter Expert
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="mb-3">
                      <Label htmlFor="feedback-query" className="text-sm font-medium mb-2 block">Your query</Label>
                      <Textarea
                        id="feedback-query"
                        placeholder="Describe what you need help with..."
                        className="resize-none h-24"
                        value={feedbackQuery}
                        onChange={(e) => setFeedbackQuery(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      variant="default" 
                      className="w-full" 
                      disabled={!feedbackQuery.trim()}
                      onClick={() => {
                        toast.success(`Your query has been submitted to the ${expertType === 'community' ? 'Salesforce Community' : 'Salesforce Experts'}`);
                        setFeedbackSubmitted(true);
                      }}
                    >
                      <Send size={14} className="mr-2" />
                      Submit Query
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-3">
                    <div className="text-primary mb-2">
                      <HelpCircle size={36} className="mx-auto mb-2" />
                      <CardTitle className="text-md font-medium">
                        Query Submitted!
                      </CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your question has been sent to our {expertType === 'community' ? 'Salesforce Community' : 'Subject Matter Experts'}. 
                      You'll receive a response via email soon.
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => {
                        setFeedbackSubmitted(false);
                        setFeedbackQuery('');
                      }}
                    >
                      Submit Another Query
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

