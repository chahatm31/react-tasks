import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const prompts = [
  "What's the best thing that happened to you today?",
  "Describe a challenge you faced recently and how you overcame it.",
  "Write about a person who inspired you this week.",
  "What's a goal you're working towards? How are you progressing?",
  "Reflect on a mistake you made and what you learned from it.",
  "Describe your ideal day. What would you do?",
  "What's something new you learned recently?",
  "Write about a place you'd like to visit and why.",
  "Describe a moment when you felt proud of yourself.",
  "What's a habit you'd like to develop or break?",
];

const DiaryEntry = ({ entry, onDelete, onEdit }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        <span>{entry.date}</span>
        <Badge>{entry.mood}</Badge>
      </CardTitle>
      <CardDescription>
        {entry.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="mr-2">
            {tag}
          </Badge>
        ))}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p>{entry.content}</p>
    </CardContent>
    <CardFooter>
      <Button onClick={() => onEdit(entry)} className="mr-2">
        Edit
      </Button>
      <Button onClick={() => onDelete(entry.id)} variant="destructive">
        Delete
      </Button>
    </CardFooter>
  </Card>
);

const EntryForm = ({ onSave, initialEntry = null, dailyPrompt }) => {
  const [content, setContent] = useState(initialEntry?.content || "");
  const [tags, setTags] = useState(initialEntry?.tags.join(", ") || "");
  const [mood, setMood] = useState(initialEntry?.mood || "Neutral");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: initialEntry?.id || Date.now(),
      date: initialEntry?.date || new Date().toLocaleDateString(),
      content,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      mood,
    });
    setContent("");
    setTags("");
    setMood("Neutral");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="content">Entry</Label>
        <div className="mb-2 text-sm italic">Daily Prompt: {dailyPrompt}</div>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your diary entry here..."
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. work, family, hobby"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="mood">Mood</Label>
        <Select value={mood} onValueChange={setMood}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select mood" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Happy">Happy</SelectItem>
            <SelectItem value="Sad">Sad</SelectItem>
            <SelectItem value="Angry">Angry</SelectItem>
            <SelectItem value="Excited">Excited</SelectItem>
            <SelectItem value="Neutral">Neutral</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">{initialEntry ? "Update" : "Save"} Entry</Button>
    </form>
  );
};

const PasswordPrompt = ({ onSubmit, defaultPassword }) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <Card className="w-full max-w-sm mx-auto mt-8">
      <CardHeader>
        <CardTitle>Enter Password</CardTitle>
        <CardDescription>
          Please enter your password to access the diary.
          <br />
          <strong>Default password: {defaultPassword}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
};

const Statistics = ({ entries }) => {
  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Mood Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(moodCounts).map(([mood, count]) => (
          <div key={mood} className="flex justify-between items-center mb-2">
            <span>{mood}:</span>
            <Badge variant="secondary">{count}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEntry, setEditingEntry] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("password123");
  const [dailyPrompt, setDailyPrompt] = useState("");

  useEffect(() => {
    const storedEntries = localStorage.getItem("diaryEntries");
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }

    const lastPromptDate = localStorage.getItem("lastPromptDate");
    const today = new Date().toDateString();

    if (lastPromptDate !== today) {
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      setDailyPrompt(randomPrompt);
      localStorage.setItem("lastPromptDate", today);
      localStorage.setItem("dailyPrompt", randomPrompt);
    } else {
      setDailyPrompt(localStorage.getItem("dailyPrompt"));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("diaryEntries", JSON.stringify(entries));
  }, [entries]);

  const handleSaveEntry = (entry) => {
    if (editingEntry) {
      setEntries(entries.map((e) => (e.id === entry.id ? entry : e)));
      setEditingEntry(null);
    } else {
      setEntries([entry, ...entries]);
    }
  };

  const handleDeleteEntry = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handlePasswordSubmit = (enteredPassword) => {
    if (enteredPassword === password) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <PasswordPrompt
        onSubmit={handlePasswordSubmit}
        defaultPassword={password}
      />
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Personal Diary</h1>
      <div className="mb-6">
        <Label htmlFor="search">Search entries</Label>
        <Input
          id="search"
          type="text"
          placeholder="Search by content or tags..."
          value={searchTerm}
          onChange={handleSearch}
          className="mt-1"
        />
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editingEntry ? "Edit Entry" : "New Entry"}</CardTitle>
        </CardHeader>
        <CardContent>
          <EntryForm
            onSave={handleSaveEntry}
            initialEntry={editingEntry}
            dailyPrompt={dailyPrompt}
          />
        </CardContent>
      </Card>
      <ScrollArea className="h-[40vh]">
        {filteredEntries.map((entry) => (
          <DiaryEntry
            key={entry.id}
            entry={entry}
            onDelete={handleDeleteEntry}
            onEdit={handleEditEntry}
          />
        ))}
      </ScrollArea>
      <Statistics entries={entries} />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="mt-4">
            Change Password
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Password</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your new password below. Make sure it's secure!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            type="password"
            placeholder="New password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => alert("Password changed successfully!")}
            >
              Change Password
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
