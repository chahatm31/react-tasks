import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const colorPalettes = {
  Vibrant: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"],
  Pastel: ["#FFD1DC", "#AEC6CF", "#FDEBD0", "#B39DDB", "#D1C4E9"],
  Monochrome: ["#2C3E50", "#34495E", "#7F8C8D", "#BDC3C7", "#ECF0F1"],
  Nature: ["#2ECC71", "#3498DB", "#F1C40F", "#E74C3C", "#9B59B6"],
  Sunset: ["#FFA07A", "#FA8072", "#E9967A", "#F4A460", "#D2691E"],
};

function randomColor(palette) {
  const colors = colorPalettes[palette] || colorPalettes.Vibrant;
  return colors[Math.floor(Math.random() * colors.length)];
}

const fonts = [
  "Arial",
  "Helvetica",
  "Courier New",
  "Times New Roman",
  "Verdana",
  "Georgia",
];

function IconPreview({
  text,
  size,
  colorPalette,
  shape,
  font,
  alignment,
  rotation,
}) {
  const canvasRef = useRef(null);
  const [iconUrl, setIconUrl] = useState(null);

  const drawIcon = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bgColor = randomColor(colorPalette);
    const textColor = contrastColor(bgColor);

    canvas.width = size;
    canvas.height = size;

    // Apply rotation
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-size / 2, -size / 2);

    // Draw background
    ctx.fillStyle = bgColor;
    if (shape === "circle") {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, size, size);
    }

    // Draw text
    ctx.fillStyle = textColor;
    ctx.font = `${size * 0.4}px ${font}`;
    ctx.textAlign = alignment;
    ctx.textBaseline = "middle";
    const textWidth = ctx.measureText(text).width;
    const x =
      alignment === "center"
        ? size / 2
        : alignment === "left"
        ? 10
        : size - textWidth - 10;
    ctx.fillText(text, x, size / 2);

    ctx.restore();

    // Convert canvas to blob for download
    canvas.toBlob((blob) => {
      if (blob) {
        setIconUrl(URL.createObjectURL(blob));
      }
    });
  };

  React.useEffect(drawIcon, [
    text,
    size,
    colorPalette,
    shape,
    font,
    alignment,
    rotation,
  ]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {iconUrl && <img src={iconUrl} alt="Generated Icon" className="mb-2" />}
      {iconUrl && (
        <Button
          onClick={() => {
            const link = document.createElement("a");
            link.download = "icon.png";
            link.href = iconUrl;
            link.click();
          }}
        >
          Download
        </Button>
      )}
    </div>
  );
}

function contrastColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
}

export default function App() {
  const [text, setText] = useState("Icon");
  const [size, setSize] = useState(64);
  const [numIcons, setNumIcons] = useState(1);
  const [colorPalette, setColorPalette] = useState("Vibrant");
  const [shape, setShape] = useState("circle");
  const [font, setFont] = useState("Arial");
  const [alignment, setAlignment] = useState("center");
  const [rotation, setRotation] = useState(0);

  const sizes = [32, 64, 128, 256];

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Icon Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter text for icon"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Select onValueChange={setSize}>
            {sizes.map((s) => (
              <SelectItem key={s} value={s}>
                {s}x{s}
              </SelectItem>
            ))}
          </Select>
          <Slider
            defaultValue={[numIcons]}
            max={10}
            onValueChange={setNumIcons}
          />
          <Select onValueChange={setColorPalette}>
            {Object.keys(colorPalettes).map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </Select>
          <Switch
            onCheckedChange={(checked) =>
              setShape(checked ? "circle" : "square")
            }
            checked={shape === "circle"}
          />
          <Select onValueChange={setFont}>
            {fonts.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </Select>
          <RadioGroup
            onValueChange={setAlignment}
            defaultValue="center"
            className="flex flex-col"
          >
            <RadioGroupItem value="left" id="left">
              Left
            </RadioGroupItem>
            <RadioGroupItem value="center" id="center">
              Center
            </RadioGroupItem>
            <RadioGroupItem value="right" id="right">
              Right
            </RadioGroupItem>
          </RadioGroup>
          <Slider
            defaultValue={[rotation]}
            max={360}
            onValueChange={setRotation}
          />
        </CardContent>
      </Card>

      <div className="mt-4">
        <IconPreview
          text={text}
          size={size}
          colorPalette={colorPalette}
          shape={shape}
          font={font}
          alignment={alignment}
          rotation={rotation}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(numIcons)].map((_, i) => (
          <IconPreview
            key={i}
            text={text}
            size={size}
            colorPalette={colorPalette}
            shape={shape}
            font={font}
            alignment={alignment}
            rotation={rotation + i * 10} // Slight variation for each icon
          />
        ))}
      </div>
    </div>
  );
}
