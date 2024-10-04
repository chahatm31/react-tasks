import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#FF8042"];

function calculateEMI(principal, rate, tenure, monthly = true) {
  rate = rate / (monthly ? 1200 : 100); // Convert rate to per period rate
  tenure = monthly ? tenure * 12 : tenure; // Convert tenure to months if it's years
  const emi =
    principal *
    rate *
    (Math.pow(1 + rate, tenure) / (Math.pow(1 + rate, tenure) - 1));
  return {
    emi: emi,
    totalInterest: emi * tenure - principal,
    totalPayment: emi * tenure,
  };
}

function LoanInput({ label, value, setValue, min, max, step, suffix = "" }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mb-2"
        suffix={suffix}
      />
      <Slider
        value={[value]}
        onValueChange={(v) => setValue(v[0])}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}

function LoanCard({ title, loanData, setLoanData, monthly }) {
  const { principal, rate, tenure } = loanData;
  const { emi, totalInterest, totalPayment } = calculateEMI(
    principal,
    rate,
    tenure,
    monthly
  );

  return (
    <Card className="w-full sm:w-1/2 p-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <LoanInput
          label="Loan Amount"
          value={principal}
          setValue={(v) => setLoanData({ ...loanData, principal: v })}
          min={1000}
          max={1000000}
          step={1000}
          suffix="$"
        />
        <LoanInput
          label="Interest Rate"
          value={rate}
          setValue={(v) => setLoanData({ ...loanData, rate: v })}
          min={0.1}
          max={20}
          step={0.1}
          suffix="%"
        />
        <LoanInput
          label={monthly ? "Loan Term (Years)" : "Loan Term (Months)"}
          value={tenure}
          setValue={(v) => setLoanData({ ...loanData, tenure: v })}
          min={1}
          max={30}
          step={1}
        />
        <div className="mt-4">
          <div>EMI: ${emi.toFixed(2)}</div>
          <div>Total Interest: ${totalInterest.toFixed(2)}</div>
          <div>Total Payment: ${totalPayment.toFixed(2)}</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={[
                  { name: "Principal", value: principal },
                  { name: "Interest", value: totalInterest },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [monthly, setMonthly] = useState(true);
  const [loan1, setLoan1] = useState({
    principal: 100000,
    rate: 5,
    tenure: 20,
  });
  const [loan2, setLoan2] = useState({
    principal: 150000,
    rate: 5.5,
    tenure: 25,
  });

  useEffect(() => {
    // Reset tenure to years when switching to yearly calculation
    if (!monthly) {
      setLoan1((prev) => ({ ...prev, tenure: Math.round(prev.tenure / 12) }));
      setLoan2((prev) => ({ ...prev, tenure: Math.round(prev.tenure / 12) }));
    }
  }, [monthly]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-end">
        <Switch checked={monthly} onCheckedChange={setMonthly} className="mr-2">
          Monthly
        </Switch>
        <Label>Yearly</Label>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <LoanCard
          title="Loan 1"
          loanData={loan1}
          setLoanData={setLoan1}
          monthly={monthly}
        />
        <LoanCard
          title="Loan 2"
          loanData={loan2}
          setLoanData={setLoan2}
          monthly={monthly}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Loan Comparison</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {[loan1, loan2].map((loan, index) => {
            const { emi, totalInterest, totalPayment } = calculateEMI(
              loan.principal,
              loan.rate,
              loan.tenure,
              monthly
            );
            return (
              <div key={index}>
                <h3 className="font-bold">Loan {index + 1}</h3>
                <p>EMI: ${emi.toFixed(2)}</p>
                <p>Total Interest: ${totalInterest.toFixed(2)}</p>
                <p>Total Payment: ${totalPayment.toFixed(2)}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <Button
        onClick={() =>
          alert("Compare loans functionality can be extended here.")
        }
      >
        Compare Loans
      </Button>
    </div>
  );
}
