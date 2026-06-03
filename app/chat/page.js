"use client";
import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");  // Stores what student writes
  const [answer, setAnswer] = useState("");      // Stores AI's reply

  async function askAI() {                        // Function runs when button is clicked
    const res = await fetch("/api/chat", {       // Calls your backend route
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: question })  // Sends the student question
    });

    const data = await res.json();                // Gets response from AI
    setAnswer(data.reply);                        // Show answer on page
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>AI School Tutor</h2>

      <textarea
        placeholder="Write your question here"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}  // Update question as student types
      />

      <br /><br />

      <button onClick={askAI}>Ask Question</button>  // When clicked, send to AI

      <p><b>Answer:</b> {answer}</p>                 // Shows AI reply
    </div>
  );
}
