
const Login = {

    logIn() {
        window.location.href = './index.html'
    },
    logOut() {
        window.location.href = './login.html'
    }
}

const Modal = {
    playModal() {
        document
          .getElementById('modal-transaction')
          .classList
          .toggle('active');
    }

}

// MUDAR ESSA FUNÇÃO DE CIMA PARA TOOGLE

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)
        
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()
    },

    incomes() {
        let income = 0

        Transaction.all.forEach(transaction => {
            if(transaction.amount > 0) {
                income += transaction.amount;
            }
        })
        return income
    },

    expenses() {
        let expense = 0

        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0) {
                expense += transaction.amount;
            }
        })
        return expense
    },

    total(){
        return Transaction.incomes() + Transaction.expenses() 
    },

    porcentTotal() {
        return (Transaction.total()/ Transaction.incomes())*100
    },


}

const Diagnostic = {

    diagnosticExpenses() {
        remainingAmount = Transaction.porcentTotal()

        let scoreA = remainingAmount>=60 
        let scoreB = remainingAmount>=20 && remainingAmount<=59
        let scoreC = remainingAmount<= 19


            if(scoreA) {
                return {title: `Olhaa só!!! ${remainingAmount.toFixed(1)}% sobrando? Todas as contas foram pagas?! Boa clan!`, class:'.cardScore', icon: './assets/estrela.svg' }
            } else if (scoreB) {
                return {title:`Hummmm! Você tem ${remainingAmount.toFixed(1)}% dos seus ganhos totais disponíveis.`, class:'.cardScore', icon: './assets/exclamacao.svg' }
            } else if (scoreC) {
                return {title:`Atenção, você tem ${remainingAmount.toFixed(1)}% dos seus ganhos totais disponíveis.`, class:'.cardScoreRed', icon: './assets/triangulo.svg' }

            }else {
            return {title:'Dados não calculáveis', icon: './assets/info.svg' }
        }
    }

}


const DOM = {

    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction,index)
        tr.dataset.index = index

        DOM.transactionContainer.appendChild(tr)
        
    },

    innerHTMLTransaction(transaction,index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount) 
        const html = 
            `
                <td class="description">${transaction.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td>
                    <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
                </td>
            `
            return html
    },

    
    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())

        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
        document
            .getElementById('diagnosticExpenses')
            .innerHTML = Diagnostic.diagnosticExpenses().title
        document
            .getElementById('ImageText')
            .src = Diagnostic.diagnosticExpenses().icon




    },

    clearTransactions() {
        DOM.transactionContainer.innerHTML = ""
    }

}

const Utils = {
    formatAmount(value) {
        value = value * 100
        return Math.round(value)
    },

    formatDate(date) {
        const splittedDate = date.split("-")

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g,"") 

        value = Number(value) / 100

        value = value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
        
        return signal + value
    }

}

const Form = {

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    validateFields() {
        const {description, amount, date} = Form.getValues()

        if(description.trim() === "" || 
           amount.trim() === "" ||
           date.trim() === ""
           ) {
               throw new Error ("Por favor, preencha todos os campos")
           }
    },

    formatValues() {
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

   
    submit(event){
        event.preventDefault()
        // Vereficar se totas as infos estão preenchidas

        try {
        Form.validateFields()
        //formatar os dados para Salvar
        const transaction = Form.formatValues()
        
        //Salvar
        Transaction.add(transaction)

        //Apagar os dados do formulário
        Form.clearFields()

        //Modal fechar
        Modal.playModal()

        //Atualizar a aplicação
        App.reload()

        }catch (error){
            alert(error.message)
        }
    }
}


const App = {
    init() {
        //funcionalidade para arrays, com ela posso usar uma ação para cada elemento
        // para cada transação em transações rode uma funcionalidade
        Transaction.all.forEach((transaction,index) => {
            DOM.addTransaction(transaction,index)
        })

        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()


    },
}


App.init()

