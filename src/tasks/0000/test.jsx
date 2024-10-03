import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, UserPlus, Edit2, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const EXPENSE_CATEGORIES = [
  "Food",
  "Transportation",
  "Entertainment",
  "Accommodation",
  "Other",
];

const ExpenseForm = ({
  onAddExpense,
  onUpdateExpense,
  participants,
  initialExpense = null,
}) => {
  const [description, setDescription] = useState(
    initialExpense ? initialExpense.description : ""
  );
  const [amount, setAmount] = useState(
    initialExpense ? initialExpense.amount.toString() : ""
  );
  const [payer, setPayer] = useState(
    initialExpense ? initialExpense.payer : ""
  );
  const [category, setCategory] = useState(
    initialExpense ? initialExpense.category : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description && amount && payer && category) {
      const expenseData = {
        description,
        amount: parseFloat(amount),
        payer,
        category,
      };
      if (initialExpense) {
        onUpdateExpense(initialExpense.id, expenseData);
      } else {
        onAddExpense(expenseData);
      }
      if (!initialExpense) {
        setDescription("");
        setAmount("");
        setPayer("");
        setCategory("");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Dinner, Movie tickets, etc."
          required
        />
      </div>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0"
          required
        />
      </div>
      <div>
        <Label htmlFor="payer">Paid by</Label>
        <Select onValueChange={setPayer} value={payer} required>
          <SelectTrigger>
            <SelectValue placeholder="Select payer" />
          </SelectTrigger>
          <SelectContent>
            {participants.map((participant) => (
              <SelectItem key={participant} value={participant}>
                {participant}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={setCategory} value={category} required>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {EXPENSE_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        {initialExpense ? "Update Expense" : "Add Expense"}
      </Button>
    </form>
  );
};

const ExpenseList = ({
  expenses,
  onDeleteExpense,
  onEditExpense,
  filterParticipant,
  filterCategory,
}) => (
  <div className="space-y-4">
    {expenses
      .filter(
        (expense) =>
          (!filterParticipant || expense.payer === filterParticipant) &&
          (!filterCategory || expense.category === filterCategory)
      )
      .map((expense) => (
        <Card key={expense.id}>
          <CardHeader>
            <CardTitle>{expense.description}</CardTitle>
            <CardDescription>
              Paid by: {expense.payer} | Category: {expense.category}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${expense.amount.toFixed(2)}</p>
          </CardContent>
          <CardFooter className="space-x-2">
            <Button variant="outline" onClick={() => onEditExpense(expense)}>
              <Edit2 className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => onDeleteExpense(expense.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
  </div>
);

const Settlement = ({ expenses }) => {
  const calculateSettlement = () => {
    const balances = {};
    expenses.forEach((expense) => {
      if (!balances[expense.payer]) {
        balances[expense.payer] = 0;
      }
      balances[expense.payer] += expense.amount;
    });

    const totalAmount = Object.values(balances).reduce(
      (sum, amount) => sum + amount,
      0
    );
    const avgAmount = totalAmount / Object.keys(balances).length;

    const debts = Object.entries(balances).map(([person, amount]) => ({
      person,
      amount: avgAmount - amount,
    }));

    const settlements = [];
    const debtors = debts
      .filter((debt) => debt.amount > 0)
      .sort((a, b) => b.amount - a.amount);
    const creditors = debts
      .filter((debt) => debt.amount < 0)
      .sort((a, b) => a.amount - b.amount);

    while (debtors.length > 0 && creditors.length > 0) {
      const debtor = debtors[0];
      const creditor = creditors[0];
      const amount = Math.min(debtor.amount, -creditor.amount);

      settlements.push({
        from: debtor.person,
        to: creditor.person,
        amount: amount.toFixed(2),
      });

      debtor.amount -= amount;
      creditor.amount += amount;

      if (debtor.amount < 0.01) debtors.shift();
      if (creditor.amount > -0.01) creditors.shift();
    }

    return settlements;
  };

  const settlements = calculateSettlement();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settlement</CardTitle>
      </CardHeader>
      <CardContent>
        {settlements.length > 0 ? (
          <ul className="space-y-2">
            {settlements.map((settlement, index) => (
              <li key={index}>
                <strong>{settlement.from}</strong> pays{" "}
                <strong>${settlement.amount}</strong> to{" "}
                <strong>{settlement.to}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>No settlements needed.</p>
        )}
      </CardContent>
    </Card>
  );
};

const ParticipantManager = ({ participants, setParticipants }) => {
  const [newParticipant, setNewParticipant] = useState("");

  const addParticipant = () => {
    if (newParticipant && !participants.includes(newParticipant)) {
      setParticipants([...participants, newParticipant]);
      setNewParticipant("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Participants</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
            placeholder="New participant name"
          />
          <Button onClick={addParticipant}>
            <UserPlus className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Current Participants:</h4>
          <ul className="list-disc list-inside">
            {participants.map((participant) => (
              <li key={participant}>{participant}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

const Summary = ({ expenses, participants, budget }) => {
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averagePerPerson = participants.length
    ? totalSpent / participants.length
    : 0;
  const budgetProgress = budget ? (totalSpent / budget) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Total Spent: ${totalSpent.toFixed(2)}</p>
        <p>Average per Person: ${averagePerPerson.toFixed(2)}</p>
        {budget && (
          <div>
            <p>Budget: ${budget.toFixed(2)}</p>
            <Progress value={budgetProgress} className="mt-2" />
            <p className="text-sm text-gray-500 mt-1">
              {budgetProgress.toFixed(2)}% of budget used
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const BudgetSetter = ({ budget, setBudget }) => {
  const [newBudget, setNewBudget] = useState(budget ? budget.toString() : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newBudget) {
      setBudget(parseFloat(newBudget));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="budget">Budget Amount</Label>
            <Input
              id="budget"
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            <DollarSign className="mr-2 h-4 w-4" /> Set Budget
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [filterParticipant, setFilterParticipant] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [budget, setBudget] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  const addExpense = (expense) => {
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const editExpense = (expense) => {
    setEditingExpense(expense);
  };

  const updateExpense = (id, updatedExpense) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id ? { ...updatedExpense, id } : expense
      )
    );
    setEditingExpense(null);
  };

  useEffect(() => {
    const expensePayers = new Set(expenses.map((expense) => expense.payer));
    const newParticipants = [...new Set([...participants, ...expensePayers])];
    if (newParticipants.length !== participants.length) {
      setParticipants(newParticipants);
    }
  }, [expenses, participants]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Expense Splitter
        </h1>
        <ParticipantManager
          participants={participants}
          setParticipants={setParticipants}
        />
        <BudgetSetter budget={budget} setBudget={setBudget} />
        <Card>
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseForm
              onAddExpense={addExpense}
              participants={participants}
            />
          </CardContent>
        </Card>
        {expenses.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-4">
                  <div>
                    <Label htmlFor="filterParticipant">
                      Filter by Participant
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setFilterParticipant(value === "all" ? null : value)
                      }
                      value={filterParticipant || "all"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Participants" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Participants</SelectItem>
                        {participants.map((participant) => (
                          <SelectItem key={participant} value={participant}>
                            {participant}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="filterCategory">Filter by Category</Label>
                    <Select
                      onValueChange={(value) =>
                        setFilterCategory(value === "all" ? null : value)
                      }
                      value={filterCategory || "all"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {EXPENSE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <ExpenseList
                  expenses={expenses}
                  onDeleteExpense={deleteExpense}
                  onEditExpense={editExpense}
                  filterParticipant={filterParticipant}
                  filterCategory={filterCategory}
                />
              </CardContent>
            </Card>
            <Summary
              expenses={expenses}
              participants={participants}
              budget={budget}
            />
            <Settlement expenses={expenses} />
          </>
        )}
      </div>
      <Dialog
        open={!!editingExpense}
        onOpenChange={() => setEditingExpense(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            onUpdateExpense={updateExpense}
            participants={participants}
            initialExpense={editingExpense}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
