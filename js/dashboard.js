let categories = [
    {
        name: "Food",
        icon: "🍕"
    },
    {
        name: "Rent",
        icon: "🏠"
    },
    {
        name: "Travel",
        icon: "✈️"
    },
    {
        name: "Shopping",
        icon: "🛍️"
    },
    {
        name: "Investment",
        icon: "📈"
    },
    {
        name: "Emergency",
        icon: "💰"
    },
    {
        name: "Other",
        icon: "📦"
    }
];

const openCategoryBtn =
    document.getElementById("openCategoryBtn");

const categoryModal =
    document.getElementById("categoryModal");

const closeCategoryModalBtn =
    document.getElementById("closeCategoryModalBtn");

const categoryForm =
    document.getElementById("categoryForm");

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

const exportBtn =
    document.getElementById("exportBtn");

const filterBtn =
    document.getElementById("filterBtn");

const filterPanel =
    document.getElementById("filterPanel");

const filterType =
    document.getElementById("filterType");

const filterCategory =
    document.getElementById("filterCategory");

// Modal

const modal =
    document.getElementById("transactionModal");

const openTransactionBtn2 =
    document.getElementById("openTransactionBtn2");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const transactionForm =
    document.getElementById("transactionForm");

// ============================
// LOCAL STORAGE
// ============================

const currentUser =
    localStorage.getItem("currentUser") || "guest";

const storageKey =
    `skyperMoney_${currentUser}`;


const savedData =
    JSON.parse(
        localStorage.getItem(storageKey)
    );


let transactions =
    savedData?.transactions || [];

// ============================
// OPEN / CLOSE MODAL
// ============================

openCategoryBtn.addEventListener(
    "click",
    () => {
        categoryModal.classList.remove("hidden");
    }
);

closeCategoryModalBtn.addEventListener(
    "click",
    () => {
        categoryModal.classList.add("hidden");
        categoryForm.reset();
    }
);

categoryModal.addEventListener(
    "click",
    (event) => {

        if (event.target === categoryModal) {

            categoryModal.classList.add("hidden");

            categoryForm.reset();

        }

    }
);

categoryForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const name =
            document.getElementById(
                "categoryName"
            ).value.trim();


        const icon =
            document.getElementById(
                "categoryIcon"
            ).value.trim() || "📦";


        if (!name) {
            return;
        }


        categories.push({
            name,
            icon
        });


        updateCategoryOptions();


        categoryModal.classList.add("hidden");

        categoryForm.reset();

    }
);

filterBtn.addEventListener("click", () => {
    filterPanel.classList.toggle("hidden");
});

filterType.addEventListener(
    "change",
    renderTransactions
);

filterCategory.addEventListener(
    "change",
    renderTransactions
);

openTransactionBtn2.addEventListener(
    "click",
    openModal
);


closeModalBtn.addEventListener(
    "click",
    closeModal
);

exportBtn.addEventListener(
    "click",
    exportReport
);

// ====================================
// ===========FUNCTIONS================
// ===================================

function saveData() {

    const data = {

        transactions: transactions

    };


    localStorage.setItem(
        storageKey,
        JSON.stringify(data)
    );

}

function updateCategoryOptions() {

    const categorySelect =
        document.getElementById(
            "transactionCategory"
        );


    categorySelect.innerHTML = "";


    categories.forEach(category => {

        const option =
            document.createElement("option");


        option.value = category.name;

        option.textContent =
            `${category.icon} ${category.name}`;


        categorySelect.appendChild(option);

    });

}

function exportReport() {

    const headers = [
        "Title",
        "Amount",
        "Type",
        "Category"
    ];
    const rows = transactions.map(
        transaction => [
            transaction.title,
            transaction.amount,
            transaction.type,
            transaction.category
        ]
    );
    const csv = [
        headers,
        ...rows
    ]
    .map(row =>
        row.join(",")
    )
    .join("\n");
    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv"
            }
        );
    const url =
        URL.createObjectURL(blob);
    const link =
        document.createElement("a");
    link.href = url;
    link.download =
        "skyper-money-report.csv";
    link.click();
    URL.revokeObjectURL(url);

}

function openModal() {
    modal.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
    transactionForm.reset();
}


// Close when clicking- outside

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

const users =
    JSON.parse(
        localStorage.getItem("users")
    ) || [];

const loggedInUser =
    users.find(
        user => user.email === currentUser
    );


if (loggedInUser) {

    document.getElementById(
        "welcomeMessage"
    ).textContent =
        `Good morning, ${loggedInUser.name} 👋`;


    const profileBtn =
        document.getElementById("profileBtn");

    profileBtn.textContent =
        loggedInUser.name
            .charAt(0)
            .toUpperCase();

}


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

    let filteredTransactions = [...transactions];


    // Filter by type
    // Filter by type

    if (filterType.value !== "all") {

        filteredTransactions =
            filteredTransactions.filter(
                transaction =>
                    transaction.type === filterType.value
            );

    }


    // Filter by category

    if (filterCategory.value !== "all") {

        filteredTransactions =
            filteredTransactions.filter(
                transaction =>
                    transaction.category === filterCategory.value
            );

    }


    const recentTransactions =
        filteredTransactions
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
                    class="transaction-amount ${transaction.type}"
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

    saveData();

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

        saveData();

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