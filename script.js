// ============================================
// FINTRACK V2
// COMPLETE JAVASCRIPT
// ============================================


// ============================================
// 1. DOM ELEMENTS
// ============================================

const transactionForm = document.getElementById("transactionForm");

const transactionName = document.getElementById("transactionName");
const transactionAmount = document.getElementById("transactionAmount");
const transactionCategory = document.getElementById("transactionCategory");
const transactionDate = document.getElementById("transactionDate");

const transactionsList = document.getElementById("transactionsList");


// Dashboard
const balanceElement = document.getElementById("balance");
const totalIncomeElement = document.getElementById("totalIncome");
const totalExpenseElement = document.getElementById("totalExpense");

const monthlyIncomeElement = document.getElementById("monthlyIncome");
const monthlyExpenseElement = document.getElementById("monthlyExpense");

const transactionCountElement =
    document.getElementById("transactionCount");

const balanceDescription =
    document.getElementById("balanceDescription");


// Filters
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const categoryFilter = document.getElementById("categoryFilter");


// Chart
const categoryChart = document.getElementById("categoryChart");
const chartTotal = document.getElementById("chartTotal");
const chartPeriod = document.getElementById("chartPeriod");


// Transaction type buttons
const typeButtons = document.querySelectorAll(".type-btn");


// Edit modal
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");

const editName = document.getElementById("editName");
const editAmount = document.getElementById("editAmount");
const editCategory = document.getElementById("editCategory");
const editDate = document.getElementById("editDate");

const closeModal = document.getElementById("closeModal");
const cancelEdit = document.getElementById("cancelEdit");


// Budget
const budgetModal = document.getElementById("budgetModal");
const budgetForm = document.getElementById("budgetForm");
const budgetAmount = document.getElementById("budgetAmount");

const setBudgetBtn = document.getElementById("setBudgetBtn");
const closeBudgetModal = document.getElementById("closeBudgetModal");
const cancelBudget = document.getElementById("cancelBudget");

const budgetSpent = document.getElementById("budgetSpent");
const budgetLimit = document.getElementById("budgetLimit");
const budgetProgress = document.getElementById("budgetProgress");
const budgetStatus = document.getElementById("budgetStatus");


// Other
const scrollToFormBtn =
    document.getElementById("scrollToFormBtn");

const exportBtn =
    document.getElementById("exportBtn");

const themeBtn =
    document.getElementById("themeBtn");

const toast =
    document.getElementById("toast");


// ============================================
// 2. APP STATE
// ============================================

let transactions = [];

let currentType = "expense";

let editingTransactionId = null;

let monthlyBudget =
    Number(localStorage.getItem("fintrackBudget")) || 0;


// ============================================
// 3. CATEGORIES
// ============================================

const expenseCategories = [

    {
        name: "Food",
        icon: "🍔"
    },

    {
        name: "Shopping",
        icon: "🛍️"
    },

    {
        name: "Transport",
        icon: "🚗"
    },

    {
        name: "Entertainment",
        icon: "🎬"
    },

    {
        name: "Bills",
        icon: "💡"
    },

    {
        name: "Health",
        icon: "❤️"
    },

    {
        name: "Other",
        icon: "📦"
    }

];


const incomeCategories = [

    {
        name: "Salary",
        icon: "💼"
    },

    {
        name: "Freelance",
        icon: "💻"
    },

    {
        name: "Business",
        icon: "🏢"
    },

    {
        name: "Investment",
        icon: "📈"
    },

    {
        name: "Gift",
        icon: "🎁"
    },

    {
        name: "Other",
        icon: "📦"
    }

];


// ============================================
// 4. INITIALIZE APP
// ============================================

function initializeApp() {

    // Load saved data FIRST
    loadTransactions();

    // Load other saved settings
    loadTheme();

    // Set today's date
    setTodayDate();

    // Populate categories
    updateCategoryOptions();
    updateEditCategoryOptions();
    updateFilterCategories();

    // Render everything
    renderTransactions();
    updateDashboard();
    renderChart();
    updateBudgetUI();

}


// ============================================
// 5. LOAD TRANSACTIONS
// ============================================

