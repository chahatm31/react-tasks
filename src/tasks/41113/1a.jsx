import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = [
  "Food",
  "Transportation",
  "Entertainment",
  "Accommodation",
  "Other",
];

function App() {
  const [participants, setParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    payer: "",
    category: "",
  });
  const [filter, setFilter] = useState({ participant: "", category: "" });
  const [budget, setBudget] = useState(0);

  const addParticipant = (name) => {
    if (!participants.includes(name)) {
      setParticipants((prev) => [...prev, name]);
    }
  };

  const addExpense = () => {
    if (
      newExpense.description &&
      newExpense.amount &&
      newExpense.payer &&
      newExpense.category
    ) {
      setExpenses((prev) => [...prev, { ...newExpense, id: Date.now() }]);
      addParticipant(newExpense.payer);
      setNewExpense({ description: "", amount: "", payer: "", category: "" });
    }
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const updateExpense = (id, updatedExpense) => {
    setExpenses(
      expenses.map((exp) =>
        exp.id === id ? { ...exp, ...updatedExpense } : exp
      )
    );
  };

  const totalSpent = expenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount),
    0
  );
  const perPerson = totalSpent / participants.length || 0;

  const balances = participants.reduce((acc, p) => {
    const paid = expenses
      .filter((exp) => exp.payer === p)
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    acc[p] = paid - perPerson;
    return acc;
  }, {});

  const settlement = () => {
    let result = [];
    const sortedBalances = Object.entries(balances).sort((a, b) => a[1] - b[1]);
    let i = 0,
      j = sortedBalances.length - 1;
    while (i < j) {
      if (Math.abs(sortedBalances[i][1]) < 0.01) {
        i++;
        continue;
      }
      const debt = Math.min(-sortedBalances[i][1], sortedBalances[j][1]);
      result.push(
        `${sortedBalances[i][0]} pays ${sortedBalances[j][0]} $${debt.toFixed(
          2
        )}`
      );
      sortedBalances[i][1] += debt;
      sortedBalances[j][1] -= debt;
      if (sortedBalances[j][1] === 0) j--;
    }
    return result;
  };

  const filteredExpenses = expenses.filter(
    (exp) =>
      (!filter.participant || exp.payer === filter.participant) &&
      (!filter.category || exp.category === filter.category)
  );

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Expense Splitter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="budget">Set Budget</Label>
            <Input
              id="budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter total budget"
            />
          </div>
          <div className="mb-4">
            <Input
              value={newExpense.description}
              onChange={(e) =>
                setNewExpense((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Expense Description"
            />
            <Input
              type="number"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense((prev) => ({ ...prev, amount: e.target.value }))
              }
              placeholder="Amount"
            />
            <Select
              value={newExpense.payer}
              onValueChange={(value) =>
                setNewExpense((prev) => ({ ...prev, payer: value }))
              }
            >
              <SelectItem value="">Select Payer</SelectItem>
              {participants.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </Select>
            <Select
              value={newExpense.category}
              onValueChange={(value) =>
                setNewExpense((prev) => ({ ...prev, category: value }))
              }
            >
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </Select>
            <Button onClick={addExpense}>Add Expense</Button>
          </div>
          <div className="flex space-x-4 mb-4">
            <Select
              value={filter.participant}
              onValueChange={(value) =>
                setFilter((prev) => ({ ...prev, participant: value }))
              }
            >
              <SelectItem value="">All Participants</SelectItem>
              {participants.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </Select>
            <Select
              value={filter.category}
              onValueChange={(value) =>
                setFilter((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </Select>
          </div>
          <ul>
            {filteredExpenses.map((exp) => (
              <ExpenseItem
                key={exp.id}
                expense={exp}
                onDelete={deleteExpense}
                onUpdate={updateExpense}
                participants={participants}
              />
            ))}
          </ul>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>Total Spent: ${totalSpent.toFixed(2)}</div>
          <div>Avg per Person: ${perPerson.toFixed(2)}</div>
          <div>
            Budget Progress: {((totalSpent / budget) * 100 || 0).toFixed(2)}%
          </div>
        </CardFooter>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Settlement</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {settlement().map((sett, index) => (
              <li key={index}>{sett}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function ExpenseItem({ expense, onDelete, onUpdate, participants }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editExpense, setEditExpense] = useState(expense);

  const saveEdit = () => {
    onUpdate(expense.id, editExpense);
    setIsEditing(false);
  };

  return (
    <li className="mb-2">
      {isEditing ? (
        <>
          <Input
            value={editExpense.description}
            onChange={(e) =>
              setEditExpense({ ...editExpense, description: e.target.value })
            }
          />
          <Input
            type="number"
            value={editExpense.amount}
            onChange={(e) =>
              setEditExpense({ ...editExpense, amount: e.target.value })
            }
          />
          <Select
            value={editExpense.payer}
            onValueChange={(value) =>
              setEditExpense({ ...editExpense, payer: value })
            }
          >
            {participants.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </Select>
          <Select
            value={editExpense.category}
            onValueChange={(value) =>
              setEditExpense({ ...editExpense, category: value })
            }
          >
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </Select>
          <Button onClick={saveEdit}>Save</Button>
        </>
      ) : (
        <>
          <span>
            {expense.description} - ${expense.amount} paid by {expense.payer} (
            {expense.category})
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(expense.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </li>
  );
}

export default App;