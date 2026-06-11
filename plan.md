# AI Assistant Integration Plan

## Objective
Integrate an AI Assistant into the Library Management Web Application to enhance user understanding, exploration, and learning from library content. The assistant will act as a study companion.

## Core Features to Implement:

1.  **Ask Anything:**
    *   General Q&A system for books, topics, and courses.
    *   Natural language conversation support.
    *   Clear, simple explanations.

2.  **Book-Based AI:**
    *   Ability to answer questions contextually based on the currently opened book (e.g., "Explain chapter 2").
    *   Summarization of specific book sections or entire PDFs.

3.  **Smart Summarization:**
    *   Summarize entire PDFs, chapters, or selected text.
    *   Provide short summaries, key points, and easy explanations.

4.  **Study Mode:**
    *   Generate quiz questions.
    *   Create flashcards.
    *   Provide revision notes.

5.  **Smart Search Assistant:**
    *   Suggest relevant books, topics, and sections based on user search queries.

## User Access Levels:

*   **Guest:** Limited AI usage (e.g., 3 questions/day). Basic responses. Display a message encouraging login for full access.
*   **Member:** Full AI access, unlimited chat, book-based AI features.
*   **Admin:** Monitor usage and control limits (implementation details for Admin may be deferred or simplified).

## Technical Implementation:

### Frontend (React):

*   **`src/App.tsx`:**
    *   Integrate a floating chatbot button.
    *   Manage the visibility and state of the expandable chat window.
    *   Preserve existing routing, authentication, and navigation.
*   **`src/components/AIChatWindow.tsx` (New Component):**
    *   Develop a reusable chat interface component.
    *   Handle user message input, display user/AI message bubbles.
    *   Implement typing indicators ("AI is thinking...").
    *   Integrate with AI backend functions.
*   **`src/hooks/use-store.ts` (or new hook):**
    *   Update state management to include:
        *   Chat history.
        *   User query and AI responses.
        *   Current book context.
        *   Guest usage limits (counter, daily reset logic).
*   **Styling:**
    *   Apply the existing dark neon theme, glassmorphism, and smooth animations to the chat UI.
    *   Ensure a clean, minimal chat interface.

### Backend (Firebase Functions):

*   **New or Modified Function (e.g., `askAI`):**
    *   Handle incoming user queries and context.
    *   Communicate with an external AI API (e.g., OpenAI).
    *   Return AI responses.
*   **Usage Limit Enforcement:**
    *   Implement logic within functions to track and enforce usage limits for guest users.
*   **Security:**
    *   Securely manage AI API keys (e.g., using environment variables in Firebase Functions).
    *   Validate all inputs to prevent abuse.

### Data Storage (Optional):

*   Consider using Firestore to store chat history for logged-in users to maintain long-term context across sessions.

## Development Steps:

1.  **Plan Definition:** Document the integration plan (this file).
2.  **Frontend Development:**
    *   Create the `AIChatWindow.tsx` component.
    *   Implement the floating chat button and integrate the window into `App.tsx`.
    *   Update `use-store.ts` for state management.
    *   Apply styling.
3.  **Backend Development:**
    *   Set up and deploy the necessary Firebase Functions (`askAI`, usage limit logic).
    *   Securely configure API keys.
4.  **Integration & Testing:**
    *   Connect frontend components to backend functions.
    *   Test all features across different user access levels (Guest, Member).
    *   Verify context awareness, summarization, study mode, and search assistance.
    *   Validate guest usage limits and prompts.
5.  **Final Validation:** Run `validate_build` to ensure the integration is successful.

## Risks & Mitigation:

*   **AI API Costs:** Monitor usage, implement stricter limits if necessary.
*   **Rate Limiting:** Implement retry logic or backoff strategies.
*   **Context Management Complexity:** Careful state management and API call design.
*   **Security of API Keys:** Strict adherence to Firebase Functions security practices.
