let transactions = [

    {
        id: 1,
        title: "Monthly Salary",
        amount: 45000,
        type: "income",
        category: "Income"
    },

    {
        id: 2,
        title: "Rent",
        amount: 8000,
        type: "expense",
        category: "Rent"
    },

    {
        id: 3,
        title: "Groceries",
        amount: 3500,
        type: "expense",
        category: "Food"
    },

    {
        id: 4,
        title: "Metro",
        amount: 1200,
        type: "expense",
        category: "Travel"
    },

    {
        id: 5,
        title: "New Shoes",
        amount: 2500,
        type: "expense",
        category: "Shopping"
    },

    {
        id: 6,
        title: "Mutual Fund",
        amount: 5000,
        type: "expense",
        category: "Investment"
    }
];


const balanceElement =
    document.getElementById("balance");

const incomeElement =
    document.getElementById("income");

const expensesElement =
    document.getElementById("expenses");

const savingsElement =
    document.getElementById("savings");

const savingsRateElement =
    document.getElementById("savingsRate");

const transactionsList =
    document.getElementById("transactionsList");

const categoriesList =
    document.getElementById("categoriesList");


// Modal

const modal =
    document.getElementById("transactionModal");

const openTransactionBtn =
    document.getElementById("openTransactionBtn");

const openTransactionBtn2 =
    document.getElementById("openTransactionBtn2");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const transactionForm =
    document.getElementById("transactionForm");


// ============================
// OPEN / CLOSE MODAL
// ============================

openTransactionBtn.addEventListener(
    "click",
    openModal
);

openTransactionBtn2.addEventListener(
    "click",
    openModal
);


closeModalBtn.addEventListener(
    "click",
    closeModal
);


function openModal() {

    modal.classList.remove("hidden");
}


function closeModal() {

    modal.classList.add("hidden");

    transactionForm.reset();
}


// Close when clicking outside

modal.addEventListener("click", (event) => {

    if (event.target === modal) {

        closeModal();

    }

});


// ============================
// CALCULATE SUMMARY
// ============================

function calculateSummary() {

    let income = 0;

    let expenses = 0;


    transactions.forEach(transaction => {

        if (transaction.type === "income") {

            income += transaction.amount;

        } else {

            expenses += transaction.amount;

        }

    });


    const savings = income - expenses;


    const savingsRate =
        income > 0
            ? (savings / income) * 100
            : 0;


    balanceElement.textContent =
        formatCurrency(savings);


    incomeElement.textContent =
        formatCurrency(income);


    expensesElement.textContent =
        formatCurrency(expenses);


    savingsElement.textContent =
        formatCurrency(savings);


    savingsRateElement.textContent =
        `${savingsRate.toFixed(1)}% savings rate`;

}


// ============================
// RENDER TRANSACTIONS
// ============================

function renderTransactions() {

    transactionsList.innerHTML = "";


    const recentTransactions =
        [...transactions]
        .reverse()
        .slice(0, 8);


    recentTransactions.forEach(transaction => {

        const transactionElement =
            document.createElement("div");


        transactionElement.classList.add(
            "transaction"
        );


        const icon =
            getCategoryIcon(transaction.category);


        const sign =
            transaction.type === "income"
                ? "+"
                : "-";


        transactionElement.innerHTML = `

            <div class="transaction-left">

                <div class="transaction-icon">
                    ${icon}
                </div>

                <div class="transaction-info">

                    <h3>
                        ${transaction.title}
                    </h3>

                    <p>
                        ${transaction.category}
                    </p>

                </div>

            </div>


            <div class="transaction-right">

                <span
                    class="transaction-amount
                    ${transaction.type}"
                >
                    ${sign}${formatCurrency(transaction.amount)}
                </span>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})"
                >
                    🗑
                </button>

            </div>

        `;


        transactionsList.appendChild(
            transactionElement
        );

    });

}


// ============================
// DELETE TRANSACTION
// ============================

function deleteTransaction(id) {

    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );


    updateDashboard();

}


// ============================
// CATEGORY CALCULATION
// ============================

function calculateCategories() {

    const categories = {};


    transactions.forEach(transaction => {

        if (transaction.type !== "expense") {

            return;

        }


        if (!categories[transaction.category]) {

            categories[transaction.category] = 0;

        }


        categories[transaction.category] +=
            transaction.amount;

    });


    return categories;
}


// ============================
// RENDER CATEGORIES
// ============================

function renderCategories() {

    categoriesList.innerHTML = "";


    const categories =
        calculateCategories();


    const totalExpenses =
        Object.values(categories)
        .reduce(
            (total, amount) =>
                total + amount,
            0
        );


    const sortedCategories =
        Object.entries(categories)
        .sort(
            (a, b) =>
                b[1] - a[1]
        );


    sortedCategories.forEach(
        ([category, amount]) => {

            const percentage =
                totalExpenses > 0
                    ? (amount / totalExpenses) * 100
                    : 0;


            const categoryElement =
                document.createElement("div");


            categoryElement.classList.add(
                "category-item"
            );


            categoryElement.innerHTML = `

                <div class="category-top">

                    <span class="category-name">

                        ${getCategoryIcon(category)}

                        ${category}

                    </span>

                    <span class="category-amount">

                        ${formatCurrency(amount)}

                    </span>

                </div>


                <div class="progress">

                    <div
                        class="progress-bar"
                        style="width: ${percentage}%"
                    ></div>

                </div>


                <span class="category-percentage">

                    ${percentage.toFixed(1)}%

                </span>

            `;


            categoriesList.appendChild(
                categoryElement
            );

        }
    );

}


// ============================
// ADD TRANSACTION
// ============================

transactionForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const title =
            document.getElementById(
                "transactionTitle"
            ).value.trim();


        const amount =
            Number(
                document.getElementById(
                    "transactionAmount"
                ).value
            );


        const type =
            document.getElementById(
                "transactionType"
            ).value;


        const category =
            document.getElementById(
                "transactionCategory"
            ).value;


        if (!title || amount <= 0) {

            return;

        }


        const transaction = {

            id: Date.now(),

            title,

            amount,

            type,

            category

        };


        transactions.push(
            transaction
        );


        updateDashboard();

        closeModal();

    }
);


// ============================
// UPDATE EVERYTHING
// ============================

function updateDashboard() {

    calculateSummary();

    renderTransactions();

    renderCategories();

}


// ============================
// HELPERS
// ============================

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(amount);

}


function getCategoryIcon(category) {

    const icons = {

        Food: "🍕",

        Rent: "🏠",

        Travel: "✈️",

        Shopping: "🛍️",

        Investment: "📈",

        Emergency: "💰",

        Other: "📦",

        Income: "💵"

    };


    return icons[category] || "📦";

}


// Initial render

updateDashboard();