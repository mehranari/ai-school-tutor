import { Inter, Outfit } from "next/font/google";
import "./globals.css";
// ✅ Required for math formula rendering (KaTeX)
import "katex/dist/katex.min.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
    title: "TutorGem — AI School Tutor for Grades 1-10",
    description: "Free AI tutor for Maths, Physics, Chemistry, Biology, English & more. Expert explanations with diagrams for Grade 1-10 students.",
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