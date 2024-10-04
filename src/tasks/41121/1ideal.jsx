import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  DollarSign,
  PercentIcon,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CurrencyInput = ({ value, onChange, label, placeholder }) => (
  <div className="relative">
    <Label htmlFor={label}>{label}</Label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <Input
        type="number"
        name={label}
        id={label}
        className="pl-10 block w-full sm:text-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min="0"
        step="0.01"
      />
    </div>
  </div>
);

const PercentageInput = ({ value, onChange, label }) => (
  <div className="relative">
    <Label htmlFor={label}>{label}</Label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <Input
        type="number"
        name={label}
        id={label}
        className="pr-12 block w-full sm:text-sm"
        placeholder={`Enter ${label.toLowerCase()}`}
        value={value}
        onChange={onChange}
        min="0"
        max="100"
        step="0.1"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <PercentIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
    </div>
  </div>
);

const ResultDisplay = ({ label, value }) => (
  <div className="bg-gray-100 p-4 rounded-md">
    <h3 className="text-sm font-medium text-gray-500">{label}</h3>
    <p className="mt-1 text-3xl font-semibold text-gray-900">
      ${value.toFixed(2)}
    </p>
  </div>
);

const DiscountCalculator = () => {
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [taxPercentage, setTaxPercentage] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [amountSaved, setAmountSaved] = useState(null);
  const [finalPrice, setFinalPrice] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [comparisonDiscounts, setComparisonDiscounts] = useState([10, 20, 30]);
  const [newDiscount, setNewDiscount] = useState("");
  const [comparisonTax, setComparisonTax] = useState("");
  const [savingsGoal, setSavingsGoal] = useState("");
  const [savingsGoalResult, setSavingsGoalResult] = useState(null);
  const [bulkItems, setBulkItems] = useState([{ price: "", quantity: 1 }]);
  const [bulkDiscount, setBulkDiscount] = useState("");
  const [bulkResult, setBulkResult] = useState(null);

  const calculateDiscount = (price, discount, tax = 0) => {
    const discountAmount = price * (discount / 100);
    const discounted = price - discountAmount;
    const taxAmount = discounted * (tax / 100);
    const final = discounted + taxAmount;
    return { discounted, saved: discountAmount, final };
  };

  const handleCalculate = () => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercentage);
    const tax = parseFloat(taxPercentage) || 0;

    if (isNaN(price) || isNaN(discount)) {
      setError("Please enter valid numbers for both fields.");
      setDiscountedPrice(null);
      setAmountSaved(null);
      setFinalPrice(null);
      return;
    }

    if (price < 0 || discount < 0 || discount > 100 || tax < 0 || tax > 100) {
      setError(
        "Please enter valid values (price >= 0, 0 <= discount <= 100, 0 <= tax <= 100)."
      );
      setDiscountedPrice(null);
      setAmountSaved(null);
      setFinalPrice(null);
      return;
    }

    setError("");
    const result = calculateDiscount(price, discount, tax);
    setDiscountedPrice(result.discounted);
    setAmountSaved(result.saved);
    setFinalPrice(result.final);

    const newEntry = {
      id: Date.now(),
      originalPrice: price,
      discountPercentage: discount,
      taxPercentage: tax,
      discountedPrice: result.discounted,
      amountSaved: result.saved,
      finalPrice: result.final,
    };
    setHistory((prev) => [newEntry, ...prev.slice(0, 9)]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const addComparisonDiscount = () => {
    const discount = parseFloat(newDiscount);
    if (!isNaN(discount) && discount >= 0 && discount <= 100) {
      setComparisonDiscounts([...comparisonDiscounts, discount]);
      setNewDiscount("");
    }
  };

  const removeComparisonDiscount = (index) => {
    setComparisonDiscounts(comparisonDiscounts.filter((_, i) => i !== index));
  };

  const calculateSavingsGoal = () => {
    const price = parseFloat(originalPrice);
    const goal = parseFloat(savingsGoal);

    if (
      isNaN(price) ||
      isNaN(goal) ||
      price <= 0 ||
      goal <= 0 ||
      goal >= price
    ) {
      setSavingsGoalResult("Invalid input. Please enter valid numbers.");
      return;
    }

    const discountNeeded = ((price - goal) / price) * 100;
    setSavingsGoalResult(
      `To save $${goal.toFixed(2)} on a $${price.toFixed(
        2
      )} item, you need a ${discountNeeded.toFixed(2)}% discount.`
    );
  };

  const addBulkItem = () => {
    setBulkItems([...bulkItems, { price: "", quantity: 1 }]);
  };

  const removeBulkItem = (index) => {
    setBulkItems(bulkItems.filter((_, i) => i !== index));
  };

  const updateBulkItem = (index, field, value) => {
    const newItems = [...bulkItems];
    newItems[index][field] = value;
    setBulkItems(newItems);
  };

  const calculateBulkDiscount = () => {
    const discount = parseFloat(bulkDiscount);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      setBulkResult(
        "Invalid discount. Please enter a number between 0 and 100."
      );
      return;
    }

    const totalBeforeDiscount = bulkItems.reduce((sum, item) => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity);
      return sum + (isNaN(price) || isNaN(quantity) ? 0 : price * quantity);
    }, 0);

    const totalAfterDiscount = totalBeforeDiscount * (1 - discount / 100);
    const totalSaved = totalBeforeDiscount - totalAfterDiscount;

    setBulkResult(`
      Total before discount: $${totalBeforeDiscount.toFixed(2)}
      Total after ${discount}% discount: $${totalAfterDiscount.toFixed(2)}
      Total saved: $${totalSaved.toFixed(2)}
    `);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Discount Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calculator" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="savingsGoal">Savings Goal</TabsTrigger>
            <TabsTrigger value="bulkDiscount">Bulk Discount</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CurrencyInput
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                label="Original Price"
                placeholder="Enter original price"
              />
              <PercentageInput
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                label="Discount Percentage"
              />
              <PercentageInput
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(e.target.value)}
                label="Tax Percentage"
              />
            </div>
            <Button onClick={handleCalculate} className="w-full">
              Calculate Discount
            </Button>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {discountedPrice !== null && amountSaved !== null && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <ResultDisplay
                  label="Discounted Price"
                  value={discountedPrice}
                />
                <ResultDisplay label="Amount Saved" value={amountSaved} />
                <ResultDisplay
                  label="Final Price (with Tax)"
                  value={finalPrice}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Calculation History</h3>
                <Button variant="outline" onClick={clearHistory}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear History
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Original Price</TableHead>
                    <TableHead>Discount %</TableHead>
                    <TableHead>Tax %</TableHead>
                    <TableHead>Discounted Price</TableHead>
                    <TableHead>Amount Saved</TableHead>
                    <TableHead>Final Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>${entry.originalPrice.toFixed(2)}</TableCell>
                      <TableCell>{entry.discountPercentage}%</TableCell>
                      <TableCell>{entry.taxPercentage}%</TableCell>
                      <TableCell>${entry.discountedPrice.toFixed(2)}</TableCell>
                      <TableCell>${entry.amountSaved.toFixed(2)}</TableCell>
                      <TableCell>${entry.finalPrice.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <h3 className="text-lg font-semibold">Discount Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CurrencyInput
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                label="Original Price"
                placeholder="Enter original price"
              />
              <PercentageInput
                value={comparisonTax}
                onChange={(e) => setComparisonTax(e.target.value)}
                label="Tax Percentage"
              />
            </div>
            <div className="flex items-end space-x-2">
              <div className="flex-grow">
                <PercentageInput
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  label="New Discount Percentage"
                />
              </div>
              <Button onClick={addComparisonDiscount}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Discount %</TableHead>
                  <TableHead>Discounted Price</TableHead>
                  <TableHead>Amount Saved</TableHead>
                  <TableHead>Final Price (with Tax)</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonDiscounts.map((discount, index) => {
                  const price = parseFloat(originalPrice);
                  const tax = parseFloat(comparisonTax) || 0;
                  if (isNaN(price)) return null;
                  const result = calculateDiscount(price, discount, tax);
                  return (
                    <TableRow key={index}>
                      <TableCell>{discount}%</TableCell>
                      <TableCell>${result.discounted.toFixed(2)}</TableCell>
                      <TableCell>${result.saved.toFixed(2)}</TableCell>
                      <TableCell>${result.final.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeComparisonDiscount(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="savingsGoal" className="space-y-4">
            <h3 className="text-lg font-semibold">Savings Goal Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CurrencyInput
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                label="Original Price"
                placeholder="Enter original price"
              />
              <CurrencyInput
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(e.target.value)}
                label="Savings Goal"
                placeholder="Enter savings goal"
              />
            </div>
            <Button onClick={calculateSavingsGoal} className="w-full">
              Calculate Required Discount
            </Button>
            {savingsGoalResult && (
              <Alert>
                <AlertDescription>{savingsGoalResult}</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="bulkDiscount" className="space-y-4">
            <h3 className="text-lg font-semibold">Bulk Discount Calculator</h3>
            {bulkItems.map((item, index) => (
              <div key={index} className="flex items-end space-x-2">
                <div className="flex-grow">
                  <CurrencyInput
                    value={item.price}
                    onChange={(e) =>
                      updateBulkItem(index, "price", e.target.value)
                    }
                    label={`Item ${index + 1} Price`}
                    placeholder="Enter item price"
                  />
                </div>
                <div className="w-24">
                  <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                  <Input
                    type="number"
                    id={`quantity-${index}`}
                    value={item.quantity}
                    onChange={(e) =>
                      updateBulkItem(index, "quantity", e.target.value)
                    }
                    min="1"
                    step="1"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBulkItem(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={addBulkItem} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
            <PercentageInput
              value={bulkDiscount}
              onChange={(e) => setBulkDiscount(e.target.value)}
              label="Bulk Discount Percentage"
            />
            <Button onClick={calculateBulkDiscount} className="w-full">
              Calculate Bulk Discount
            </Button>
            {bulkResult && (
              <Alert>
                <AlertDescription>
                  <pre className="whitespace-pre-wrap">{bulkResult}</pre>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <DiscountCalculator />
    </div>
  );
}
