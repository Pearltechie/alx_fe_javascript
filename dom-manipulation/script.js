// script.js

document.addEventListener("DOMContentLoaded", () => {
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" },
        { text: "Believe you can and you're halfway there.", category: "Inspiration" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const categoryFilter = document.createElement("select");
    categoryFilter.id = "categoryFilter";
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categoryFilter.addEventListener("change", filterQuotes);
    document.body.insertBefore(categoryFilter, quoteDisplay);

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

    function addQuote() {
        const newQuoteText = document.getElementById("newQuoteText").value;
        const newQuoteCategory = document.getElementById("newQuoteCategory").value;
        
        if (newQuoteText && newQuoteCategory) {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            saveQuotes();
            populateCategories();
            document.getElementById("newQuoteText").value = "";
            document.getElementById("newQuoteCategory").value = "";
            alert("Quote added successfully!");
            showRandomQuote(); // Update the displayed quote
        } else {
            alert("Please enter both a quote and a category.");
        }
    }

    function exportToJsonFile() {
        const dataStr = JSON.stringify(quotes, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "quotes.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            try {
                const importedQuotes = JSON.parse(event.target.result);
                if (Array.isArray(importedQuotes)) {
                    quotes = [...quotes, ...importedQuotes];
                    saveQuotes();
                    populateCategories();
                    alert('Quotes imported successfully!');
                    showRandomQuote();
                } else {
                    alert('Invalid JSON file format.');
                }
            } catch (error) {
                alert('Error parsing JSON file.');
            }
        };
        fileReader.readAsText(event.target.files[0]);
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
    createAddQuoteForm(); // Create form for adding quotes and import/export functionality
    populateCategories(); // Populate category filter
    showRandomQuote(); // Display an initial quote on load
});
