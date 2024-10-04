import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
  Check,
  Settings,
  History,
} from "lucide-react";

const strengthLevels = [
  { label: "Very Weak", color: "bg-red-500" },
  { label: "Weak", color: "bg-orange-500" },
  { label: "Moderate", color: "bg-yellow-500" },
  { label: "Strong", color: "bg-green-500" },
  { label: "Very Strong", color: "bg-blue-500" },
];

const commonPasswords = [
  "123456", "password", "12345678", "qwerty", "123456789", "12345", "1234",
  "111111", "1234567", "dragon", "123123", "baseball", "abc123", "football",
  "monkey", "letmein", "shadow", "master", "666666", "qwertyuiop",
];

const StrengthIndicator = ({ strength }) => (
  <div className="mt-4">
    <div className="flex justify-between mb-2">
      <span className="text-sm font-medium">
        Strength: {strengthLevels[strength].label}
      </span>
    </div>
    <Progress
      value={(strength + 1) * 20}
      className={strengthLevels[strength].color}
    />
  </div>
);

const Criterion = ({ label, met }) => (
  <div className="flex items-center space-x-2">
    {met ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )}
    <span className={met ? "text-green-700" : "text-red-700"}>{label}</span>
  </div>
);

const PasswordCriteria = ({ password, policy }) => {
  const criteria = [
    { label: `At least ${policy.minLength} characters`, check: (pwd) => pwd.length >= policy.minLength, required: true },
    { label: "Contains lowercase", check: (pwd) => /[a-z]/.test(pwd), required: policy.requireLowercase },
    { label: "Contains uppercase", check: (pwd) => /[A-Z]/.test(pwd), required: policy.requireUppercase },
    { label: "Contains numbers", check: (pwd) => /\d/.test(pwd), required: policy.requireNumbers },
    { label: "Contains special characters", check: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), required: policy.requireSpecial },
  ];

  const activeCriteria = criteria.filter(criterion => criterion.required);

  return (
    <div className="mt-4 space-y-2">
      {activeCriteria.map((criterion, index) => (
        <Criterion
          key={index}
          label={criterion.label}
          met={criterion.check(password)}
        />
      ))}
    </div>
  );
};

const generatePassword = (policy) => {
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const specialChars = '!@#$%^&*(),.?":{}|<>';

  let charset = "";
  if (policy.requireLowercase) charset += lowercaseChars;
  if (policy.requireUppercase) charset += uppercaseChars;
  if (policy.requireNumbers) charset += numberChars;
  if (policy.requireSpecial) charset += specialChars;

  let password = "";
  for (let i = 0; i < policy.minLength; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    password =
      lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)] +
      password.slice(1);
  }
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    password =
      password.slice(0, -1) +
      uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
  }
  if (policy.requireNumbers && !/\d/.test(password)) {
    const pos = Math.floor(Math.random() * (password.length - 1)) + 1;
    password =
      password.slice(0, pos) +
      numberChars[Math.floor(Math.random() * numberChars.length)] +
      password.slice(pos + 1);
  }
  if (policy.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    const pos = Math.floor(Math.random() * (password.length - 2)) + 1;
    password =
      password.slice(0, pos) +
      specialChars[Math.floor(Math.random() * specialChars.length)] +
      password.slice(pos + 1);
  }

  return password;
};

