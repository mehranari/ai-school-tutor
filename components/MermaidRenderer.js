"use client";
import React from "react";
import Mermaid from "react-mermaid2";

export default function MermaidRenderer({ chartCode }) {
    // Ensure the code is clean and doesn't contain extra markdown fences
    const cleanCode = chartCode.replace(/```mermaid/gi, "").replace(/
        ```/g, "").trim();

  return (
    <div className="my-6 p-4 bg-white border border-slate-200 rounded-xl overflow-x-auto">
      <Mermaid chart="{cleanCode}"/>
    </div>
  );
}