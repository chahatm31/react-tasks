import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { ToastProvider } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const units = {
  length: ["m", "km", "cm", "mm", "in", "ft", "yd"],
  weight: ["kg", "g", "lb", "oz"],
  volume: ["l", "ml", "gal", "qt"],
  temperature: ["C", "F", "K"],
};

function temperatureConvert(value, from, to) {
  if (from === to) return value;
  if (from === "C") {
    return to === "F" ? (value * 9) / 5 + 32 : value + 273.15;
  }
  if (from === "F") {
    return to === "C"
      ? ((value - 32) * 5) / 9
      : ((value - 32) * 5) / 9 + 273.15;
  }
  return to === "C" ? value - 273.15 : ((value - 273.15) * 9) / 5 + 32;
}

const QuickConvertItem = ({ name, from, to, onClick }) => (
  <Button variant="outline" className="m-1" onClick={() => onClick(from, to)}>
    {name}
  </Button>
);

export default function App() {
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [category, setCategory] = useState("length");
  const [result, setResult] = useState(null);
  const { toast } = useToast();

  const handleConversion = () => {
    let convertedValue = value;
    if (category === "temperature") {
      convertedValue = temperatureConvert(value, fromUnit, toUnit);
    } else {
      // Simple conversion for other units assuming direct proportionality
      convertedValue *=
        (1 / units[category].indexOf(fromUnit)) *
        units[category].indexOf(toUnit);
    }
    setResult(convertedValue);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.toString());
    toast({
      title: "Copied to clipboard!",
      description: `${result} ${toUnit}`,
    });
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen p-4">
      <Tabs defaultValue="main" className="w-full max-w-md mx-auto">
        <TabsList className="bg-gray-700">
          <TabsTrigger value="main">Main Converter</TabsTrigger>
          <TabsTrigger value="quick">Quick Convert</TabsTrigger>
        </TabsList>
        <TabsContent value="main">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Unit Converter</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="mt-2 bg-gray-600 text-white"
              >
                {units[category].map((unit) => (
                  <option key={unit}>{unit}</option>
                ))}
              </select>
              <Button onClick={swapUnits} className="my-2">
                Swap
              </Button>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="bg-gray-600 text-white"
              >
                {units[category].map((unit) => (
                  <option key={unit}>{unit}</option>
                ))}
              </select>
              <Slider
                value={[value]}
                onValueChange={(v) => setValue(v[0])}
                max={1000}
                className="my-4"
              />
              <Button onClick={handleConversion}>Convert</Button>
              {result !== null && (
                <div>
                  <p>{`${result} ${toUnit}`}</p>
                  <Button onClick={copyToClipboard}>Copy Result</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quick">
          {/* Implement Quick Convert UI here */}
          <div>Quick conversions will be listed here.</div>
        </TabsContent>
      </Tabs>
      <Toast.Provider />
    </div>
  );
}
