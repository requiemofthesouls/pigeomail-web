import React, {useEffect, useState} from 'react';
import {getMailboxName, getIncomingEmailStream, IncomingEmail, createIncomingEmailStream} from './api';



const App: React.FC = () => {
    const [mailboxName, setMailboxName] = useState<string | null>(null);
    const [incomingEmails, setIncomingEmails] = useState<string[]>([]);

    useEffect(() => {
        // Fetch mailbox name on component mount
        fetchMailboxName().then();

        createStream().then();
        // Open the event stream for incoming emails
        // fetchIncomingEmails().then();

        const eventSource = new EventSource('http://localhost:5173/stream?stream=123');

        eventSource.onmessage = (event) => {
            console.log("received new message")
            const newEmail = JSON.parse(event.data);
            setIncomingEmails((prevEmails) => [event.data, ...prevEmails]);
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const fetchMailboxName = async () => {
        try {
            console.log('fetching mailbox name')
            const name = await getMailboxName();
            console.log(name)
            setMailboxName(name.email);
        } catch (error) {
            console.error(error);
        }
    };

    const createStream = async () => {
        try {
            console.log('creating stream')
            const stream = await createIncomingEmailStream();
            console.log(stream)
        } catch (error) {
            console.error(error);
        }
    }

    // const fetchIncomingEmails = async () => {
    //     try {
    //         console.log('fetching emails')
    //         const emails = await getIncomingEmailStream();
    //         console.log(emails)
    //         setIncomingEmails((prevEmails) => [...prevEmails, emails.result]);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    return (
        <div>
            <h1>Temporary Mailbox</h1>
            {mailboxName && <p>Mailbox Name: {mailboxName}</p>}
            <h2>Incoming Emails</h2>
            <ul>
                {incomingEmails.map((message, index) => (
                    <li key={index}>
                        <strong>EMail: </strong>
                        {message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
