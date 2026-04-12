# **App Name**: OmniConnect Pay

## Core Features:

- Secure Landing Page: A modern, mobile-responsive landing page built with Next.js/React that captures the clientMac address from URL parameters and guides the user through the payment process.
- Paystack Integration (Frontend): Integration of the Paystack popup to allow users to securely make payments of 50/- KES directly from the landing page.
- Paystack Webhook Listener: A backend Node.js/Express '/webhook' endpoint to securely receive and process real-time payment status updates from Paystack.
- Omada Controller User Authorization: A backend function to programmatically authorize or deauthorize users on the TP-Link Omada Controller API upon successful payment or expiration, using their MAC address and a specified access duration.
- Transaction Logging: Persistent storage of every successful payment transaction to a MongoDB Atlas database using Mongoose for reliable record-keeping.
- Credential Management: Secure handling and loading of sensitive credentials (Paystack API keys, Omada Controller API keys) using environment variables (.env file).
- AI-Enhanced Welcome Messaging: Leverage an AI tool to generate dynamic and personalized welcome messages for users after successful payment, potentially offering relevant tips or suggestions for their Wi-Fi experience.

## Style Guidelines:

- Primary color: A clear and professional blue (#3671E2), representing connectivity, trust, and technology.
- Background color: A soft, heavily desaturated blue (#F0F2F4), creating a clean and spacious feel for the light theme.
- Accent color: A vibrant, engaging aqua-cyan (#55DCF6), used for interactive elements and highlights to draw attention.
- Headline and body text font: 'Inter' (sans-serif), chosen for its modern, clean, and highly legible appearance suitable for both display and extended reading.
- Utilize simple, easily recognizable icons that communicate concepts like Wi-Fi connection status, payment success, and network access.
- Design a mobile-first, responsive layout focusing on a clear call-to-action (payment button) and essential information, ensuring optimal usability on various devices.
- Incorporate subtle loading animations for the payment gateway and success feedback transitions to enhance user experience without being distracting.