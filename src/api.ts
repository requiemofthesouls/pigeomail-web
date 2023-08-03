
export interface EMail {
    email: string;
}


export interface IncomingEmail {
    body: string;
    content_type: string;
    from: string;
    to: string;
    html: string;
    subject: string;
    timestamp: number;
}

