// App.jsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const CATEGORIES = [
  "Food",
  "Transportation",
  "Entertainment",
  "Accommodation",
  "Other",
];

function App() {
  const [participants, setParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    payer: "",
    category: CATEGORIES[0],
  });

  const addParticipant = (name) => {
    if (!participants.includes(name)) setParticipants([...participants, name]);
  };

  const addExpense = () => {
    if (newExpense.amount && newExpense.payer) {
      setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
      if (!participants.includes(newExpense.payer))
        addParticipant(newExpense.payer);
      setNewExpense({
        description: "",
        amount: "",
        payer: "",
        category: CATEGORIES[0],
      });
    }
  };

  const removeExpense = (id) =>
    setExpenses(expenses.filter((e) => e.id !== id));

  const totalSpent = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );
  const perPerson = totalSpent / participants.length || 0;

  // Simple settlement calculation
  const settlements = participants.map((p) => {
    const paid = expenses
      .filter((e) => e.payer === p)
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);
    return { name: p, owes: perPerson - paid };
  });

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Expense Splitter</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Budget"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <ExpenseForm
            newExpense={newExpense}
            setNewExpense={setNewExpense}
            categories={CATEGORIES}
            participants={participants}
            addExpense={addExpense}
          />
          <ExpensesList
            expenses={expenses}
            categories={CATEGORIES}
            participants={participants}
            removeExpense={removeExpense}
          />
          <SettlementSummary
            settlements={settlements}
            totalSpent={totalSpent}
            budget={budget}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ExpenseForm({
  newExpense,
  setNewExpense,
  categories,
  participants,
  addExpense,
}) {
  return (
    <div className="mt-4">
      <Input
        value={newExpense.description}
        onChange={(e) =>
          setNewExpense({ ...newExpense, description: e.target.value })
        }
        placeholder="Description"
      />
      <Input
        type="number"
        value={newExpense.amount}
        onChange={(e) =>
          setNewExpense({ ...newExpense, amount: e.target.value })
        }
        placeholder="Amount"
      />
      <Select
        value={newExpense.payer}
        onChange={(value) => setNewExpense({ ...newExpense, payer: value })}
      >
        {participants.map((p) => (
          <SelectItem key={p} value={p}>
            {p}
          </SelectItem>
        ))}
      </Select>
      <Select
        value={newExpense.category}
        onChange={(value) => setNewExpense({ ...newExpense, category: value })}
      >
        {categories.map((cat) => (
          <SelectItem key={cat} value={cat}>
            {cat}
          </SelectItem>
        ))}
      </Select>
      <Button onClick={addExpense}>Add Expense</Button>
    </div>
  );
}

function ExpensesList({ expenses, removeExpense }) {
  return (
    <div className="mt-4">
      {expenses.map((expense) => (
        <Card key={expense.id} className="mb-2">
          <CardContent>
            <p>
              {expense.description} - {expense.amount} - {expense.payer} -{" "}
              {expense.category}
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeExpense(expense.id)}
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SettlementSummary({ settlements, totalSpent, budget }) {
  return (
    <Card className="mt-4">
      <CardTitle>Summary</CardTitle>
      <CardContent>
        <p>Total Spent: {totalSpent}</p>
        <p>Budget: {budget}</p>
        <p>Budget Progress: {((totalSpent / budget) * 100).toFixed(2)}%</p>
        <div>
          <h4>Settlements:</h4>
          {settlements.map((s) => (
            <p key={s.name}>
              {s.name}{" "}
              {s.owes > 0
                ? `owes ${Math.abs(s.owes).toFixed(2)}`
                : `gets back ${Math.abs(s.owes).toFixed(2)}`}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default App;
