import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, Eye, EyeOff, Copy, RefreshCw, X } from "lucide-react";

export default function App() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState({ level: "Very Weak", score: 0 });
  const [policy, setPolicy] = useState({
    length: 8,
    uppercase: true,
    lowercase: true,
    numbers: true,
    specialChars: true,
  });
  const [history, setHistory] = useState([]);

  const commonPasswords = ["password", "123456", "qwerty"];

  const evaluateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= policy.length) score += 1;
    if (/[a-z]/.test(pwd) && policy.lowercase) score += 1;
    if (/[A-Z]/.test(pwd) && policy.uppercase) score += 1;
    if (/\d/.test(pwd) && policy.numbers) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd) && policy.specialChars) score += 1;

    let level;
    if (score === 0) level = "Very Weak";
    else if (score <= 2) level = "Weak";
    else if (score <= 3) level = "Moderate";
    else if (score === 4) level = "Strong";
    else level = "Very Strong";

    setStrength({ level, score: score * 20 });
  };

  useEffect(() => {
    evaluateStrength(password);
  }, [password, policy]);

  const generatePassword = () => {
    const chars = {
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      numbers: "0123456789",
      special: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
    };
    let newPassword = "";
    let pool = "";
    if (policy.lowercase) pool += chars.lowercase;
    if (policy.uppercase) pool += chars.uppercase;
    if (policy.numbers) pool += chars.numbers;
    if (policy.specialChars) pool += chars.special;

    for (let i = 0; i < policy.length; i++) {
      newPassword += pool.charAt(Math.floor(Math.random() * pool.length));
    }
    setPassword(newPassword);
    setHistory((prev) => [...prev, newPassword.slice(0, 3) + "****"]);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
  };

  return (
    <div className="p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Password Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordInput
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            generatePassword={generatePassword}
            copyToClipboard={copyToClipboard}
          />
          <StrengthIndicator strength={strength} />
          <CriteriaList password={password} policy={policy} />
          <SettingsPopover policy={policy} setPolicy={setPolicy} />
          {strength.level === "Weak" && (
            <Button onClick={generatePassword}>
              Suggest Stronger Password
            </Button>
          )}
          {commonPasswords.includes(password) && (
            <p className="text-red-500">
              Warning: This password is commonly used!
            </p>
          )}
        </CardContent>
        <CardFooter>
          <PasswordHistory history={history} />
        </CardFooter>
      </Card>
    </div>
  );
}

function PasswordInput({
  password,
  setPassword,
  showPassword,
  setShowPassword,
  generatePassword,
  copyToClipboard,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <Input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter or generate a password"
      />
      <Button onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? <EyeOff /> : <Eye />}
      </Button>
      <Button onClick={generatePassword}>
        <RefreshCw />
      </Button>
      <Button onClick={copyToClipboard}>
        <Copy />
      </Button>
    </div>
  );
}

function StrengthIndicator({ strength }) {
  const color = {
    "Very Weak": "bg-red-500",
    Weak: "bg-orange-500",
    Moderate: "bg-yellow-500",
    Strong: "bg-green-500",
    "Very Strong": "bg-blue-500",
  };

  return (
    <div className="mt-4">
      <Progress
        value={strength.score}
        className={`${color[strength.level]} w-full`}
      />
      <p>{strength.level}</p>
    </div>
  );
}

function CriteriaList({ password, policy }) {
  const criteria = [
    { name: "Minimum length", check: password.length >= policy.length },
    {
      name: "Uppercase letters",
      check: policy.uppercase && /[A-Z]/.test(password),
    },
    {
      name: "Lowercase letters",
      check: policy.lowercase && /[a-z]/.test(password),
    },
    { name: "Numbers", check: policy.numbers && /\d/.test(password) },
    {
      name: "Special characters",
      check: policy.specialChars && /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <ul className="list-disc pl-5 mt-4">
      {criteria.map((c, i) => (
        <li key={i} className={c.check ? "text-green-500" : "text-red-500"}>
          {c.name} {c.check ? <Check /> : <X />}
        </li>
      ))}
    </ul>
  );
}

function SettingsPopover({ policy, setPolicy }) {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="outline">Settings</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Label>Minimum Length: {policy.length}</Label>
        <Input
          type="range"
          min="4"
          max="32"
          value={policy.length}
          onChange={(e) =>
            setPolicy({ ...policy, length: parseInt(e.target.value) })
          }
        />
        <Switch
          checked={policy.uppercase}
          onCheckedChange={(checked) =>
            setPolicy({ ...policy, uppercase: checked })
          }
        >
          Uppercase
        </Switch>
        <Switch
          checked={policy.lowercase}
          onCheckedChange={(checked) =>
            setPolicy({ ...policy, lowercase: checked })
          }
        >
          Lowercase
        </Switch>
        <Switch
          checked={policy.numbers}
          onCheckedChange={(checked) =>
            setPolicy({ ...policy, numbers: checked })
          }
        >
          Numbers
        </Switch>
        <Switch
          checked={policy.specialChars}
          onCheckedChange={(checked) =>
            setPolicy({ ...policy, specialChars: checked })
          }
        >
          Special Characters
        </Switch>
      </Popover.Content>
    </Popover>
  );
}

function PasswordHistory({ history }) {
  return (
    <div className="mt-4">
      <h3>Password History</h3>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>
    </div>
  );
}
