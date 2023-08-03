import axios from 'axios';

const API_BASE_URL = 'http://localhost:5173/api/pigeomail/v1'; // Replace with your backend API URL

export interface EMail {
    email: string;
}

// write function that returns a promise of type EMail
export const getMailboxName = async (): Promise<EMail> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/mailbox`);
        const {data} = response;
        return data;
    } catch (error) {
        throw new Error('Failed to fetch mailbox name.');
    }
}


export interface IncomingEmail {
    id: string;
    email: string;
    subject: string;
    body: string;
    sender: string;
    recipient: string;
    created_at: number;
}

export interface ResultIncomingEmail {
    result: IncomingEmail;
}

export const getIncomingEmailStream = async (): Promise<ResultIncomingEmail> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/stream`, {responseType: 'stream'});
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch incoming email stream.');
    }
};

export const createIncomingEmailStream = async (): Promise<void> => {
    try {
        await axios.post(`http://localhost:5173/create_stream?stream=123`);
    } catch (error) {
        throw new Error('Failed to create incoming email stream.');
    }
}
