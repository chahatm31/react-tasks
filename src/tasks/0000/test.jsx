import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Download,
  Palette,
  RefreshCw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCw,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const FONTS = [
  "Arial",
  "Helvetica",
  "Courier New",
  "Times New Roman",
  "Verdana",
  "Georgia",
];
const SIZES = ["32x32", "64x64", "128x128", "256x256"];
const COLOR_PALETTES = {
  Vibrant: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FDCB6E", "#6C5CE7"],
  Pastel: ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7"],
  Monochrome: ["#2C3E50", "#34495E", "#7F8C8D", "#95A5A6", "#BDC3C7"],
  Nature: ["#27AE60", "#2ECC71", "#1ABC9C", "#16A085", "#2980B9"],
  Sunset: ["#E74C3C", "#C0392B", "#D35400", "#E67E22", "#F39C12"],
};

function generateRandomColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}

function extractLetters(text) {
  const words = text.trim().split(/\s+/);
  let letters = words.map((word) => word[0].toUpperCase()).join("");
  if (letters.length > 5) {
    letters = letters
      .split("")
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .join("");
  }
  return letters;
}

function IconCanvas({
  text,
  size,
  bgColor,
  textColor,
  font,
  isCircle,
  textAlign,
  rotation,
  onDownload,
}) {
  const canvasRef = useRef(null);

  const drawIcon = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const [width, height] = size.split("x").map(Number);
    canvas.width = width;
    canvas.height = height;

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-width / 2, -height / 2);

    ctx.fillStyle = bgColor;
    if (isCircle) {
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, width / 2, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, width, height);
    }

    ctx.fillStyle = textColor;
    ctx.textAlign = textAlign;
    ctx.textBaseline = "middle";

    let fontSize = Math.floor(height * 0.5);
    do {
      ctx.font = `${fontSize}px ${font}`;
      fontSize--;
    } while (ctx.measureText(text).width > width * 0.8);

    let textX;
    switch (textAlign) {
      case "left":
        textX = width * 0.1;
        break;
      case "right":
        textX = width * 0.9;
        break;
      default:
        textX = width / 2;
    }

    ctx.fillText(text, textX, height / 2);
    ctx.restore();
  }, [text, size, bgColor, textColor, font, isCircle, textAlign, rotation]);

  useEffect(() => {
    drawIcon();
  }, [drawIcon]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    onDownload(image);
  };

  return (
    <Card className="w-full">
      <CardContent
        className="flex justify-center items-center p-4"
        style={{ minHeight: "150px" }}
      >
        <canvas ref={canvasRef} className="border border-gray-300 shadow-lg" />
      </CardContent>
      <CardFooter>
        <Button onClick={handleDownload} className="w-full">
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const [inputText, setInputText] = useState("");
  const [iconSize, setIconSize] = useState(SIZES[1]);
  const [iconCount, setIconCount] = useState(1);
  const [icons, setIcons] = useState([]);
  const [selectedPalette, setSelectedPalette] = useState("Vibrant");
  const [isCircle, setIsCircle] = useState(true);
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [textAlign, setTextAlign] = useState("center");
  const [rotation, setRotation] = useState(0);
  const [previewIcon, setPreviewIcon] = useState(null);

  useEffect(() => {
    if (inputText) {
      setPreviewIcon({
        text: extractLetters(inputText),
        size: iconSize,
        bgColor:
          COLOR_PALETTES[selectedPalette][
            Math.floor(Math.random() * COLOR_PALETTES[selectedPalette].length)
          ],
        textColor: generateRandomColor(),
        font: selectedFont,
        isCircle,
        textAlign,
        rotation,
      });
    } else {
      setPreviewIcon(null);
    }
  }, [
    inputText,
    iconSize,
    selectedPalette,
    isCircle,
    selectedFont,
    textAlign,
    rotation,
  ]);

  const generateIcons = () => {
    const newIcons = Array.from({ length: iconCount }, () => ({
      text: extractLetters(inputText),
      size: iconSize,
      bgColor:
        COLOR_PALETTES[selectedPalette][
          Math.floor(Math.random() * COLOR_PALETTES[selectedPalette].length)
        ],
      textColor: generateRandomColor(),
      font: selectedFont,
      isCircle,
      textAlign,
      rotation,
    }));
    setIcons(newIcons);
  };

  const handleDownload = (imageData, index) => {
    const link = document.createElement("a");
    link.href = imageData;
    link.download = `icon-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Icon Generator
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="input-text">Text for Icons</Label>
              <Input
                id="input-text"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text for icons"
                className="w-full mt-1"
              />
            </div>
            <div>
              <Label htmlFor="icon-size">Icon Size</Label>
              <Select
                id="icon-size"
                value={iconSize}
                onValueChange={setIconSize}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select icon size" />
                </SelectTrigger>
                <SelectContent>
                  {SIZES.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="icon-count">Number of Icons</Label>
              <Slider
                id="icon-count"
                min={1}
                max={10}
                step={1}
                value={[iconCount]}
                onValueChange={(value) => setIconCount(value[0])}
                className="mt-1"
              />
              <div className="text-center mt-2">{iconCount}</div>
            </div>
            <div>
              <Label htmlFor="color-palette">Color Palette</Label>
              <Select
                id="color-palette"
                value={selectedPalette}
                onValueChange={setSelectedPalette}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select color palette" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(COLOR_PALETTES).map((palette) => (
                    <SelectItem key={palette} value={palette}>
                      {palette}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="font-select">Font</Label>
              <Select
                id="font-select"
                value={selectedFont}
                onValueChange={setSelectedFont}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {FONTS.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="icon-shape"
                checked={isCircle}
                onCheckedChange={setIsCircle}
              />
              <Label htmlFor="icon-shape">Circle Shape</Label>
            </div>
            <div>
              <Label>Text Alignment</Label>
              <RadioGroup
                value={textAlign}
                onValueChange={setTextAlign}
                className="flex justify-between mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="left" id="align-left" />
                  <Label htmlFor="align-left">
                    <AlignLeft className="h-4 w-4" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="center" id="align-center" />
                  <Label htmlFor="align-center">
                    <AlignCenter className="h-4 w-4" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="right" id="align-right" />
                  <Label htmlFor="align-right">
                    <AlignRight className="h-4 w-4" />
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="icon-rotation">Rotation</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="icon-rotation"
                  min={0}
                  max={360}
                  step={1}
                  value={[rotation]}
                  onValueChange={(value) => setRotation(value[0])}
                  className="flex-grow"
                />
                <RotateCw className="h-4 w-4" />
                <span className="w-12 text-right">{rotation}°</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={generateIcons} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" /> Generate Icons
            </Button>
          </CardFooter>
        </Card>
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent
            className="flex justify-center items-center"
            style={{ minHeight: "300px" }}
          >
            {previewIcon ? (
              <IconCanvas
                text={previewIcon.text}
                size={previewIcon.size}
                bgColor={previewIcon.bgColor}
                textColor={previewIcon.textColor}
                font={previewIcon.font}
                isCircle={previewIcon.isCircle}
                textAlign={previewIcon.textAlign}
                rotation={previewIcon.rotation}
                onDownload={() => {}}
              />
            ) : (
              <div className="text-gray-400">Enter text to see a preview</div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
        {icons.map((icon, index) => (
          <IconCanvas
            key={index}
            text={icon.text}
            size={icon.size}
            bgColor={icon.bgColor}
            textColor={icon.textColor}
            font={icon.font}
            isCircle={icon.isCircle}
            textAlign={icon.textAlign}
            rotation={icon.rotation}
            onDownload={(imageData) => handleDownload(imageData, index)}
          />
        ))}
      </div>
    </div>
  );
}
