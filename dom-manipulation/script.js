// script.js

document.addEventListener("DOMContentLoaded", () => {
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const categoryFilter = document.createElement("select");
    categoryFilter.id = "categoryFilter";
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categoryFilter.addEventListener("change", filterQuotes);
    document.body.insertBefore(categoryFilter, quoteDisplay);

    async function fetchQuotesFromServer() {
        try {
            const response = await fetch("https://mockapi.example.com/quotes");
            const serverQuotes = await response.json();
            quotes = mergeQuotes(quotes, serverQuotes);
            saveQuotes();
            populateCategories();
            showRandomQuote();
        } catch (error) {
            console.error("Error fetching quotes:", error);
        }
    }

    function mergeQuotes(localQuotes, serverQuotes) {
        const uniqueQuotes = [...new Map([...serverQuotes, ...localQuotes].map(q => [q.text, q])).values()];
        return uniqueQuotes;
    }

    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    function showRandomQuote() {
        const filteredQuotes = getFilteredQuotes();
        if (filteredQuotes.length === 0) {
            quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
            return;
        }
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        quoteDisplay.innerHTML = `<p><strong>Category:</strong> ${quote.category}</p><p>"${quote.text}"</p>`;
        sessionStorage.setItem("lastQuote", JSON.stringify(quote));
    }

    function createAddQuoteForm() {
        const formContainer = document.createElement("div");
        formContainer.innerHTML = `
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button id="addQuoteBtn">Add Quote</button>
            <button id="exportJson">Export JSON</button>
            <input type="file" id="importFile" accept=".json" />
        `;
        document.body.appendChild(formContainer);
        document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
        document.getElementById("exportJson").addEventListener("click", exportToJsonFile);
        document.getElementById("importFile").addEventListener("change", importFromJsonFile);
    }

    async function addQuote() {
        const newQuoteText = document.getElementById("newQuoteText").value;
        const newQuoteCategory = document.getElementById("newQuoteCategory").value;
        
        if (newQuoteText && newQuoteCategory) {
            const newQuote = { text: newQuoteText, category: newQuoteCategory };
            quotes.push(newQuote);
            saveQuotes();
            populateCategories();
            document.getElementById("newQuoteText").value = "";
            document.getElementById("newQuoteCategory").value = "";
            alert("Quote added successfully!");
            showRandomQuote();
            
            try {
                await fetch("https://mockapi.example.com/quotes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newQuote)
                });
            } catch (error) {
                console.error("Error posting new quote:", error);
            }
        } else {
            alert("Please enter both a quote and a category.");
        }
    }

    function syncQuotes() {
        setInterval(fetchQuotesFromServer, 60000);
    }

    function populateCategories() {
        const categories = [...new Set(quotes.map(q => q.category))];
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        const lastSelectedCategory = localStorage.getItem("selectedCategory");
        if (lastSelectedCategory) {
            categoryFilter.value = lastSelectedCategory;
        }
    }

    function filterQuotes() {
        localStorage.setItem("selectedCategory", categoryFilter.value);
        showRandomQuote();
    }

    function getFilteredQuotes() {
        const selectedCategory = categoryFilter.value;
        return selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
    }

    newQuoteBtn.addEventListener("click", showRandomQuote);
    createAddQuoteForm();
    fetchQuotesFromServer();
    syncQuotes();
    populateCategories();
    showRandomQuote();
});
