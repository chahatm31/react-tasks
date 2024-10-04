import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PieChart, Pie, Cell, Legend } from "recharts";

const calculateEMI = (p, r, n) => {
  const monthlyRate = r / 12 / 100;
  const emi =
    (p * monthlyRate * Math.pow(1 + monthlyRate, n)) /
    (Math.pow(1 + monthlyRate, n) - 1);
  return isNaN(emi) ? 0 : emi;
};

function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(5);
  const [tenure, setTenure] = useState(60);
  const [isYearly, setIsYearly] = useState(false);
  const [loanDetails, setLoanDetails] = useState({});

  useEffect(() => {
    const n = isYearly ? tenure : tenure / 12;
    const emi = calculateEMI(loanAmount, interestRate, n);
    const totalInterest = emi * n - loanAmount;
    const totalPayment = emi * n;

    setLoanDetails({
      emi: emi.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
    });
  }, [loanAmount, interestRate, tenure, isYearly]);

  const data = [
    { name: "Principal", value: parseFloat(loanAmount) },
    { name: "Interest", value: parseFloat(loanDetails.totalInterest) },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Loan Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Loan Amount</label>
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
              <Slider
                value={[loanAmount]}
                onValueChange={([value]) => setLoanAmount(value)}
                max={1000000}
              />
            </div>
            <div>
              <label className="block mb-2">Interest Rate (%)</label>
              <Input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
              <Slider
                value={[interestRate]}
                onValueChange={([value]) => setInterestRate(value)}
                max={20}
              />
            </div>
            <div>
              <label className="block mb-2">
                {isYearly ? "Years" : "Months"}
              </label>
              <Input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
              />
              <Slider
                value={[tenure]}
                onValueChange={([value]) => setTenure(value)}
                max={isYearly ? 30 : 360}
              />
            </div>
            <div>
              <Switch checked={isYearly} onCheckedChange={setIsYearly}>
                Calculate Yearly
              </Switch>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex flex-col items-center">
            <PieChart width={300} height={300}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#8884d8", "#82ca9d"][index % 2]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
            <p>Principal vs Interest</p>
          </div>
          <div>
            <p>EMI: ${loanDetails.emi}</p>
            <p>Total Interest: ${loanDetails.totalInterest}</p>
            <p>Total Payment: ${loanDetails.totalPayment}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  return <LoanCalculator />;
}
