/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "chickenpot-takeaway-api.vtl-lab.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
}
