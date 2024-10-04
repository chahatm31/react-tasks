import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Progress,
  Popover,
  Checkbox,
  List,
  ListItem,
} from "@/components/ui";
import { ClipboardIcon, EyeIcon, EyeOffIcon } from "@radix-ui/react-icons";

const App = () => {
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [strength, setStrength] = useState(0);
  const [criteria, setCriteria] = useState({
    length: 8,
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true,
  });
  const [metCriteria, setMetCriteria] = useState({});
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [isCommon, setIsCommon] = useState(false);

  useEffect(() => {
    checkPasswordStrength();
    checkCommonPassword();
  }, [password]);

  const checkPasswordStrength = () => {
    let score = 0;
    if (password.length >= criteria.length) score++;
    if (/[A-Z]/.test(password) && criteria.uppercase) score++;
    if (/[a-z]/.test(password) && criteria.lowercase) score++;
    if (/[0-9]/.test(password) && criteria.numbers) score++;
    if (
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) &&
      criteria.special
    )
      score++;
    setStrength((score / 5) * 100);
    setMetCriteria({
      length: password.length >= criteria.length,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    });
  };

  const checkCommonPassword = () => {
    // This is a simplified check; in a real app, you'd use an API or a larger dataset
    const commonPasswords = ["password", "123456", "qwerty"];
    setIsCommon(commonPasswords.includes(password.toLowerCase()));
  };

  const generatePassword = () => {
    const charset = {
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      numbers: "0123456789",
      special: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
    };
    let newPassword = "";
    let pool = "";
    for (let type in criteria) {
      if (criteria[type]) pool += charset[type];
    }
    for (let i = 0; i < criteria.length; i++) {
      newPassword += pool.charAt(Math.floor(Math.random() * pool.length));
    }
    setPassword(newPassword);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  const updateCriteria = (key, value) => {
    setCriteria((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Password Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordInput
            password={password}
            setPassword={setPassword}
            isVisible={isVisible}
            toggleVisibility={toggleVisibility}
            generatePassword={generatePassword}
            copyToClipboard={copyToClipboard}
          />
          <PasswordStrengthMeter strength={strength} />
          <PasswordCriteria criteria={metCriteria} />
          <SettingsPopover
            criteria={criteria}
            updateCriteria={updateCriteria}
          />
          {isCommon && (
            <p className="text-red-500">
              This password is commonly used. Consider changing it.
            </p>
          )}
          <PasswordHistory
            history={passwordHistory}
            setPassword={setPassword}
          />
        </CardContent>
      </Card>
    </div>
  );
};

const PasswordInput = ({
  password,
  setPassword,
  isVisible,
  toggleVisibility,
  generatePassword,
  copyToClipboard,
}) => (
  <div className="mb-4">
    <Input
      type={isVisible ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="mb-2"
      endContent={
        <Button variant="ghost" onClick={toggleVisibility}>
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      }
    />
    <Button onClick={generatePassword}>Generate Password</Button>
    <Button onClick={copyToClipboard} className="ml-2">
      <ClipboardIcon /> Copy
    </Button>
  </div>
);

const PasswordStrengthMeter = ({ strength }) => {
  const getStrengthLabel = () => {
    if (strength < 20) return "Very Weak";
    if (strength < 40) return "Weak";
    if (strength < 60) return "Moderate";
    if (strength < 80) return "Strong";
    return "Very Strong";
  };

  return (
    <div className="mb-4">
      <Progress value={strength} className="mb-1" />
      <span>{getStrengthLabel()}</span>
    </div>
  );
};

const PasswordCriteria = ({ criteria }) => (
  <List>
    {Object.entries(criteria).map(([key, met]) => (
      <ListItem key={key} className={met ? "text-green-500" : "text-red-500"}>
        {key.replace(/([A-Z])/g, " $1").toLowerCase()} {met ? "✓" : "✗"}
      </ListItem>
    ))}
  </List>
);

const SettingsPopover = ({ criteria, updateCriteria }) => (
  <Popover>
    <Popover.Trigger asChild>
      <Button>Settings</Button>
    </Popover.Trigger>
    <Popover.Content>
      {Object.keys(criteria).map((key) => (
        <div key={key}>
          <Checkbox
            checked={criteria[key]}
            onCheckedChange={(checked) => updateCriteria(key, checked)}
          >
            {key.replace(/([A-Z])/g, " $1").toLowerCase()}
          </Checkbox>
        </div>
      ))}
    </Popover.Content>
  </Popover>
);

const PasswordHistory = ({ history, setPassword }) => (
  <div>
    <h3 className="mt-4">Password History</h3>
    {/* Here you would map over password history, showing them obscured */}
  </div>
);

export default App;
