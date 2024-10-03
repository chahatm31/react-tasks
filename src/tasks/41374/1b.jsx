import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format, startOfToday } from "date-fns";

const moods = ["Happy", "Sad", "Angry", "Excited", "Neutral"];

function generateDailyPrompt() {
  const prompts = [
    "What made you smile today?",
    "Describe a challenge you overcame recently.",
    "What are you grateful for right now?",
    "How did you feel at the start of your day?",
    "What's something new you learned today?",
  ];
  const today = startOfToday().getTime();
  return prompts[today % prompts.length];
}

function App() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    content: "",
    tags: [],
    mood: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("diaryPassword")) {
      localStorage.setItem("diaryPassword", "password123");
    }
    setPassword(localStorage.getItem("diaryPassword"));
  }, []);

  const authenticate = () => {
    if (password === localStorage.getItem("diaryPassword")) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  const addEntry = () => {
    if (currentEntry.content && currentEntry.mood) {
      setEntries([
        ...entries,
        { ...currentEntry, date: new Date().toISOString() },
      ]);
      setCurrentEntry({ content: "", tags: [], mood: "" });
    }
  };

  const deleteEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const filteredEntries = useMemo(
    () =>
      entries.filter(
        (entry) =>
          entry.content.includes(searchTerm) ||
          entry.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      ),
    [entries, searchTerm]
  );

  const moodStats = useMemo(() => {
    const stats = {};
    moods.forEach((mood) => (stats[mood] = 0));
    entries.forEach((entry) => (stats[entry.mood] += 1));
    return stats;
  }, [entries]);

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Diary Login</CardTitle>
            <CardDescription>
              Enter your password to access your diary.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </CardContent>
          <CardFooter>
            <Button onClick={authenticate}>Login</Button>
            <p className="text-xs text-center mt-2">
              Initial Password: password123
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-slate-100 min-h-screen">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>New Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="What's on your mind?"
            value={currentEntry.content}
            onChange={(e) =>
              setCurrentEntry({ ...currentEntry, content: e.target.value })
            }
          />
          <div className="mt-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Add tags separated by commas"
              onChange={(e) =>
                setCurrentEntry({
                  ...currentEntry,
                  tags: e.target.value.split(",").map((tag) => tag.trim()),
                })
              }
            />
          </div>
          <div className="mt-2">
            <Select
              value={currentEntry.mood}
              onValueChange={(value) =>
                setCurrentEntry({ ...currentEntry, mood: value })
              }
            >
              <SelectItem value="">Choose your mood</SelectItem>
              {moods.map((mood) => (
                <SelectItem key={mood} value={mood}>
                  {mood}
                </SelectItem>
              ))}
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={addEntry}>Save Entry</Button>
        </CardFooter>
      </Card>

      <div className="mb-4">
        <Input
          placeholder="Search entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Button onClick={() => setIsDialogOpen(true)}>View Statistics</Button>
      </div>

      {filteredEntries.map((entry, index) => (
        <Card key={index} className="mb-2">
          <CardContent>
            <p>{format(new Date(entry.date), "PPpp")}</p>
            <p>{entry.content}</p>
            <div className="mt-2">
              {entry.tags.map((tag) => (
                <Badge key={tag} className="mr-2">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Badge variant="outline">{entry.mood}</Badge>
            <Button className="ml-auto" onClick={() => deleteEntry(index)}>
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Card>
          <CardHeader>
            <CardTitle>Mood Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(moodStats).map(([mood, count]) => (
              <div key={mood}>
                {mood}: {count}
              </div>
            ))}
          </CardContent>
        </Card>
      </Dialog>

      <p className="mt-4 text-sm text-center text-gray-500">
        Today's writing prompt: {generateDailyPrompt()}
      </p>
    </div>
  );
}

export default App;