function loadTransactions() {

    try {

        // ----------------------------------------
        // V2 DATA
        // ----------------------------------------

        const savedData =
            localStorage.getItem(
                "fintrackTransactions"
            );


        if (savedData) {

            const parsedData =
                JSON.parse(savedData);


            if (Array.isArray(parsedData)) {

                transactions =
                    parsedData;

            } else {

                transactions = [];

            }


            console.log(
                "FinTrack: Transactions loaded.",
                transactions
            );


            return;

        }


        // ----------------------------------------
        // V1 DATA MIGRATION
        // ----------------------------------------

        const oldData =
            localStorage.getItem(
                "fintrackExpenses"
            );


        if (oldData) {

            const oldExpenses =
                JSON.parse(oldData);


            if (Array.isArray(oldExpenses)) {

                transactions =
                    oldExpenses.map(
                        function (expense) {

                            return {

                                id:
                                    expense.id ||
                                    Date.now() +
                                    Math.random(),

                                name:
                                    expense.name,

                                amount:
                                    Number(
                                        expense.amount
                                    ),

                                category:
                                    expense.category,

                                type:
                                    "expense",

                                date:
                                    expense.date

                            };

                        }
                    );


                // Save migrated V1 data
                saveTransactions();


                showToast(
                    "Your V1 data has been migrated."
                );


                return;

            }

        }


        // ----------------------------------------
        // NO DATA
        // ----------------------------------------

        transactions = [];


    } catch (error) {

        console.error(
            "Error loading transactions:",
            error
        );


        transactions = [];

    }

}


// ============================================
// 6. SAVE TRANSACTIONS
// ============================================

function saveTransactions() {

    try {

        localStorage.setItem(

            "fintrackTransactions",

            JSON.stringify(
                transactions
            )

        );


        console.log(
            "FinTrack: Transactions saved."
        );


    } catch (error) {

        console.error(
            "Error saving transactions:",
            error
        );

    }

}


// ============================================
// 7. SET TODAY'S DATE
// ============================================

function setTodayDate() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    transactionDate.value =
        today;

}


// ============================================
// 8. TRANSACTION TYPE SWITCH
// ============================================

typeButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                currentType =
                    button.dataset.type;


                typeButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                updateCategoryOptions();

            }
        );

    }
);


// ============================================
// 9. UPDATE CATEGORY OPTIONS
// ============================================

function updateCategoryOptions() {

    const categories =
        currentType === "income"
            ? incomeCategories
            : expenseCategories;


    transactionCategory.innerHTML = `

        <option value="">
            Select category
        </option>

    `;


    categories.forEach(
        function (category) {

            transactionCategory.innerHTML += `

                <option value="${category.name}">
                    ${category.icon}
                    ${category.name}
                </option>

            `;

        }
    );

}


// ============================================
// 10. UPDATE EDIT CATEGORY OPTIONS
// ============================================

function updateEditCategoryOptions() {

    const allCategories = [

        ...expenseCategories,
        ...incomeCategories

    ];


    const uniqueCategories = [

        ...new Map(

            allCategories.map(
                function (category) {

                    return [
                        category.name,
                        category
                    ];

                }
            )

        ).values()

    ];


    editCategory.innerHTML = "";


    uniqueCategories.forEach(
        function (category) {

            editCategory.innerHTML += `

                <option value="${category.name}">
                    ${category.icon}
                    ${category.name}
                </option>

            `;

        }
    );

}


// ============================================
// 11. ADD TRANSACTION
// ============================================

transactionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            transactionName.value.trim();

        const amount =
            Number(
                transactionAmount.value
            );

        const category =
            transactionCategory.value;

        const date =
            transactionDate.value;


        // Validation

        if (
            !name ||
            !amount ||
            amount <= 0 ||
            !category ||
            !date
        ) {

            showToast(
                "Please complete all fields."
            );

            return;

        }


        // Create transaction

        const transaction = {

            id:
                Date.now(),

            name:
                name,

            amount:
                amount,

            category:
                category,

            type:
                currentType,

            date:
                date

        };


        // Add to array

        transactions.push(
            transaction
        );


        // SAVE IMMEDIATELY

        saveTransactions();


        // Update UI

        renderTransactions();

        updateDashboard();

        renderChart();

        updateBudgetUI();


        // Reset form

        transactionForm.reset();

        setTodayDate();

        updateCategoryOptions();


        // Notification

        if (
            currentType === "income"
        ) {

            showToast(
                "Income added successfully."
            );

        } else {

            showToast(
                "Expense added successfully."
            );

        }

    }
);


