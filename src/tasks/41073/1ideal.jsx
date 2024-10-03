import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const conversionFactors = {
  length: {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    inch: 0.0254,
    foot: 0.3048,
    yard: 0.9144,
    mile: 1609.34,
  },
  weight: {
    kilogram: 1,
    gram: 0.001,
    milligram: 0.000001,
    tonne: 1000,
    pound: 0.453592,
    ounce: 0.0283495,
  },
  volume: {
    liter: 1,
    milliliter: 0.001,
    cubicMeter: 1000,
    gallon: 3.78541,
    quart: 0.946353,
    pint: 0.473176,
    cup: 0.236588,
  },
  temperature: {
    celsius: 0,
    fahrenheit: 32,
    kelvin: 273.15,
  },
};

const defaultQuickConversions = {
  length: [
    { from: "meter", to: "foot", label: "m to ft" },
    { from: "kilometer", to: "mile", label: "km to mi" },
    { from: "centimeter", to: "inch", label: "cm to in" },
  ],
  weight: [
    { from: "kilogram", to: "pound", label: "kg to lb" },
    { from: "gram", to: "ounce", label: "g to oz" },
    { from: "tonne", to: "pound", label: "t to lb" },
  ],
  volume: [
    { from: "liter", to: "gallon", label: "L to gal" },
    { from: "milliliter", to: "cup", label: "mL to cup" },
    { from: "cubicMeter", to: "gallon", label: "m³ to gal" },
  ],
  temperature: [
    { from: "celsius", to: "fahrenheit", label: "°C to °F" },
    { from: "fahrenheit", to: "celsius", label: "°F to °C" },
    { from: "celsius", to: "kelvin", label: "°C to K" },
  ],
};

