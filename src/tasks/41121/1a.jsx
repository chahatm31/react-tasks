import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
// import { formatCurrency } from "@/utils/format";

export default function App() {
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [currentCalculation, setCurrentCalculation] = useState({
    price: "",
    discount: "",
    tax: "",
  });
  const [comparisonDiscounts, setComparisonDiscounts] = useState([
    { discount: 10 },
    { discount: 20 },
  ]);
  const [savingsGoal, setSavingsGoal] = useState({ price: "", goal: "" });
  const [bulkItems, setBulkItems] = useState([{ price: "", quantity: 1 }]);
  const [bulkDiscount, setBulkDiscount] = useState("");

  const performCalculation = () => {
    const { price, discount, tax } = currentCalculation;
    const priceNum = parseFloat(price);
    const discountNum = parseFloat(discount) / 100;
    const taxNum = parseFloat(tax) / 100;
    const discountedPrice = priceNum * (1 - discountNum);
    const finalPrice = discountedPrice * (1 + taxNum);
    const saved = priceNum - discountedPrice;

    const result = {
      original: priceNum,
      discount: discountNum * 100,
      tax: taxNum * 100,
      saved,
      final: finalPrice,
    };

    setCalculationHistory([...calculationHistory, result]);
    setCurrentCalculation({ price: "", discount: "", tax: "" });
  };

  const comparisonResults = useMemo(
    () =>
      comparisonDiscounts.map((item) => {
        const discounted = currentCalculation.price * (1 - item.discount / 100);
        return { ...item, final: discounted };
      }),
    [comparisonDiscounts, currentCalculation.price]
  );

  const calculateSavingsGoal = () => {
    const { price, goal } = savingsGoal;
    const requiredDiscount =
      ((parseFloat(price) - parseFloat(goal)) / parseFloat(price)) * 100;
    return isNaN(requiredDiscount) ? 0 : requiredDiscount;
  };

  const bulkTotal = useMemo(() => {
    let total = bulkItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    return total * (1 - (parseFloat(bulkDiscount) || 0) / 100);
  }, [bulkItems, bulkDiscount]);

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList>
          <Tab value="calculator">Calculator</Tab>
          <Tab value="comparison">Comparison</Tab>
          <Tab value="savings">Savings Goal</Tab>
          <Tab value="bulk">Bulk Discount</Tab>
        </TabsList>
        <TabsContent value="calculator">
          <Calculator
            current={currentCalculation}
            onChange={setCurrentCalculation}
            onCalculate={performCalculation}
            history={calculationHistory}
            onClear={() => setCalculationHistory([])}
          />
        </TabsContent>
        <TabsContent value="comparison">
          <Comparison
            price={currentCalculation.price}
            discounts={comparisonDiscounts}
            setDiscounts={setComparisonDiscounts}
            results={comparisonResults}
          />
        </TabsContent>
        <TabsContent value="savings">
          <SavingsGoal
            savingsGoal={savingsGoal}
            setSavingsGoal={setSavingsGoal}
            requiredDiscount={calculateSavingsGoal()}
          />
        </TabsContent>
        <TabsContent value="bulk">
          <BulkDiscount
            items={bulkItems}
            setItems={setBulkItems}
            discount={bulkDiscount}
            setDiscount={setBulkDiscount}
            total={bulkTotal}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Sub-components would be defined here, like Calculator, Comparison, SavingsGoal, and BulkDiscount
// Each component would handle its UI and logic similarly to the main App component but focused on their specific functionality.
