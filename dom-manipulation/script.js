// script.js

document.addEventListener("DOMContentLoaded", () => {
    const quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" },
        { text: "Believe you can and you're halfway there.", category: "Inspiration" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");

    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p><strong>Category:</strong> ${quote.category}</p><p>"${quote.text}"</p>`;
    }

    function createAddQuoteForm() {
        const formContainer = document.createElement("div");
        formContainer.innerHTML = `
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button id="addQuoteBtn">Add Quote</button>
        `;
        document.body.appendChild(formContainer);
        document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
    }

    function addQuote() {
        const newQuoteText = document.getElementById("newQuoteText").value;
        const newQuoteCategory = document.getElementById("newQuoteCategory").value;
        
        if (newQuoteText && newQuoteCategory) {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            document.getElementById("newQuoteText").value = "";
            document.getElementById("newQuoteCategory").value = "";
            alert("Quote added successfully!");
            showRandomQuote(); // Update the displayed quote
        } else {
            alert("Please enter both a quote and a category.");
        }
    }

    newQuoteBtn.addEventListener("click", showRandomQuote);
    createAddQuoteForm(); // Create form for adding quotes
    showRandomQuote(); // Display an initial quote on load
});