// ============================================
// 12. GET FILTERED TRANSACTIONS
// ============================================

function getFilteredTransactions() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedType =
        typeFilter.value;


    const selectedCategory =
        categoryFilter.value;


    return transactions.filter(
        function (transaction) {

            const matchesSearch =
                transaction.name
                    .toLowerCase()
                    .includes(search);


            const matchesType =
                selectedType === "all" ||
                transaction.type === selectedType;


            const matchesCategory =
                selectedCategory === "all" ||
                transaction.category === selectedCategory;


            return (
                matchesSearch &&
                matchesType &&
                matchesCategory
            );

        }
    );

}


// ============================================
// 13. RENDER TRANSACTIONS
// ============================================

function renderTransactions() {

    const filteredTransactions =
        getFilteredTransactions();


    transactionsList.innerHTML =
        "";


    if (
        filteredTransactions.length === 0
    ) {

        transactionsList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    💸
                </div>

                <h3>
                    No transactions found
                </h3>

                <p>
                    Add a transaction or adjust your filters.
                </p>

            </div>

        `;

        return;

    }


    // Newest first

    const sortedTransactions =
        [...filteredTransactions].sort(
            function (a, b) {

                return (
                    new Date(b.date) -
                    new Date(a.date)
                );

            }
        );


    sortedTransactions.forEach(
        function (transaction) {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "transaction";


            const isIncome =
                transaction.type === "income";


            const sign =
                isIncome
                    ? "+"
                    : "-";


            const amountClass =
                isIncome
                    ? "income-amount"
                    : "expense-amount";


            element.innerHTML = `

                <div class="transaction-info">

                    <div
                        class="transaction-icon ${getCategoryClass(
                            transaction.category
                        )}"
                    >

                        ${getCategoryIcon(
                            transaction.category
                        )}

                    </div>


                    <div>

                        <h3>
                            ${escapeHTML(
                                transaction.name
                            )}
                        </h3>

                        <p>

                            ${escapeHTML(
                                transaction.category
                            )}

                            •

                            ${formatDate(
                                transaction.date
                            )}

                            •

                            ${
                                isIncome
                                    ? "Income"
                                    : "Expense"
                            }

                        </p>

                    </div>

                </div>


                <div class="transaction-right">

                    <span class="${amountClass}">

                        ${sign}$${Number(
                            transaction.amount
                        ).toFixed(2)}

                    </span>


                    <div class="transaction-actions">

                        <button
                            class="edit-btn"
                            type="button"
                            onclick="openEditModal(${transaction.id})"
                            title="Edit"
                        >
                            ✎
                        </button>


                        <button
                            class="delete-btn"
                            type="button"
                            onclick="deleteTransaction(${transaction.id})"
                            title="Delete"
                        >
                            ×
                        </button>

                    </div>

                </div>

            `;


            transactionsList.appendChild(
                element
            );

        }
    );

}


// ============================================
// 14. UPDATE DASHBOARD
// ============================================

function updateDashboard() {

    // ----------------------------------------
    // TOTAL INCOME
    // ----------------------------------------

    const totalIncome =
        transactions
            .filter(
                function (transaction) {

                    return (
                        transaction.type ===
                        "income"
                    );

                }
            )
            .reduce(
                function (
                    total,
                    transaction
                ) {

                    return (
                        total +
                        Number(
                            transaction.amount
                        )
                    );

                },
                0
            );


    // ----------------------------------------
    // TOTAL EXPENSE
    // ----------------------------------------

    const totalExpenses =
        transactions
            .filter(
                function (transaction) {

                    return (
                        transaction.type ===
                        "expense"
                    );

                }
            )
            .reduce(
                function (
                    total,
                    transaction
                ) {

                    return (
                        total +
                        Number(
                            transaction.amount
                        )
                    );

                },
                0
            );


    // ----------------------------------------
    // BALANCE
    // ----------------------------------------

    const balance =
        totalIncome -
        totalExpenses;


    // ----------------------------------------
    // CURRENT MONTH
    // ----------------------------------------

    const now =
        new Date();

    const currentMonth =
        now.getMonth();

    const currentYear =
        now.getFullYear();


    const monthlyIncome =
        transactions
            .filter(
                function (transaction) {

                    const date =
                        new Date(
                            `${transaction.date}T00:00:00`
                        );


                    return (

                        transaction.type ===
                            "income" &&

                        date.getMonth() ===
                            currentMonth &&

                        date.getFullYear() ===
                            currentYear

                    );

                }
            )
            .reduce(
                function (
                    total,
                    transaction
                ) {

                    return (
                        total +
                        Number(
                            transaction.amount
                        )
                    );

                },
                0
            );


    const monthlyExpense =
        transactions
            .filter(
                function (transaction) {

                    const date =
                        new Date(
                            `${transaction.date}T00:00:00`
                        );


                    return (

                        transaction.type ===
                            "expense" &&

                        date.getMonth() ===
                            currentMonth &&

                        date.getFullYear() ===
                            currentYear

                    );

                }
            )
            .reduce(
                function (
                    total,
                    transaction
                ) {

                    return (
                        total +
                        Number(
                            transaction.amount
                        )
                    );

                },
                0
            );


    // ----------------------------------------
    // UPDATE UI
    // ----------------------------------------

    balanceElement.textContent =
        formatCurrency(
            balance
        );


    totalIncomeElement.textContent =
        formatCurrency(
            totalIncome
        );


    totalExpenseElement.textContent =
        formatCurrency(
            totalExpenses
        );


    monthlyIncomeElement.textContent =
        formatCurrency(
            monthlyIncome
        );


    monthlyExpenseElement.textContent =
        formatCurrency(
            monthlyExpense
        );


    transactionCountElement.textContent =
        transactions.length;


    // ----------------------------------------
    // BALANCE STATUS
    // ----------------------------------------

    if (
        balance < 0
    ) {

        balanceElement.style.color =
            "var(--red)";


        balanceDescription.textContent =
            "You're spending more than you earn.";

    } else {

        balanceElement.style.color =
            "var(--text)";


        balanceDescription.textContent =
            "Available balance";

    }

}


// ============================================
// 15. DELETE TRANSACTION
// ============================================

function deleteTransaction(id) {

    const transaction =
        transactions.find(
            function (item) {

                return (
                    item.id === id
                );

            }
        );


    if (!transaction) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${transaction.name}"?`
        );


    if (!confirmed) {
        return;
    }


    transactions =
        transactions.filter(
            function (item) {

                return (
                    item.id !== id
                );

            }
        );


    // SAVE AFTER DELETE

    saveTransactions();


    // Update everything

    renderTransactions();

    updateDashboard();

    renderChart();

    updateBudgetUI();


    showToast(
        "Transaction deleted."
    );

}


