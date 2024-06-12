let lastTopic = null;
let welcomeMoved = false;

function sendMessage() {
    const inputField = document.getElementById('inputField');
    const message = inputField.value.trim();
    inputField.value = '';  // Clear input field

    if (!welcomeMoved) {
        moveWelcomeText();
        welcomeMoved = true;
    }

    displayMessage(message, 'You');  // Display user's message

    simulateTyping();
    setTimeout(() => {
        if (needsSearch(message)) {
            fetchWikipediaSummary(message);
        } else {
            const response = generateResponse(message);
            displayMessage(response, 'Bot');
        }
    }, 2000);  // Delay response for 2 seconds to simulate processing
}

function needsSearch(query) {
    // Simple heuristic to decide when to search
    return query.toLowerCase().includes("what is") || 
           query.toLowerCase().includes("who is") || 
           query.toLowerCase().includes("tell me about") || 
           query.toLowerCase().includes("define") || 
           query.toLowerCase().includes("where is") ||
           query.toLowerCase().includes("when is");
}

function fetchWikipediaSummary(query) {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&origin=*&titles=${encodeURIComponent(query)}`;

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            const pages = data.query.pages;
            const page = Object.values(pages)[0];
            if (page.extract) {
                displayMessage(page.extract, 'Bot');
            } else {
                displayMessage("Sorry, I couldn't find anything relevant on Wikipedia.", 'Bot');
            }
        })
        .catch(error => {
            console.error('Error fetching data from Wikipedia:', error);
            displayMessage("Failed to fetch data.", 'Bot');
        });
}

function simulateTyping() {
    const responseDiv = document.getElementById('chatbox');
    const typingDiv = document.createElement('div');
    typingDiv.textContent = "Generating response...";
    typingDiv.className = "typing";
    responseDiv.appendChild(typingDiv);
    setTimeout(() => {
        responseDiv.removeChild(typingDiv);
    }, 1800);  // Remove typing animation just before showing the response
}

function generateResponse(input) {
    const lowerInput = input.toLowerCase();

    // Expanded responses
    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
        return chooseRandom([
            "Hello there! How can I assist you today?",
            "Hi! What can I help you with?"
        ]);
    } else if (lowerInput.includes("how are you")) {
        return "I'm doing great, thank you! What about you?";
    } else if (lowerInput.includes("what is your name")) {
        return "I am ChatGPT, your virtual assistant.";
    } else if (lowerInput.includes("how many states are there in india")) {
        return "India has 28 states and 8 Union territories.";
    } else if (lowerInput.includes("current version")) {
        return "You are interacting with a simplified version of ChatGPT.";
    } else if (lowerInput.includes("thank")) {
        return "You're welcome!";
    } else if (lowerInput.includes("help")) {
        lastTopic = 'help';
        return "You can just chat with me or ask for help on general topics!";
    } else if (lowerInput.includes("about you")) {
        return "I am ChatGPT, an AI developed by OpenAI, here to assist you with various questions and tasks.";
    } else if (lowerInput.includes("who created you")) {
        return "I was created by OpenAI, an AI research and deployment company.";
    } else if (lowerInput.includes("where are you from")) {
        return "I exist in the cloud, powered by OpenAI's servers.";
    } else if (lowerInput.includes("what can you do")) {
        return "I can answer questions, provide information, help with tasks, and chat with you on various topics.";
    } else if (lowerInput.includes("india")) {
        return "India is a country in South Asia. It is known for its rich culture, history, and diversity.";
    } else {
        return handleFallback(lowerInput);
    }
}

function handleFallback(input) {
    if (lastTopic === 'help') {
        return "I'm here to help! What would you like to know more about?";
    } else {
        return "I'm not sure how to respond to that. Can you try asking something else?";
    }
}

function chooseRandom(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

function displayMessage(message, sender) {
    const responseDiv = document.getElementById('chatbox');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `${sender}: ${message}`;
    messageDiv.className = `message ${sender.toLowerCase()}`; // Adds 'user' or 'bot' class
    responseDiv.appendChild(messageDiv);
    responseDiv.scrollTop = responseDiv.scrollHeight; // Auto-scroll to the latest message
}

function moveWelcomeText() {
    const welcomeText = document.getElementById('welcomeText');
    welcomeText.classList.add('move-to-top'); // Add class for transition
    welcomeText.style.color = "#3b3b3b";
}
