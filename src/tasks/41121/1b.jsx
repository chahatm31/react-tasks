// import React, { useState, useContext, createContext } from 'react';
// import { Button, Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// const CalculatorContext = createContext();

// function MainCalculator() {
//   const [originalPrice, setOriginalPrice] = useState('');
//   const [discount, setDiscount] = useState('');
//   const [tax, setTax] = useState('');
//   const { addHistory } = useContext(CalculatorContext);

//   const calculate = () => {
//     const price = parseFloat(originalPrice);
//     const disc = parseFloat(discount) || 0;
//     const taxRate = parseFloat(tax) || 0;
//     const discountAmount = price * (disc / 100);
//     const priceAfterDiscount = price - discountAmount;
//     const finalPrice = priceAfterDiscount * (1 + taxRate / 100);

//     addHistory({
//       original: price,
//       discount: disc,
//       tax: taxRate,
//       final: finalPrice,
//       saved: discountAmount + (priceAfterDiscount * taxRate / 100)
//     });
//   };

//   return (
//     <Card className="mb-4 sm:mb-6">
//       <CardHeader>
//         <CardTitle>Discount Calculator</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="grid gap-4 sm:grid-cols-2">
//           <div>
//             <Label htmlFor="price">Original Price</Label>
//             <Input id="price" type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} placeholder="0.00" />
//           </div>
//           <div>
//             <Label htmlFor="discount">Discount (%)</Label>
//             <Input id="discount" type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="0" />
//           </div>
//           <div>
//             <Label htmlFor="tax">Tax (%)</Label>
//             <Input id="tax" type="number" value={tax} onChange={e => setTax(e.target.value)} placeholder="0" />
//           </div>
//         </div>
//         <Button className="mt-4 w-full" onClick={calculate}>Calculate</Button>
//       </CardContent>
//     </Card>
//   );
// }

// function History() {
//   const { history, clearHistory } = useContext(CalculatorContext);

//   return (
//     <Card className="mb-4 sm:mb-6">
//       <CardHeader>
//         <CardTitle>Calculation History</CardTitle>
//       </CardHeader>
//       <CardContent className="p-0">
//         <ul className="divide-y divide-gray-200">
//           {history.map((entry, index) => (
//             <li key={index} className="px-4 py-2">
//               <div>Original: ${entry.original.toFixed(2)}</div>
//               <div>Discount: {entry.discount}%</div>
//               <div>Tax: {entry.tax}%</div>
//               <div>Final: ${entry.final.toFixed(2)}</div>
//               <div>Saved: ${entry.saved.toFixed(2)}</div>
//             </li>
//           ))}
//         </ul>
//       </CardContent>
//       <CardFooter>
//         <Button onClick={clearHistory}>Clear History</Button>
//       </CardFooter>
//     </Card>
//   );
// }

// function DiscountComparison() {
//   const [price, setPrice] = useState('');
//   const [discounts, setDiscounts] = useState([{value: ''}]);

//   const addDiscount = () => setDiscounts([...discounts, {value: ''}]);

//   const removeDiscount = (index) => {
//     const updatedDiscounts = [...discounts];
//     updatedDiscounts.splice(index, 1);
//     setDiscounts(updatedDiscounts);
//   };

//   return (
//     <Card className="mb-4 sm:mb-6">
//       <CardHeader>
//         <CardTitle>Discount Comparison</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div>
//           <Label htmlFor="compPrice">Original Price</Label>
//           <Input id="compPrice" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" />
//         </div>
//         {discounts.map((disc, index) => (
//           <div key={index} className="mt-2 flex items-center">
//             <Input 
//               type="number" 
//               value={disc.value} 
//               onChange={e => {
//                 const newDiscounts = [...discounts];
//                 newDiscounts[index].value = e.target.value;
//                 setDiscounts(newDiscounts);
//               }} 
//               placeholder={`Discount ${index + 1}`} 
//             />
//             <Button className="ml-2" onClick={() => removeDiscount(index)}>Remove</Button>
//           </div>
//         ))}
//         <Button className="mt-2" onClick={addDiscount}>Add Discount</Button>
//         <div className="mt-4">
//           {discounts.map((disc, index) => {
//             if (!disc.value) return null;
//             const finalPrice = price * (1 - disc.value / 100);
//             return (
//               <div key={index}>
//                 {disc.value}% off: <strong>${finalPrice.toFixed(2)}</strong>
//               </div>
//             );
//           })}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function SavingsGoalCalculator() {
//   const [price, setPrice] = useState('');
//   const [savingsGoal, setSavingsGoal] = useState('');
//   const [requiredDiscount, setRequiredDiscount] = useState(null);