// ============================================
// 16. OPEN EDIT MODAL
// ============================================

function openEditModal(id) {

    const transaction =
        transactions.find(
            function (item) {

                return (
                    item.id === id
                );

            }
        );


    if (!transaction) {
        return;
    }


    editingTransactionId =
        id;


    editName.value =
        transaction.name;


    editAmount.value =
        transaction.amount;


    editCategory.value =
        transaction.category;


    editDate.value =
        transaction.date;


    editModal.classList.add(
        "active"
    );

}


// ============================================
// 17. CLOSE EDIT MODAL
// ============================================

function closeEditModal() {

    editModal.classList.remove(
        "active"
    );


    editingTransactionId =
        null;

}


closeModal.addEventListener(
    "click",
    closeEditModal
);


cancelEdit.addEventListener(
    "click",
    closeEditModal
);


editModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            editModal
        ) {

            closeEditModal();

        }

    }
);


// ============================================
// 18. SAVE EDIT
// ============================================

editForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const transaction =
            transactions.find(
                function (item) {

                    return (
                        item.id ===
                        editingTransactionId
                    );

                }
            );


        if (!transaction) {
            return;
        }


        const name =
            editName.value.trim();


        const amount =
            Number(
                editAmount.value
            );


        const category =
            editCategory.value;


        const date =
            editDate.value;


        if (
            !name ||
            amount <= 0 ||
            !category ||
            !date
        ) {

            showToast(
                "Please enter valid information."
            );

            return;

        }


        // Update object

        transaction.name =
            name;


        transaction.amount =
            amount;


        transaction.category =
            category;


        transaction.date =
            date;


        // SAVE EDIT

        saveTransactions();


        // Update UI

        renderTransactions();

        updateDashboard();

        renderChart();

        updateBudgetUI();


        closeEditModal();


        showToast(
            "Transaction updated."
        );

    }
);


