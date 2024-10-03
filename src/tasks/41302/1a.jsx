// App.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

// Mock data for demonstration
const mockWorkouts = [
  {
    id: 1,
    type: "cardio",
    duration: 30,
    intensity: "medium",
    date: new Date(),
  },
  // Add more mock data here
];

export default function App() {
  const [workouts, setWorkouts] = useState(mockWorkouts);
  const [goals, setGoals] = useState({ cardio: 100, strength: 50 });
  const [open, setOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const addWorkout = (newWorkout) => {
    setWorkouts([
      ...workouts,
      { ...newWorkout, id: workouts.length + 1, date: new Date() },
    ]);
  };

  const currentStreak = () => {
    // Simplified streak logic
    return workouts.filter(
      (w) => w.date > new Date(new Date().setDate(new Date().getDate() - 7))
    ).length;
  };

  const monthlySummary = () => {
    const now = new Date();
    const thisMonthWorkouts = workouts.filter(
      (w) => w.date.getMonth() === now.getMonth()
    );
    return {
      total: thisMonthWorkouts.length,
      duration: thisMonthWorkouts.reduce((sum, w) => sum + w.duration, 0),
      avgIntensity:
        thisMonthWorkouts.reduce(
          (sum, w) =>
            sum +
            (w.intensity === "high" ? 3 : w.intensity === "medium" ? 2 : 1),
          0
        ) / thisMonthWorkouts.length || 0,
    };
  };

  const personalBest = () => {
    return {
      longest: Math.max(...workouts.map((w) => w.duration)),
      highestIntensity: Math.max(
        ...workouts.map((w) =>
          w.intensity === "high" ? 3 : w.intensity === "medium" ? 2 : 1
        )
      ),
    };
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Fitness Tracker</h1>

      {/* Goal Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(goals).map((goal) => (
            <div key={goal}>
              <p>
                {goal}: {goals[goal]}
              </p>
              <Progress
                value={
                  (workouts.filter((w) => w.type === goal).length /
                    goals[goal]) *
                  100
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add Workout Form */}
      <WorkoutForm onSubmit={addWorkout} />

      {/* Recent Workouts */}
      <RecentWorkouts workouts={workouts} onSelect={setSelectedWorkout} />

      {/* Streak Tracker */}
      <StreakTracker streak={currentStreak()} />

      {/* Monthly Summary */}
      <MonthlySummary summary={monthlySummary()} />

      {/* Personal Bests */}
      <PersonalBests bests={personalBest()} />

      {/* Dialog for Workout Details */}
      <WorkoutDetailDialog
        workout={selectedWorkout}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
}

// Sub-components would be defined here, like WorkoutForm, RecentWorkouts, etc.
