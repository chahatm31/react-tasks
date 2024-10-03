import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";

// Mock data for moods and prompts
const moods = ["Happy", "Sad", "Angry", "Excited", "Neutral"];
const prompts = [
  "What was the highlight of your day?",
  "Describe a challenge you faced today.",
  // Add more prompts here
];

function getRandomPrompt() {
  return prompts[Math.floor(Math.random() * prompts.length)];
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("password123");
  const [entries, setEntries] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState(getRandomPrompt());
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    // Reset prompt daily (this is a simplification)
    const interval = setInterval(
      () => setCurrentPrompt(getRandomPrompt()),
      86400000
    );
    return () => clearInterval(interval);
  }, []);

  const onSubmitLogin = (data) => {
    if (data.password === password) {
      setLoggedIn(true);
    }
  };

  const onSubmitEntry = (data) => {
    setEntries([
      ...entries,
      { ...data, id: Date.now(), tags: data.tags.split(",") },
    ]);
    reset();
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  if (!loggedIn) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Password: password123</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmitLogin)}>
              <Input
                {...register("password")}
                type="password"
                placeholder="Enter password"
              />
              <Button type="submit" className="mt-4 w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Tabs defaultValue="diary">
        <TabsList>
          <TabsTrigger value="diary">Diary</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="diary">
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold mb-2">
                Today's Prompt: {currentPrompt}
              </h2>
              <form onSubmit={handleSubmit(onSubmitEntry)}>
                <Textarea
                  {...register("content")}
                  placeholder="Write your entry here..."
                />
                <Input
                  {...register("tags")}
                  placeholder="Tags (comma separated)"
                  className="mt-2"
                />
                <Select {...register("mood")}>
                  {moods.map((mood) => (
                    <Option key={mood} value={mood}>
                      {mood}
                    </Option>
                  ))}
                </Select>
                <Button type="submit" className="mt-4">
                  Save Entry
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="mt-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="mb-2">
                <CardContent>
                  <p>{entry.content}</p>
                  <div className="mt-2 flex justify-between">
                    <span>Tags: {entry.tags.join(", ")}</span>
                    <span>Mood: {entry.mood}</span>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteEntry(entry.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="stats">
          {/* Implement stats view here */}
          <p>Stats will be shown here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