const suggestStrongerPassword = (currentPassword, policy) => {
  let newPassword = currentPassword;

  if (policy.requireLowercase && !/[a-z]/.test(newPassword)) {
    newPassword += "a";
  }
  if (policy.requireUppercase && !/[A-Z]/.test(newPassword)) {
    newPassword += "A";
  }
  if (policy.requireNumbers && !/\d/.test(newPassword)) {
    newPassword += "1";
  }
  if (policy.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
    newPassword += "!";
  }

  while (newPassword.length < policy.minLength) {
    newPassword += generatePassword(policy).charAt(0);
  }

  return newPassword;
};

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [policy, setPolicy] = useState({
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecial: true,
  });

  useEffect(() => {
    const calculateStrength = (pwd) => {
      let score = 0;
      if (pwd.length >= policy.minLength) score++;
      if (pwd.length >= policy.minLength + 4) score++;
      if (policy.requireLowercase && /[a-z]/.test(pwd)) score++;
      if (policy.requireUppercase && /[A-Z]/.test(pwd)) score++;
      if (policy.requireNumbers && /\d/.test(pwd)) score++;
      if (policy.requireSpecial && /[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;
      return Math.min(Math.floor(score / 1.5), 4);
    };

    setStrength(calculateStrength(password));

    if (password && !passwordHistory.includes(password)) {
      setPasswordHistory((prev) => [password, ...prev].slice(0, 5));
    }
  }, [password, policy]);

  const handleGeneratePassword = () => {
    setPassword(generatePassword(policy));
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSuggestStrongerPassword = () => {
    setPassword(suggestStrongerPassword(password, policy));
  };

  const handleRevertPassword = (oldPassword) => {
    setPassword(oldPassword);
  };

  const isCommonPassword = commonPasswords.includes(password.toLowerCase());

  const renderPasswordPreview = (pwd) => {
    if (pwd.length <= 3) return pwd;
    return pwd.slice(0, 3) + "*".repeat(Math.max(0, pwd.length - 3));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Password Strength Checker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enter your password
              </label>
              <div className="flex">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Type your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-7"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleGeneratePassword}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Generate a strong password</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleCopyPassword}>
                      {copied ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy password to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Policy
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">
                        Password Policy
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Customize your password requirements
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="minLength">Min Length</Label>
                        <Slider
                          id="minLength"
                          min={6}
                          max={20}
                          step={1}
                          value={[policy.minLength]}
                          onValueChange={([value]) =>
                            setPolicy((prev) => ({ ...prev, minLength: value }))
                          }
                          className="col-span-2 w-[100px]"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="lowercase"
                          checked={policy.requireLowercase}
                          onCheckedChange={(checked) =>
                            setPolicy((prev) => ({
                              ...prev,
                              requireLowercase: checked,
                            }))
                          }
                        />
                        <Label htmlFor="lowercase">Require Lowercase</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="uppercase"
                          checked={policy.requireUppercase}
                          onCheckedChange={(checked) =>
                            setPolicy((prev) => ({
                              ...prev,
                              requireUppercase: checked,
                            }))
                          }
                        />
                        <Label htmlFor="uppercase">Require Uppercase</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="numbers"
                          checked={policy.requireNumbers}
                          onCheckedChange={(checked) =>
                            setPolicy((prev) => ({
                              ...prev,
                              requireNumbers: checked,
                            }))
                          }
                        />
                        <Label htmlFor="numbers">Require Numbers</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="special"
                          checked={policy.requireSpecial}
                          onCheckedChange={(checked) =>
                            setPolicy((prev) => ({
                              ...prev,
                              requireSpecial: checked,
                            }))
                          }
                        />
                        <Label htmlFor="special">
                          Require Special Characters
                        </Label>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <StrengthIndicator strength={strength} />
            <PasswordCriteria password={password} policy={policy} />
            {strength < 3 && (
              <Button
                onClick={handleSuggestStrongerPassword}
                className="w-full mt-4"
              >
                Suggest Stronger Password
              </Button>
            )}
            {isCommonPassword && (
              <div className="text-red-500 text-sm mt-2">
                Warning: This is a commonly used password and is not
                recommended.
              </div>
            )}
            {passwordHistory.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <History className="h-4 w-4 mr-2" />
                    Password History
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">
                        Recent Passwords
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Click to revert to a previous password
                      </p>
                    </div>
                    <div className="grid gap-2">
                      {passwordHistory.map((oldPassword, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="justify-start"
                          onClick={() => handleRevertPassword(oldPassword)}
                        >
                          {renderPasswordPreview(oldPassword)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}