// ============================================
// 19. SEARCH
// ============================================

searchInput.addEventListener(
    "input",
    function () {

        renderTransactions();

    }
);


// ============================================
// 20. TYPE FILTER
// ============================================

typeFilter.addEventListener(
    "change",
    function () {

        renderTransactions();

    }
);


// ============================================
// 21. CATEGORY FILTER
// ============================================

categoryFilter.addEventListener(
    "change",
    function () {

        renderTransactions();

    }
);


// ============================================
// 22. UPDATE FILTER CATEGORIES
// ============================================

function updateFilterCategories() {

    const categories =
        [
            ...new Set(
                transactions.map(
                    function (transaction) {

                        return transaction.category;

                    }
                )
            )
        ];


    categoryFilter.innerHTML = `

        <option value="all">
            All Categories
        </option>

    `;


    categories
        .sort()
        .forEach(
            function (category) {

                categoryFilter.innerHTML += `

                    <option value="${category}">
                        ${category}
                    </option>

                `;

            }
        );

}


// ============================================
// 23. CHART
// ============================================

function renderChart() {

    categoryChart.innerHTML =
        "";


    let expenseTransactions =
        transactions.filter(
            function (transaction) {

                return (
                    transaction.type ===
                    "expense"
                );

            }
        );


    // ----------------------------------------
    // THIS MONTH FILTER
    // ----------------------------------------

    if (
        chartPeriod.value ===
        "month"
    ) {

        const now =
            new Date();

        const month =
            now.getMonth();

        const year =
            now.getFullYear();


        expenseTransactions =
            expenseTransactions.filter(
                function (transaction) {

                    const date =
                        new Date(
                            `${transaction.date}T00:00:00`
                        );


                    return (

                        date.getMonth() ===
                            month &&

                        date.getFullYear() ===
                            year

                    );

                }
            );

    }


    // ----------------------------------------
    // GROUP BY CATEGORY
    // ----------------------------------------

    const categoryTotals = {};


    expenseTransactions.forEach(
        function (transaction) {

            if (
                !categoryTotals[
                    transaction.category
                ]
            ) {

                categoryTotals[
                    transaction.category
                ] = 0;

            }


            categoryTotals[
                transaction.category
            ] += Number(
                transaction.amount
            );

        }
    );


    const entries =
        Object.entries(
            categoryTotals
        );


    const total =
        entries.reduce(
            function (
                sum,
                item
            ) {

                return (
                    sum +
                    item[1]
                );

            },
            0
        );


    chartTotal.textContent =
        `${formatCurrency(
            total
        )} total spending`;


    // ----------------------------------------
    // EMPTY CHART
    // ----------------------------------------

    if (
        entries.length === 0
    ) {

        categoryChart.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📊
                </div>

                <h3>
                    No spending data
                </h3>

                <p>
                    Add expenses to see your breakdown.
                </p>

            </div>

        `;

        return;

    }


    // ----------------------------------------
    // SORT
    // ----------------------------------------

    entries.sort(
        function (a, b) {

            return b[1] - a[1];

        }
    );


    // ----------------------------------------
    // CREATE BARS
    // ----------------------------------------

    entries.forEach(
        function (
            [category, amount]
        ) {

            const percentage =
                total === 0
                    ? 0
                    : (
                        amount /
                        total
                    ) * 100;


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "chart-row";


            const color =
                getCategoryColor(
                    category
                );


            row.innerHTML = `

                <div class="chart-label">

                    <span
                        class="chart-dot"
                        style="background:${color}"
                    ></span>

                    ${escapeHTML(
                        category
                    )}

                </div>


                <div class="chart-bar-container">

                    <div
                        class="chart-bar"
                        style="
                            width:${percentage}%;
                            background:${color};
                        "
                    ></div>

                </div>


                <div class="chart-value">

                    ${formatCurrency(
                        amount
                    )}

                </div>

            `;


            categoryChart.appendChild(
                row
            );

        }
    );

}


// ============================================
// 24. CHART PERIOD
// ============================================

chartPeriod.addEventListener(
    "change",
    function () {

        renderChart();

    }
);


// ============================================
// 25. GET MONTHLY EXPENSE
// ============================================

function getMonthlyExpense() {

    const now =
        new Date();

    const month =
        now.getMonth();

    const year =
        now.getFullYear();


    return transactions
        .filter(
            function (transaction) {

                const date =
                    new Date(
                        `${transaction.date}T00:00:00`
                    );


                return (

                    transaction.type ===
                        "expense" &&

                    date.getMonth() ===
                        month &&

                    date.getFullYear() ===
                        year

                );

            }
        )
        .reduce(
            function (
                total,
                transaction
            ) {

                return (
                    total +
                    Number(
                        transaction.amount
                    )
                );

            },
            0
        );

}


// ============================================
// 26. UPDATE BUDGET UI
// ============================================

function updateBudgetUI() {

    const spent =
        getMonthlyExpense();


    budgetSpent.textContent =
        formatCurrency(
            spent
        );


    budgetLimit.textContent =
        formatCurrency(
            monthlyBudget
        );


    // No budget

    if (
        monthlyBudget <= 0
    ) {

        budgetProgress.style.width =
            "0%";


        budgetProgress.style.background =
            "var(--green)";


        budgetStatus.textContent =
            "No budget set";


        budgetStatus.className =
            "budget-status";


        return;

    }


    const percentage =
        (
            spent /
            monthlyBudget
        ) * 100;


    budgetProgress.style.width =
        `${Math.min(
            percentage,
            100
        )}%`;


    // Over budget

    if (
        percentage >= 100
    ) {

        budgetStatus.textContent =
            "Budget exceeded";


        budgetStatus.className =
            "budget-status danger";


        budgetProgress.style.background =
            "var(--red)";

    }


    // Warning

    else if (
        percentage >= 80
    ) {

        budgetStatus.textContent =
            `${percentage.toFixed(0)}% used`;


        budgetStatus.className =
            "budget-status warning";


        budgetProgress.style.background =
            "var(--yellow)";

    }


    // Good

    else {

        budgetStatus.textContent =
            `${percentage.toFixed(0)}% used`;


        budgetStatus.className =
            "budget-status good";


        budgetProgress.style.background =
            "var(--green)";

    }

}


// ============================================
// 27. OPEN BUDGET MODAL
// ============================================

setBudgetBtn.addEventListener(
    "click",
    function () {

        budgetAmount.value =
            monthlyBudget || "";


        budgetModal.classList.add(
            "active"
        );

    }
);


// ============================================
// 28. CLOSE BUDGET MODAL
// ============================================

closeBudgetModal.addEventListener(
    "click",
    function () {

        budgetModal.classList.remove(
            "active"
        );

    }
);


cancelBudget.addEventListener(
    "click",
    function () {

        budgetModal.classList.remove(
            "active"
        );

    }
);


budgetModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            budgetModal
        ) {

            budgetModal.classList.remove(
                "active"
            );

        }

    }
);


// ============================================
// 29. SAVE BUDGET
// ============================================

budgetForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const value =
            Number(
                budgetAmount.value
            );


        if (
            value < 0
        ) {

            showToast(
                "Enter a valid budget."
            );

            return;

        }


        monthlyBudget =
            value;


        localStorage.setItem(
            "fintrackBudget",
            String(
                monthlyBudget
            )
        );


        budgetModal.classList.remove(
            "active"
        );


        updateBudgetUI();


        showToast(
            "Monthly budget updated."
        );

    }
);


// ============================================
// 30. EXPORT CSV
// ============================================

exportBtn.addEventListener(
    "click",
    function () {

        if (
            transactions.length === 0
        ) {

            showToast(
                "There are no transactions to export."
            );

            return;

        }


        const headers = [

            "Name",
            "Amount",
            "Category",
            "Type",
            "Date"

        ];


        const rows =
            transactions.map(
                function (transaction) {

                    return [

                        `"${String(
                            transaction.name
                        ).replace(
                            /"/g,
                            '""'
                        )}"`,

                        transaction.amount,

                        `"${String(
                            transaction.category
                        ).replace(
                            /"/g,
                            '""'
                        )}"`,

                        transaction.type,

                        transaction.date

                    ].join(",");

                }
            );


        const csv =
            [
                headers.join(","),
                ...rows
            ].join("\n");


        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "fintrack-transactions.csv";


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(
            url
        );


        showToast(
            "CSV exported successfully."
        );

    }
);


