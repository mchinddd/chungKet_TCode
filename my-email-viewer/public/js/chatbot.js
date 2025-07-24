let conversationHistory = [];

function setupChatbot() {
  const chatbotToggleButton = document.getElementById("chatbot-toggle-button");
  const chatbotWindow = document.getElementById("chatbot-window");
  const chatbotCloseButton = document.getElementById("chatbot-close-button");
  const chatbotForm = document.getElementById("chatbot-form");
  const chatbotInput = document.getElementById("chatbot-input");
  const chatbotMessages = document.getElementById("chatbot-messages");

  if (chatbotToggleButton && chatbotWindow) {
    chatbotToggleButton.addEventListener("click", () => {
      chatbotWindow.classList.toggle("hidden");
    });
  }

  if (chatbotCloseButton) {
    chatbotCloseButton.addEventListener("click", () => {
      chatbotWindow.classList.add("hidden");
    });
  }

  function addMessage(message, className) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${className}`;
    const messageP = document.createElement("div");
    messageP.innerHTML = marked.parse(message); // Chuyển Markdown sang HTML
    messageDiv.appendChild(messageP);
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  if (chatbotForm) {
    chatbotForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const userMessage = chatbotInput.value.trim();
      if (!userMessage) return;

      addMessage(userMessage, "user-message");
      chatbotInput.value = "";

      conversationHistory.push({
        role: "user",
        parts: [{ text: userMessage }],
      });

      try {
        const response = await fetch("/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationHistory }),
        });

        if (!response.ok) throw new Error("Request failed");

        const data = await response.json();
        const botMessage = data.candidates[0].content.parts[0].text;

        addMessage(botMessage, "bot-message");

        conversationHistory.push({
          role: "model",
          parts: [{ text: botMessage }],
        });
      } catch (error) {
        console.error(error);
        addMessage(
          "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
          "bot-message"
        );
      }
    });
  }
}
document.addEventListener("DOMContentLoaded", setupChatbot);