//   const calculateDiscount = () => {
//     const p = parseFloat(price);
//     const goal = parseFloat(savingsGoal);
//     if (p > 0 && goal > 0) {
//       const discount = (1 - (p - goal) / p) * 100;
//       setRequiredDiscount(discount);
//     }
//   };

//   return (
//     <Card className="mb-4 sm:mb-6">
//       <CardHeader>
//         <CardTitle>Savings Goal Calculator</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="grid gap-4 sm:grid-cols-2">
//           <div>
//             <Label htmlFor="savingsPrice">Original Price</Label>
//             <Input id="savingsPrice" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" />
//           </div>
//           <div>
//             <Label htmlFor="savingsGoal">Desired Savings</Label>
//             <Input id="savingsGoal" type="number" value={savingsGoal} onChange={e => setSavingsGoal(e.target.value)} placeholder="0.00" />
//           </div>
//         </div>
//         <Button className="mt-4 w-full" onClick={calculateDiscount}>Calculate Discount</Button>
//         {requiredDiscount !== null && <p className="mt-2">Required Discount: {requiredDiscount.toFixed(2)}%</p>}
//       </CardContent>
//     </Card>
//   );
// }

// function BulkDiscountCalculator() {
//   const [items, setItems] = useState([{price: '', quantity: ''}]);
//   const [bulkDiscount, setBulkDiscount] = useState('');

//   const addItem = () => setItems([...items, {price: '', quantity: ''}]);

//   const removeItem = (index) => {
//     const updatedItems = [...items];
//     updatedItems.splice(index, 1);
//     setItems(updatedItems);
//   };

//   const calculateTotal = () => {
//     const totalBeforeDiscount = items.reduce((acc, item) => 
//       acc + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0), 0);
//     const discount = parseFloat(bulkDiscount) || 0;
//     const totalSavings = totalBeforeDiscount * (discount / 100);
//     const totalAfterDiscount = totalBeforeDiscount - totalSavings;

//     return { totalBeforeDiscount, totalSavings, totalAfterDiscount };
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Bulk Discount Calculator</CardTitle>
//       </CardHeader>
//       <CardContent>
//         {items.map((item, index) => (
//           <div key={index} className="grid gap-4 mb-2 sm:grid-cols-3">
//             <Input 
//               type="number" 
//               value={item.price} 
//               onChange={e => {
//                 const newItems = [...items];
//                 newItems[index].price = e.target.value;
//                 setItems(newItems);
//               }} 
//               placeholder="Price"
//             />
//             <Input 
//               type="number" 
//               value={item.quantity} 
//               onChange={e => {
//                 const newItems = [...items];
//                 newItems[index].quantity = e.target.value;
//                 setItems(newItems);
//               }} 
//               placeholder="Quantity"
//             />
//             <Button onClick={() => removeItem(index)}>Remove</Button>
//           </div>
//         ))}
//         <Button className="mt-2" onClick={addItem}>Add Item</Button>
//         <div className="mt-4">
//           <Label htmlFor="bulkDiscount">Bulk Discount (%)</Label>
//           <Input id="bulkDiscount" type="number" value={bulkDiscount} onChange={e => setBulkDiscount(e.target.value)} placeholder="0" />
//         </div>
//         <div className="mt-4">
//           {let { totalBeforeDiscount, totalSavings, totalAfterDiscount } = calculateTotal();
//           <div>Total Before Discount: ${totalBeforeDiscount.toFixed(2)}</div>
//           <div>Total Savings: ${totalSavings.toFixed(2)}</div>
//           <div>Total After Discount: ${totalAfterDiscount.toFixed(2)}</div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// export default function App() {
//   const [history, setHistory] = useState([]);

//   const addHistory = (entry) => {
//     setHistory(prev => [...prev, entry]);
//   };

//   const clearHistory = () => {
//     setHistory([]);
//   };

//   return (
//     <CalculatorContext.Provider value={{ history, addHistory, clearHistory }}>
//       <div className="container mx-auto p-4 sm:p-6">
//         <h1 className="text-2xl font-bold mb-6 sm:mb-8">Discount Tools</h1>
//         <MainCalculator />
//         <History />
//         <DiscountComparison />
//         <SavingsGoalCalculator />
//         <BulkDiscountCalculator />
//       </div>
//     </CalculatorContext.Provider>
//   );
// }