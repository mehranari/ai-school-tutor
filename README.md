# AI School Tutor 🎓

A complete MVP SaaS web application built with Next.js and Hugging Face Inference API. Designed specifically for school students (Grades 1-10).

## 🚀 Features
- **AI Chat Tutor**: Answers questions in simple English with a teacher-like tone.
- **Exam Paper Generator**: Instantly creates MCQs, Short, and Long questions for any topic.
- **Grade-Specific Logic**: Adjusts language and explanation depth based on the selected grade.
- **Subject Expertise**: Specialized for Math, Physics, English, and Science.

## 🛠️ Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **AI Engine**: Hugging Face Inference API (Mistral-7B model)
- **Icons**: Lucide React

## 📦 Getting Started

### 1. Installation
Clone the project and install dependencies:
```bash
npm install
```

### 2. Set Up Environment Variables
Create a file named `.env.local` in the root directory and add your Hugging Face API key:
```env
HUGGINGFACE_API_KEY=your_hf_token_here
```
*Note: You can get a free token from [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).*

### 3. Run Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Folder Structure
- `/app`: API routes and main page layout.
- `/components`: Reusable UI components (ChatBox, Selectors, etc.).
- `/lib`: Helper functions (Hugging Face API integration).
- `/public`: Static assets.

## 🌍 Deployment
This project is ready to be deployed on **Vercel**:
1. Push your code to GitHub.
2. Link your repository to Vercel.
3. Add `HUGGINGFACE_API_KEY` to the Environment Variables in the Vercel dashboard.

## 📝 License
Built for educational purposes. Feel free to use and modify!
