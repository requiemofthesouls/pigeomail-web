import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {EMail, IncomingEmail} from './api.ts';
import axios from 'axios';

type TemporaryEmailProps = {
    apiUrl: string; // Backend API URL
};

const TemporaryEmail: React.FC<TemporaryEmailProps> = ({apiUrl}) => {
    const [emailName, setEmailName] = useState<string | null>(null);
    const [messages, setMessages] = useState<IncomingEmail[]>([]);
    const eventSourceRef = useRef<EventSource | null>(null);

    const createMailbox = async () => {
        try {
            disconnectFromSSE(); // Close SSE connection if it exists
            const response = await axios.post(`${apiUrl}/mailbox`);
            const data = (await response.data) as EMail;
            setEmailName(data.email);
            localStorage.setItem('emailName', data.email);
            connectToSSE(data.email);
        } catch (error) {
            console.error('Error creating mailbox:', error);
        }
    };

    const deleteMailbox = async () => {
        try {
            setEmailName(null);
            setMessages([]);
            localStorage.removeItem('emailName');
            disconnectFromSSE();
        } catch (error) {
            console.error('Error deleting mailbox:', error);
        }
    };

    const connectToSSE = (emailName: string) => {
        // SSE connection setup here to receive incoming email messages
        // You can use the EventSource API to handle server-sent events.
        // Example:
        eventSourceRef.current = new EventSource(`${apiUrl}/stream?stream=${emailName}`);
        eventSourceRef.current.onmessage = (event) => {
            const newMessage = JSON.parse(event.data) as IncomingEmail;
            console.log('New message:', newMessage);
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
        }

        // Cleanup SSE connection on component unmount
        return () => disconnectFromSSE();
    }, []);

    return (
        <div className="temporary-email-container">
            <h2>Temporary Email</h2>

            <div className="action-buttons">
                <button onClick={createMailbox}>
                    {emailName ? 'Recreate Email' : 'Create Mailbox'}
                </button>
                {emailName && <button onClick={deleteMailbox}>Delete Email</button>}
            </div>

            {emailName && <p>Email Address: {emailName}</p>}

            <h3>Incoming Messages</h3>
            {messages.length > 0 ? (
                <table className="email-table">
                    <thead>
                    <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Subject</th>
                        <th>Body</th>
                    </tr>
                    </thead>
                    <tbody>
                    {messages.map((message, index) => (
                        <tr key={index}>
                            <td>{message.from}</td>
                            <td>{message.to}</td>
                            <td>{message.subject}</td>
                            <td>{message.body}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No messages to display.</p>
            )}
        </div>
    );
};

export default TemporaryEmail;
