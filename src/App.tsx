import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {EMail, IncomingEmail} from "./api.ts";
import axios from "axios";

type TemporaryEmailProps = {
    apiUrl: string; // Backend API URL
};

const TemporaryEmail: React.FC<TemporaryEmailProps> = ({apiUrl}) => {
    const [emailName, setEmailName] = useState<string | null>(null);
    const [messages, setMessages] = useState<IncomingEmail[]>([]);
    const eventSourceRef = useRef<EventSource | null>(null);

    const createMailbox = async () => {
        try {
            const response = await axios.post(`${apiUrl}/mailbox`);
            const data = await response.data as EMail;
            setEmailName(data.email);
            localStorage.setItem('emailName', data.email);
            connectToSSE(data.email);
        } catch (error) {
            console.error('Error creating mailbox:', error);
        }
    };

    const connectToSSE = (emailName: string) => {
        // SSE connection setup here to receive incoming email messages
        // You can use the EventSource API to handle server-sent events.
        // Example:
        eventSourceRef.current = new EventSource(`${apiUrl}/stream?stream=${emailName}`);
        eventSourceRef.current.onmessage = (event) => {
            const newMessage = JSON.parse(event.data) as IncomingEmail;
            console.log('New message:', newMessage)
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };
    };

    const disconnectFromSSE = () => {
        // Close SSE connection when the component unmounts
        // Disconnect the eventSource to prevent memory leaks
        if (eventSourceRef.current) {
            // Close SSE connection if it exists
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
    };

    useEffect(() => {
        // Check local storage for saved email name on component mount
        const savedEmailName = localStorage.getItem('emailName');
        if (savedEmailName != undefined || savedEmailName != null) {
            setEmailName(savedEmailName);
            connectToSSE(savedEmailName); // Start SSE connection if email name is available
        } else {
            // If no saved email name, create a new mailbox
            createMailbox();
        }

        // Cleanup SSE connection on component unmount
        return () => disconnectFromSSE();
    }, []);

    return (
        <div>
            <h2>Temporary Email</h2>
            {emailName && <p>Email Address: {emailName}</p>}

            <h3>Incoming Messages</h3>
            {messages.map((message, index) => (
                <div key={index}>
                    <p key={index}>From: {message.from}</p>
                    <p key={index}>To: {message.to}</p>
                    <p key={index}>Subject: {message.subject}</p>
                    <p key={index}>Body: {message.body}</p>
                </div>
            ))}
        </div>
    );
};

export default TemporaryEmail;

