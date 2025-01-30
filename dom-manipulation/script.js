document.addEventListener("DOMContentLoaded", () => {
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" },
        { text: "Believe you can and you're halfway there.", category: "Inspiration" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const categoryFilter = document.getElementById("categoryFilter");
    const newQuoteBtn = document.getElementById("newQuote");
    const addQuoteBtn = document.getElementById("addQuoteBtn");

    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    function populateCategories() {
        const categories = [...new Set(quotes.map(q => q.category))];
        categoryFilter.innerHTML = '<option value="all">All Categories</option>' +
            categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
        
        const lastFilter = localStorage.getItem("selectedCategory") || "all";
        categoryFilter.value = lastFilter;
    }

    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem("selectedCategory", selectedCategory);
        
        const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
        
        if (filteredQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            const quote = filteredQuotes[randomIndex];
            quoteDisplay.innerHTML = `<p><strong>Category:</strong> ${quote.category}</p><p>"${quote.text}"</p>`;
        } else {
            quoteDisplay.innerHTML = `<p>No quotes available for this category.</p>`;
        }
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
            filterQuotes();
        } else {
            alert("Please enter both a quote and a category.");
        }
    }

    newQuoteBtn.addEventListener("click", filterQuotes);
    addQuoteBtn.addEventListener("click", addQuote);
    categoryFilter.addEventListener("change", filterQuotes);

    populateCategories();
    filterQuotes();
});
