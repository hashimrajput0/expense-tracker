const inputAmount = document.querySelector(".amount");
const SelectCategory = document.querySelector(".category");
const addBtn = document.querySelector(".add-btn");
const cardContainer = document.querySelector(".container");
const resetBtn = document.querySelector(".resetbtn");
let typeSelect = document.querySelector("#chartType");
const dialogBox = document.querySelector(".sure");
const closeBtn = document.querySelector(".no");
const YesBtn = document.querySelector(".yes");
const footerTotals = document.querySelector(".totals")

closeBtn.addEventListener("click", () => {
    dialogBox.close();
});

YesBtn.addEventListener("click", () => {
    resetLocalStorage();
    GetLocalStorage();
    loadChart();
    dialogBox.close();
    categories();
    completeTotalExpense()
});


resetBtn.addEventListener("click", () => {
    dialogBox.showModal();
});


typeSelect.addEventListener("change", () => {
    loadChart();

});
addBtn.addEventListener("click", () => {
    AddLocalStorage();
    GetLocalStorage();
    ClearInput();
    loadChart();
    categories();
    completeTotalExpense()
});
window.onload = () => {
    GetLocalStorage();
    loadChart();
    categories();
    completeTotalExpense()
};

function AddLocalStorage() {
    let d = new Date();
    let date = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    let CurrentDate = `${date}/${month}/${year}`;

    let NewExpense = {
        amount: inputAmount.value,
        category: SelectCategory.value,
        date: CurrentDate
    }
    let expense = JSON.parse(localStorage.getItem("expense")) || [];
    expense.push(NewExpense);
    localStorage.setItem("expense", JSON.stringify(expense));
}


function GetLocalStorage() {
    cardContainer.innerHTML = "";
    let expense = JSON.parse(localStorage.getItem("expense")) || [];
    expense.forEach((singleExpense, id) => {
        let card = document.createElement("div");
        card.classList.add("card");
        let amountText = document.createElement("p");
        amountText.classList.add("amount-card");
        let categoryText = document.createElement("p");
        categoryText.classList.add("category-card");
        let dateText = document.createElement("p");
        dateText.classList.add("date-card");


        let deleteButton = document.createElement("p");
        deleteButton.innerText = "❌";
        deleteButton.classList.add("deletebutton");
        card.prepend(deleteButton);

        deleteButton.addEventListener("click", () => {
            expense.splice(id, 1);
            localStorage.setItem("expense", JSON.stringify(expense));
            GetLocalStorage();
            loadChart();
            categories();
            completeTotalExpense()
        });


        amountText.innerText = `${singleExpense.amount} PKR`;
        categoryText.innerText = singleExpense.category;
        dateText.innerText = singleExpense.date;

        cardContainer.prepend(card);
        card.appendChild(amountText);
        card.appendChild(categoryText);
        card.appendChild(dateText);
    });
}

function ClearInput() {
    inputAmount.value = "";
}




let myChart;


function loadChart() {
    let expense = JSON.parse(localStorage.getItem("expense")) || [];


    let categories = {};
    expense.forEach(item => {
        let category = item.category;
        let amount = Number(item.amount);
        categories[category] = (categories[category] || 0) + amount;
    });

    let labels = Object.keys(categories);
    let data = Object.values(categories);

    const ctx = document.getElementById("expenseChart");


    if (myChart) myChart.destroy();


    myChart = new Chart(ctx, {
        type: typeSelect.value,
        data: {
            labels: labels,
            datasets: [{
                label: "Total Spent",
                data: data,
                borderWidth: 1,
                backgroundColor: [
                    "#3498db",
                    "#e74c3c",
                    "#2ecc71",
                    "#f1c40f",
                    "#9b59b6",
                    "#e67e22"
                ]

            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
function resetLocalStorage() {
    localStorage.removeItem("expense");
}


function completeTotalExpense() {
    let expenses = JSON.parse(localStorage.getItem("expense")) || [];
    let total = 0;

    expenses.forEach(EachExpense => {
        total += Number(EachExpense.amount);
    });
    let p = document.createElement("p");
    p.innerText = `Total = ${total}PKR,   |   `;
    footerTotals.prepend(p);
}


function categories() {
    footerTotals.innerHTML = "";




    let expense = JSON.parse(localStorage.getItem("expense")) || [];

    let uniqueCategories = [...new Set(expense.map(e => e.category))];

    uniqueCategories.forEach(EachExpenseCategory => {
        categoryName = EachExpenseCategory;
        getTotalByCategory(categoryName);
    });
}

function getTotalByCategory(categoryName) {
    let expenses = JSON.parse(localStorage.getItem("expense")) || [];
    let total = 0;

    expenses.forEach(EachExpense => {
        if (EachExpense.category === categoryName) {
            total += Number(EachExpense.amount);
        }
    });

    let p = document.createElement("p");
    p.innerText = `${categoryName} = ${total}PKR  | `;
    footerTotals.appendChild(p);
}


// excel
function exportToExcel() {
    let expenses = JSON.parse(localStorage.getItem("expense")) || [];

    if (expenses.length === 0) {
        alert("No data to export!");
        return;
    }

    let worksheet = XLSX.utils.json_to_sheet(expenses);
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    XLSX.writeFile(workbook, "Expenses.xlsx");
}
