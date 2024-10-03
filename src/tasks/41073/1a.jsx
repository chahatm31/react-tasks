import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/toast";
import { ToastProvider } from "@/components/ui/toast";
import { Check, Copy, SwapVert, Plus, Trash2 } from "lucide-react";

const units = {
  length: ["m", "cm", "km", "in", "ft", "mi"],
  weight: ["kg", "g", "lb", "oz"],
  volume: ["l", "ml", "gal", "qt"],
  temperature: ["C", "F", "K"],
};

function convert(value, fromUnit, toUnit, type) {
  if (fromUnit === toUnit) return value;
  let result = value;

  // Base conversion logic, can be expanded
  if (type === "temperature") {
    if (fromUnit === "C" && toUnit === "F") return (value * 9) / 5 + 32;
    if (fromUnit === "F" && toUnit === "C") return ((value - 32) * 5) / 9;
    if (fromUnit === "K") result -= 273.15;
    if (toUnit === "K") result += 273.15;
  } else {
    // Simple ratio for other types - needs refinement for accuracy
    const ratios = {
      m: 1,
      cm: 0.01,
      km: 1000,
      in: 0.0254,
      ft: 0.3048,
      mi: 1609.34,
    };
    result *= ratios[toUnit] / ratios[fromUnit];
  }

  return result.toFixed(2);
}

function Converter() {
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [type, setType] = useState("length");
  const [result, setResult] = useState(convert(1, "m", "ft", "length"));
  const [favorites, setFavorites] = useState([]);
  const [customConversions, setCustomConversions] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    setResult(convert(value, fromUnit, toUnit, type));
  }, [value, fromUnit, toUnit, type]);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied!",
      description: "Conversion result copied to clipboard.",
    });
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const addFavorite = () => {
    const newFavorite = { fromUnit, toUnit, type };
    if (
      !favorites.some(
        (f) => f.fromUnit === fromUnit && f.toUnit === toUnit && f.type === type
      )
    ) {
      setFavorites([...favorites, newFavorite]);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto sm:mt-10">
      <CardHeader>
        <CardTitle>Unit Converter</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="main">
          <TabsList>
            <TabsTrigger value="main">Main Converter</TabsTrigger>
            <TabsTrigger value="quick">Quick Convert</TabsTrigger>
          </TabsList>
          <TabsContent value="main">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mb-2"
            />
            <Slider
              value={[value]}
              onValueChange={[setValue]}
              max={1000}
              className="mb-4"
            />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label>From</Label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {units[type].map((unit) => (
                    <option key={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>To</Label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {units[type].map((unit) => (
                    <option key={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
            <Label>Unit Type</Label>
            <select
              onChange={(e) => setType(e.target.value)}
              className="mb-4 p-2 border rounded w-full"
            >
              {Object.keys(units).map((key) => (
                <option key={key}>{key}</option>
              ))}
            </select>
            <Button
              onClick={handleSwap}
              variant="outline"
              className="mb-2 w-full"
            >
              <SwapVert /> Swap
            </Button>
            <div className="flex items-center justify-between">
              <Button onClick={handleCopy} className="w-full mr-2">
                <Copy /> Copy
              </Button>
              <Button onClick={addFavorite} className="w-full">
                <Plus />
              </Button>
            </div>
            <p className="mt-4 text-lg">
              Result: {result} {toUnit}
            </p>
          </TabsContent>
          <TabsContent value="quick">
            <div>
              {favorites.map((fav, idx) => (
                <Button
                  key={idx}
                  onClick={() => {
                    setFromUnit(fav.fromUnit);
                    setToUnit(fav.toUnit);
                    setType(fav.type);
                  }}
                  variant="ghost"
                  className="mb-2 mr-2"
                >
                  {fav.fromUnit} to {fav.toUnit}{" "}
                  <Trash2
                    size={16}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFavorites(favorites.filter((_, i) => i !== idx));
                    }}
                    className="ml-2"
                  />
                </Button>
              ))}
            </div>
            {/* Placeholder for custom conversions */}
            <Button
              onClick={() =>
                setCustomConversions([
                  ...customConversions,
                  { from: "", to: "" },
                ])
              }
              variant="secondary"
            >
              Add Custom
            </Button>
            {customConversions.map((conv, idx) => (
              <div key={idx} className="mt-2">
                <Input
                  placeholder="From"
                  value={conv.from}
                  onChange={(e) => {
                    let newConvs = [...customConversions];
                    newConvs[idx].from = e.target.value;
                    setCustomConversions(newConvs);
                  }}
                />
                <Input
                  placeholder="To"
                  value={conv.to}
                  onChange={(e) => {
                    let newConvs = [...customConversions];
                    newConvs[idx].to = e.target.value;
                    setCustomConversions(newConvs);
                  }}
                />
                <Button
                  onClick={() =>
                    setCustomConversions(
                      customConversions.filter((_, i) => i !== idx)
                    )
                  }
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <Toast.Provider>
        <Converter />
      </Toast.Provider>
    </div>
  );
}
