import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Custom component for color selection
const ColorPaletteSelector = ({ value, onChange }) => {
  const palettes = ["Vibrant", "Pastel", "Monochrome", "Nature", "Sunset"];
  return (
    <div className="flex flex-col space-y-2">
      {palettes.map((palette) => (
        <Button
          key={palette}
          variant={value === palette ? "default" : "outline"}
          onClick={() => onChange(palette)}
        >
          {palette}
        </Button>
      ))}
    </div>
  );
};

// IconPreview component to show live updates
const IconPreview = ({
  text,
  size,
  color,
  shape,
  font,
  alignment,
  rotation,
}) => {
  const style = {
    transform: `rotate(${rotation}deg)`,
    backgroundColor: color.bg,
    color: color.text,
  };

  const shapeClass = shape === "circle" ? "rounded-full" : "rounded";
  return (
    <div
      className={`w-${size} h-${size} flex items-center justify-${alignment} ${shapeClass}`}
      style={style}
    >
      <span className={`font-${font.toLowerCase().replace(" ", "-")}`}>
        {text}
      </span>
    </div>
  );
};

// Main App Component
export default function App() {
  const [text, setText] = useState("Icon");
  const [size, setSize] = useState("64");
  const [quantity, setQuantity] = useState(1);
  const [palette, setPalette] = useState("Vibrant");
  const [shape, setShape] = useState("rectangle");
  const [font, setFont] = useState("Arial");
  const [alignment, setAlignment] = useState("center");
  const [rotation, setRotation] = useState(0);
  const [icons, setIcons] = useState([]);

  const sizes = ["32", "64", "128", "256"];
  const fonts = [
    "Arial",
    "Helvetica",
    "Courier New",
    "Times New Roman",
    "Verdana",
    "Georgia",
  ];

  // Function to generate color contrast
  const generateColor = (bgColor) => {
    // Simple logic for color contrast, could be improved
    return parseInt(bgColor.replace("#", ""), 16) > 0xffffff / 2
      ? "#000000"
      : "#FFFFFF";
  };

  const generateIcon = () => {
    let bgColor = "#" + Math.floor(Math.random() * 16777215).toString(16); // Random color
    if (palette !== "Random") {
      // Here you would typically have logic to select from predefined palettes
      // For brevity, this is simplified
    }
    return { bg: bgColor, text: generateColor(bgColor) };
  };

  const generateIcons = () => {
    let newIcons = Array.from({ length: quantity }, generateIcon);
    setIcons(newIcons);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent>
          <h2 className="text-2xl mb-4">Custom Icon Generator</h2>
          <Input
            label="Icon Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Select label="Size" value={size} onValueChange={setSize}>
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}x{s}
              </option>
            ))}
          </Select>
          <Slider
            label="Quantity"
            value={[quantity]}
            onValueChange={setQuantity}
            max={10}
          />
          <ColorPaletteSelector value={palette} onChange={setPalette} />
          <Toggle
            label="Shape"
            onToggle={() =>
              setShape((prev) => (prev === "circle" ? "rectangle" : "circle"))
            }
          />
          <Select label="Font" value={font} onValueChange={setFont}>
            {fonts.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </Select>
          <RadioGroup
            label="Alignment"
            onValueChange={setAlignment}
            defaultValue="center"
          >
            <RadioGroup.Item value="left">Left</RadioGroup.Item>
            <RadioGroup.Item value="center">Center</RadioGroup.Item>
            <RadioGroup.Item value="right">Right</RadioGroup.Item>
          </RadioGroup>
          <Slider
            label="Rotation"
            value={[rotation]}
            onValueChange={setRotation}
            max={360}
          />
          <Button onClick={generateIcons}>Generate Icons</Button>
        </CardContent>
      </Card>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {icons.map((icon, idx) => (
          <Card key={idx} className="relative">
            <IconPreview
              {...{ text, size, color: icon, shape, font, alignment, rotation }}
            />
            <Button className="mt-2">Download</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
