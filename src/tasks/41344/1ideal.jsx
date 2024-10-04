import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const LoanInput = ({ label, value, onChange, min, max, step }) => (
  <div className="mb-6">
    <Label
      htmlFor={label}
      className="mb-2 block text-sm font-medium text-gray-700"
    >
      {label}
    </Label>
    <div className="flex items-center space-x-4">
      <Input
        type="number"
        id={label}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        className="w-1/2"
      />
    </div>
  </div>
);

const ResultCard = ({ title, value, color }) => (
  <Card className="w-full sm:w-1/2 lg:w-1/3 overflow-hidden transition-all duration-300 hover:shadow-lg">
    <CardHeader className={`${color} text-white`}>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent className="bg-white">
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </CardContent>
  </Card>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-md shadow-md">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-indigo-600">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const LoanPieChart = ({ loanAmount, totalInterest }) => {
  const pieChartData = [
    { name: "Principal", value: loanAmount },
    { name: "Total Interest", value: totalInterest },
  ];
  const COLORS = ["#4F46E5", "#10B981"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

const LoanEMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(10);
  const [loanTenure, setLoanTenure] = useState(12);
  const [emi, setEMI] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isYearly, setIsYearly] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [secondLoanAmount, setSecondLoanAmount] = useState(150000);
  const [secondInterestRate, setSecondInterestRate] = useState(12);
  const [secondLoanTenure, setSecondLoanTenure] = useState(24);
  const [secondEMI, setSecondEMI] = useState(0);
  const [secondTotalInterest, setSecondTotalInterest] = useState(0);
  const [secondTotalAmount, setSecondTotalAmount] = useState(0);

  const calculateLoan = (principal, rate, time) => {
    const r = rate / (isYearly ? 1 : 12) / 100;
    const t = isYearly ? time / 12 : time;
    const emiValue =
      (principal * r * Math.pow(1 + r, t)) / (Math.pow(1 + r, t) - 1);
    const totalAmountValue = emiValue * t;
    const totalInterestValue = totalAmountValue - principal;

    return {
      emi: emiValue,
      totalAmount: totalAmountValue,
      totalInterest: totalInterestValue,
    };
  };

  useEffect(() => {
    const result = calculateLoan(loanAmount, interestRate, loanTenure);
    setEMI(result.emi);
    setTotalAmount(result.totalAmount);
    setTotalInterest(result.totalInterest);

    const secondResult = calculateLoan(
      secondLoanAmount,
      secondInterestRate,
      secondLoanTenure
    );
    setSecondEMI(secondResult.emi);
    setSecondTotalAmount(secondResult.totalAmount);
    setSecondTotalInterest(secondResult.totalInterest);
  }, [
    loanAmount,
    interestRate,
    loanTenure,
    secondLoanAmount,
    secondInterestRate,
    secondLoanTenure,
    isYearly,
  ]);

  const renderComparison = () => {
    return (
      <Card className="mt-6 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardTitle>Loan Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Details</TableHead>
                <TableHead className="font-semibold">Loan 1</TableHead>
                <TableHead className="font-semibold">Loan 2</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Loan Amount</TableCell>
                <TableCell>{formatCurrency(loanAmount)}</TableCell>
                <TableCell>{formatCurrency(secondLoanAmount)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Interest Rate</TableCell>
                <TableCell>{interestRate}%</TableCell>
                <TableCell>{secondInterestRate}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Loan Tenure</TableCell>
                <TableCell>
                  {loanTenure} {isYearly ? "years" : "months"}
                </TableCell>
                <TableCell>
                  {secondLoanTenure} {isYearly ? "years" : "months"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>EMI</TableCell>
                <TableCell>{formatCurrency(emi)}</TableCell>
                <TableCell>{formatCurrency(secondEMI)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Interest</TableCell>
                <TableCell>{formatCurrency(totalInterest)}</TableCell>
                <TableCell>{formatCurrency(secondTotalInterest)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Amount</TableCell>
                <TableCell>{formatCurrency(totalAmount)}</TableCell>
                <TableCell>{formatCurrency(secondTotalAmount)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="mt-6 flex flex-col md:flex-row justify-between">
            <div className="w-full md:w-1/2 mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2 text-center">Loan 1</h3>
              <LoanPieChart
                loanAmount={loanAmount}
                totalInterest={totalInterest}
              />
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-lg font-semibold mb-2 text-center">Loan 2</h3>
              <LoanPieChart
                loanAmount={secondLoanAmount}
                totalInterest={secondTotalInterest}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <CardTitle className="text-3xl font-bold">
            Loan EMI Calculator
          </CardTitle>
          <CardDescription className="text-gray-100">
            Calculate your {isYearly ? "yearly" : "monthly"} loan payments
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-gray-50">
          <div className="mb-6 space-y-6">
            <div className="flex items-center space-x-2 pt-4">
              <Switch
                id="yearly-mode"
                checked={isYearly}
                onCheckedChange={setIsYearly}
              />
              <Label htmlFor="yearly-mode" className="text-gray-700">
                Yearly Calculation
              </Label>
            </div>
            <LoanInput
              label={`Loan Amount ($)`}
              value={loanAmount}
              onChange={setLoanAmount}
              min={1000}
              max={1000000}
              step={1000}
            />
            <LoanInput
              label="Interest Rate (%)"
              value={interestRate}
              onChange={setInterestRate}
              min={1}
              max={30}
              step={0.1}
            />
            <LoanInput
              label={`Loan Tenure (${isYearly ? "years" : "months"})`}
              value={loanTenure}
              onChange={setLoanTenure}
              min={isYearly ? 1 : 12}
              max={isYearly ? 30 : 360}
              step={1}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <ResultCard
              title={`${isYearly ? "Yearly" : "Monthly"} EMI`}
              value={formatCurrency(emi)}
              color="bg-indigo-600"
            />
            <ResultCard
              title="Total Interest"
              value={formatCurrency(totalInterest)}
              color="bg-green-600"
            />
            <ResultCard
              title="Total Amount"
              value={formatCurrency(totalAmount)}
              color="bg-purple-600"
            />
          </div>
          <div className="mt-8">
            <LoanPieChart
              loanAmount={loanAmount}
              totalInterest={totalInterest}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start bg-gray-100 p-6">
          <Button
            onClick={() => setComparisonMode(!comparisonMode)}
            className="mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white transition-all duration-300 hover:from-pink-600 hover:to-purple-600"
          >
            {comparisonMode ? "Hide Comparison" : "Compare Loans"}
          </Button>
          {comparisonMode && (
            <div className="w-full space-y-4">
              <LoanInput
                label="Loan Amount 2 ($)"
                value={secondLoanAmount}
                onChange={setSecondLoanAmount}
                min={1000}
                max={1000000}
                step={1000}
              />
              <LoanInput
                label="Interest Rate 2 (%)"
                value={secondInterestRate}
                onChange={setSecondInterestRate}
                min={1}
                max={30}
                step={0.1}
              />
              <LoanInput
                label={`Loan Tenure 2 (${isYearly ? "years" : "months"})`}
                value={secondLoanTenure}
                onChange={setSecondLoanTenure}
                min={isYearly ? 1 : 12}
                max={isYearly ? 30 : 360}
                step={1}
              />
              {renderComparison()}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-8">
      <LoanEMICalculator />
    </div>
  );
}