// ============================================
// 31. DARK MODE
// ============================================

themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "fintrackTheme",
            isDark
                ? "dark"
                : "light"
        );

    }
);


// ============================================
// 32. LOAD THEME
// ============================================

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "fintrackTheme"
        );


    if (
        savedTheme === "dark"
    ) {

        document.body.classList.add(
            "dark"
        );

    }

}


// ============================================
// 33. SCROLL TO ADD TRANSACTION
// ============================================

scrollToFormBtn.addEventListener(
    "click",
    function () {

        const section =
            document.getElementById(
                "expenseSection"
            );


        section.scrollIntoView({
            behavior:
                "smooth",
            block:
                "center"
        });

    }
);


// ============================================
// 34. CATEGORY ICON
// ============================================

function getCategoryIcon(
    category
) {

    const allCategories = [

        ...expenseCategories,
        ...incomeCategories

    ];


    const found =
        allCategories.find(
            function (item) {

                return (
                    item.name ===
                    category
                );

            }
        );


    return found
        ? found.icon
        : "📦";

}


// ============================================
// 35. CATEGORY CLASS
// ============================================

function getCategoryClass(
    category
) {

    return category
        .toLowerCase()
        .replace(
            /\s+/g,
            "-"
        );

}


// ============================================
// 36. CATEGORY COLORS
// ============================================

