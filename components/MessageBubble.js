"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { GraduationCap, User, Lightbulb, Image as ImageIcon } from "lucide-react";
import MermaidChart from "./MermaidChart";

export default function MessageBubble({ message, isAi, accent = "indigo" }) {

    // Scans message string and splits it into organized blocks (Markdown text vs Visual diagrams)
    const parseContentBlocks = (text) => {
        if (!text || typeof text !== "string") return [];

        // Captures Mermaid diagrams, with or without code fences (handles cases in image_ec36ad.png)
        const mermaidRegex = /(?:
        http://googleusercontent.com/immersive_entry_chip/0