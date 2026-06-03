import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
    title: "AI School Tutor - Your Personalized Learning Buddy",
    description: "A friendly AI tutor for students in Grades 1-10 to help with Math, Science, and more!",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${outfit.variable} font-sans antialiased text-slate-900 bg-slate-50`}
                suppressHydrationWarning
            >
                {children}
            </body>
        </html>
    );
}
