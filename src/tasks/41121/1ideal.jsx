import React, { useState, useEffect } from "react";
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
  ChevronDown,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CurrencyInput = ({ value, onChange, label, placeholder }) => (
  <div className="relative mb-4">
    <Label htmlFor={label} className="block mb-1">
      {label}
    </Label>
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <Input
        type="number"
        name={label}
        id={label}
        className="pl-10 block w-full text-sm"
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
  <div className="relative mb-4">
    <Label htmlFor={label} className="block mb-1">
      {label}
    </Label>
    <div className="relative rounded-md shadow-sm">
      <Input
        type="number"
        name={label}
        id={label}
        className="pr-12 block w-full text-sm"
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
  <div className="bg-gray-100 p-4 rounded-md mb-4">
    <h3 className="text-sm font-medium text-gray-500">{label}</h3>
    <p className="mt-1 text-2xl font-semibold text-gray-900">
      ${value.toFixed(2)}
    </p>
  </div>
);

const DiscountCalculator = () => {
  const [activeTab, setActiveTab] = useState("calculator");
  const [isMobile, setIsMobile] = useState(false);
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "calculator":
        return (
          <div className="space-y-4">
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
              <div className="mt-4 space-y-4">
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
          </div>
        );
      case "history":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Calculation History</h3>
              <Button variant="outline" onClick={clearHistory}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">
                      Original
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Discount
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Tax</TableHead>
                    <TableHead className="whitespace-nowrap">
                      Discounted
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Saved</TableHead>
                    <TableHead className="whitespace-nowrap">Final</TableHead>
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
          </div>
        );
      case "comparison":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Discount Comparison</h3>
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
            <div className="flex items-end space-x-2 mb-4">
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Discount %</TableHead>
                    <TableHead>Discounted</TableHead>
                    <TableHead>Saved</TableHead>
                    <TableHead>Final</TableHead>
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
            </div>
          </div>
        );
      case "savingsGoal":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Savings Goal Calculator</h3>
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
            <Button onClick={calculateSavingsGoal} className="w-full">
              Calculate Required Discount
            </Button>
            {savingsGoalResult && (
              <Alert>
                <AlertDescription>{savingsGoalResult}</AlertDescription>
              </Alert>
            )}
          </div>
        );
      case "bulkDiscount":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bulk Discount Calculator</h3>
            {bulkItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-end space-y-2 sm:space-y-0 sm:space-x-2 mb-4"
              >
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
                <div className="w-full sm:w-24">
                  <Label htmlFor={`quantity-${index}`} className="block mb-1">
                    Quantity
                  </Label>
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
                  className="w-full sm:w-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              onClick={addBulkItem}
              variant="outline"
              className="w-full mb-4"
            >
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
                  <pre className="whitespace-pre-wrap text-sm">
                    {bulkResult}
                  </pre>
                </AlertDescription>
              </Alert>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-6">
          Discount Calculator
        </CardTitle>
        {isMobile ? (
          <Select onValueChange={setActiveTab} value={activeTab}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a calculator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calculator">Calculator</SelectItem>
              <SelectItem value="history">History</SelectItem>
              <SelectItem value="comparison">Comparison</SelectItem>
              <SelectItem value="savingsGoal">Savings Goal</SelectItem>
              <SelectItem value="bulkDiscount">Bulk Discount</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5 gap-2">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="savingsGoal">Savings Goal</TabsTrigger>
              <TabsTrigger value="bulkDiscount">Bulk Discount</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </CardHeader>
      <CardContent>{renderTabContent()}</CardContent>
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
