/** @type {import('next').NextConfig} */
const nextConfig = {

    env: {
        NEXTAUTH_URL: process.env.NODE_ENV === 'production'
            ? 'https://nl-9834website.vercel.app'
            : 'http://localhost:3000',
    },

};


