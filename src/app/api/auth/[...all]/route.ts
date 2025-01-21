import { auth } from "@/lib/auth"; // Import your auth setup
import { toNextJsHandler } from "better-auth/next-js";

// Extract handlers from `better-auth`
const handlers = toNextJsHandler(auth);

// Handle CORS preflight requests
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "http://192.168.31.93:3000", // Replace with your origin
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}

// Export GET method
export async function GET(request: Request) {
    return handlers.GET(request); // Call the GET handler from `better-auth`
}

// Export POST method
export async function POST(request: Request) {
    return handlers.POST(request); // Call the POST handler from `better-auth`
}