const UnitConverter = ({ category }) => {
  const [fromUnit, setFromUnit] = useState(
    Object.keys(conversionFactors[category])[0]
  );
  const [toUnit, setToUnit] = useState(
    Object.keys(conversionFactors[category])[1]
  );
  const [fromValue, setFromValue] = useState("1");
  const [toValue, setToValue] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [sliderValue, setSliderValue] = useState(1);
  const [quickConversions, setQuickConversions] = useState(
    defaultQuickConversions
  );
  const [newQuickConvert, setNewQuickConvert] = useState({
    from: "",
    to: "",
    label: "",
  });

  useEffect(() => {
    convertValue(fromValue);
  }, [category, fromUnit, toUnit, fromValue]);

  const convertValue = (value) => {
    let result;
    if (category === "temperature") {
      result = convertTemperature(parseFloat(value), fromUnit, toUnit);
    } else {
      const fromFactor = conversionFactors[category][fromUnit];
      const toFactor = conversionFactors[category][toUnit];
      result = (parseFloat(value) * fromFactor) / toFactor;
    }
    setToValue(isNaN(result) ? "" : result.toFixed(6));
  };

  const convertTemperature = (value, from, to) => {
    if (from === to) return value;
    if (from === "celsius") {
      if (to === "fahrenheit") return (value * 9) / 5 + 32;
      if (to === "kelvin") return value + 273.15;
    }
    if (from === "fahrenheit") {
      if (to === "celsius") return ((value - 32) * 5) / 9;
      if (to === "kelvin") return ((value - 32) * 5) / 9 + 273.15;
    }
    if (from === "kelvin") {
      if (to === "celsius") return value - 273.15;
      if (to === "fahrenheit") return ((value - 273.15) * 9) / 5 + 32;
    }
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(toValue);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddFavorite = () => {
    const newFavorite = { category, fromUnit, toUnit, fromValue, toValue };
    setFavorites([...favorites, newFavorite]);
  };

  const handleRemoveFavorite = (index) => {
    const newFavorites = favorites.filter((_, i) => i !== index);
    setFavorites(newFavorites);
  };

  const handleSelectFavorite = (favorite) => {
    setFromUnit(favorite.fromUnit);
    setToUnit(favorite.toUnit);
    setFromValue(favorite.fromValue);
    setToValue(favorite.toValue);
  };

  const handleSliderChange = (value) => {
    setSliderValue(value[0]);
    setFromValue(value[0].toString());
  };

  const handleQuickConvert = (from, to) => {
    setFromUnit(from);
    setToUnit(to);
    convertValue(fromValue);
  };

  const handleAddCustomQuickConvert = () => {
    if (newQuickConvert.from && newQuickConvert.to && newQuickConvert.label) {
      setQuickConversions({
        ...quickConversions,
        [category]: [...quickConversions[category], newQuickConvert],
      });
      setNewQuickConvert({ from: "", to: "", label: "" });
    }
  };

  const handleRemoveQuickConvert = (index) => {
    const newQuickConversions = quickConversions[category].filter(
      (_, i) => i !== index
    );
    setQuickConversions({
      ...quickConversions,
      [category]: newQuickConversions,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-900 text-gray-100">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-purple-400">
          {category.charAt(0).toUpperCase() + category.slice(1)} Converter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="converter" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger
              value="converter"
              className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
            >
              Converter
            </TabsTrigger>
            <TabsTrigger
              value="quickConvert"
              className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
            >
              Quick Convert
            </TabsTrigger>
          </TabsList>
          <TabsContent value="converter">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromValue" className="text-gray-300">
                  From:
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="fromValue"
                    type="number"
                    value={fromValue}
                    onChange={(e) => setFromValue(e.target.value)}
                    className="flex-grow bg-gray-800 border-gray-700 text-white"
                  />
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {Object.keys(conversionFactors[category]).map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="toValue" className="text-gray-300">
                  To:
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="toValue"
                    type="number"
                    value={toValue}
                    readOnly
                    className="flex-grow bg-gray-800 border-gray-700 text-white"
                  />
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {Object.keys(conversionFactors[category]).map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Slider
                value={[sliderValue]}
                onValueChange={handleSliderChange}
                max={100}
                step={0.1}
                className="mb-4"
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleSwapUnits}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  ↕️ Swap Units
                </Button>
                <Button
                  onClick={handleCopyToClipboard}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  📋 Copy Result
                </Button>
                <Button
                  onClick={handleAddFavorite}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  ⭐ Add Favorite
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="quickConvert">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {quickConversions[category].map((conversion, index) => (
                  <div key={index} className="flex items-center">
                    <Button
                      onClick={() =>
                        handleQuickConvert(conversion.from, conversion.to)
                      }
                      className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      {conversion.label}
                    </Button>
                    <Button
                      onClick={() => handleRemoveQuickConvert(index)}
                      variant="ghost"
                      size="sm"
                      className="ml-2 text-red-400 hover:text-red-300"
                    >
                      🗑️
                    </Button>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newQuickConvertFrom" className="text-gray-300">
                  Add Custom Quick Convert:
                </Label>
                <div className="flex space-x-2">
                  <Select
                    value={newQuickConvert.from}
                    onValueChange={(value) =>
                      setNewQuickConvert({ ...newQuickConvert, from: value })
                    }
                  >
                    <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="From" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {Object.keys(conversionFactors[category]).map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={newQuickConvert.to}
                    onValueChange={(value) =>
                      setNewQuickConvert({ ...newQuickConvert, to: value })
                    }
                  >
                    <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="To" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {Object.keys(conversionFactors[category]).map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  type="text"
                  placeholder="Label (e.g., 'm to ft')"
                  value={newQuickConvert.label}
                  onChange={(e) =>
                    setNewQuickConvert({
                      ...newQuickConvert,
                      label: e.target.value,
                    })
                  }
                  className="w-full bg-gray-800 border-gray-700 text-white"
                />
                <Button
                  onClick={handleAddCustomQuickConvert}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Add Custom Quick Convert
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        {favorites.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-purple-400">
              Favorite Conversions
            </h3>
            <ul className="space-y-2">
              {favorites.map((favorite, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-800 p-2 rounded"
                >
                  <button
                    onClick={() => handleSelectFavorite(favorite)}
                    className="text-left flex-grow text-gray-300"
                  >
                    {favorite.fromValue} {favorite.fromUnit} ={" "}
                    {favorite.toValue} {favorite.toUnit}
                  </button>
                  <Button
                    onClick={() => handleRemoveFavorite(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    🗑️
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-2 rounded shadow-lg">
          Copied to clipboard!
        </div>
      )}
    </Card>
  );
};

const App = () => {
  const [activeCategory, setActiveCategory] = useState("length");

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-400">
          Unit Conversion Tool
        </h1>
        <div className="bg-gray-900 shadow-lg rounded-lg overflow-hidden">
          <div className="flex flex-wrap sm:flex-nowrap">
            {["length", "weight", "volume", "temperature"].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeCategory === category
                    ? "bg-purple-700 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          <div className="p-6">
            <UnitConverter category={activeCategory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
