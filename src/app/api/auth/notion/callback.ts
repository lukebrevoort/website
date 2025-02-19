import { NextApiRequest, NextApiResponse } from "next";

const EXTENSION_ID = "plakglpiehokmcomeldidmjjbehlmlje"; // Replace with your actual Chrome extension ID

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code, state, error } = req.query;

    if (error) {
        return res.status(400).json({ error: "Authorization failed" });
    }

    if (!code) {
        return res.status(400).json({ error: "Authorization code is missing" });
    }

    // Redirect back to the Chrome extension with the auth code
    const redirectUrl = `chrome-extension://${EXTENSION_ID}/callback.html?code=${code}`;
    
    // Redirect the user to the Chrome extension
    res.writeHead(302, { Location: redirectUrl });
    res.end();
}
