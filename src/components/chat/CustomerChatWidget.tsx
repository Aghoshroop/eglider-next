"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, onSnapshot, query, orderBy, serverTimestamp, getDoc } from "firebase/firestore";
import Image from "next/image";
import styles from "./CustomerChatWidget.module.css";

interface Message {
  id: string;
  sender: "user" | "admin";
  text: string;
  createdAt: any;
  productContext?: {
    id: string;
    name: string;
    image: string;
  };
}

export default function CustomerChatWidget() {
  const { user } = useAuth();
  const { isChatOpen, closeChat, openChat, productContext, setProductContext } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    setTimeout(adjustTextareaHeight, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e as unknown as React.FormEvent);
    }
  };

  useEffect(() => {
    if (!user || (!isChatOpen && !productContext)) return; // If logged out or closed and no direct product open request

    if (productContext && !isChatOpen) {
      openChat(); // Auto-open if product context was set via CleanDetailsPane
    }

    const messagesRef = collection(db, `chats/${user.uid}/messages`);
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach(doc => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [user, isChatOpen, productContext, openChat]);

  // Handle auto-send product enquiry based on context
  useEffect(() => {
    if (productContext && user && isChatOpen) {
      const sendAutomatedProductMessage = async () => {
        try {
          const chatDocRef = doc(db, "chats", user.uid);
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userName = userDoc.exists() ? userDoc.data().name : user.email?.split("@")[0] || "Customer";

          await setDoc(chatDocRef, {
            userId: user.uid,
            userName: userName,
            userEmail: user.email,
            lastMessage: `Enquiry about ${productContext.name}`,
            lastMessageAt: serverTimestamp(),
            unreadCountAdmin: 1 // Trigger alert for admin
          }, { merge: true });

          const messageRef = doc(collection(db, `chats/${user.uid}/messages`));
          await setDoc(messageRef, {
            sender: "user",
            text: `Hi! I'm interested in this product and would like more information.`,
            createdAt: serverTimestamp(),
            productContext: productContext
          });

          // Clear context so it doesn't loop
          setProductContext(null);
        } catch (error) {
          console.error("Failed to send context message", error);
        }
      };

      sendAutomatedProductMessage();
    }
  }, [productContext, user, isChatOpen, setProductContext]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !user) return;

    const text = inputText.trim();
    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const chatDocRef = doc(db, "chats", user.uid);
      
      // Update the main chat registry document (to appear in Admin's sidebar)
      // Only gets the name once if not already there, ideally handled better but for fast execution:
      const chatDocSnap = await getDoc(chatDocRef);
      let userName = user.email?.split("@")[0] || "Customer";
      
      if (!chatDocSnap.exists()) {
         const userDoc = await getDoc(doc(db, "users", user.uid));
         if (userDoc.exists()) userName = userDoc.data().name;
      }

      await setDoc(chatDocRef, {
        userId: user.uid,
        userName: chatDocSnap.exists() && chatDocSnap.data().userName ? chatDocSnap.data().userName : userName,
        userEmail: user.email,
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
        unreadCountAdmin: 1 // Arbitrary trigger for admin new message
      }, { merge: true });

      // Add the specific message
      const messageRef = doc(collection(db, `chats/${user.uid}/messages`));
      await setDoc(messageRef, {
        sender: "user",
        text: text,
        createdAt: serverTimestamp()
      });

    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  if (!user) return null; // Only for logged-in users

  return (
    <div className={styles.chatWrapper}>
      {!isChatOpen ? (
        <button className={styles.chatLauncher} onClick={openChat}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      ) : (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <div className={styles.avatar}>EG</div>
              <div>
                <h4>eglider Support</h4>
                <p>Typically replies quickly</p>
              </div>
            </div>
            <button className={styles.closeChat} onClick={closeChat}>
              &times;
            </button>
          </div>

          <div className={styles.chatBody}>
            <div className={styles.message + " " + styles.messageAdmin}>
               👋 Hello! How can we help you today? Let us know if you need help deciding on gear.
            </div>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`${styles.messageWrapper} ${msg.sender === 'user' ? styles.wrapperUser : styles.wrapperAdmin}`}>
                <div className={`${styles.message} ${msg.sender === 'user' ? styles.messageUser : styles.messageAdmin}`}>
                  {msg.productContext && (
                    <div className={styles.productBubble}>
                      <Image 
                        src={msg.productContext.image} 
                        alt={msg.productContext.name} 
                        width={60} 
                        height={60} 
                        className={styles.productBubbleImage} 
                      />
                      <span className={styles.productBubbleName}>{msg.productContext.name}</span>
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className={styles.chatFooter} onSubmit={sendMessage}>
            <textarea 
              ref={textareaRef}
              placeholder="Type your message..." 
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button type="submit" disabled={!inputText.trim()}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}