function getCategoryColor(
    category
) {

    const colors = {

        Food:
            "#ea580c",

        Shopping:
            "#2563eb",

        Transport:
            "#16a34a",

        Entertainment:
            "#7c3aed",

        Bills:
            "#ca8a04",

        Health:
            "#db2777",

        Salary:
            "#16a34a",

        Freelance:
            "#2563eb",

        Business:
            "#7c3aed",

        Investment:
            "#0891b2",

        Gift:
            "#db2777",

        Other:
            "#6b7280"

    };


    return (
        colors[category] ||
        "#6b7280"
    );

}


// ============================================
// 37. FORMAT CURRENCY
// ============================================

function formatCurrency(
    amount
) {

    return `$${Number(
        amount
    ).toFixed(2)}`;

}


// ============================================
// 38. FORMAT DATE
// ============================================

function formatDate(
    date
) {

    if (!date) {
        return "Unknown date";
    }


    const dateObject =
        new Date(
            `${date}T00:00:00`
        );


    if (
        Number.isNaN(
            dateObject.getTime()
        )
    ) {

        return date;

    }


    return dateObject.toLocaleDateString(
        "en-US",
        {
            month:
                "short",

            day:
                "numeric",

            year:
                "numeric"

        }
    );

}


// ============================================
// 39. ESCAPE HTML
// ============================================

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(value);


    return div.innerHTML;

}


// ============================================
// 40. TOAST
// ============================================

let toastTimeout;


function showToast(
    message
) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


// ============================================
// 41. START APPLICATION
// ============================================

initializeApp();