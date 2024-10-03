import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
} from "@/components/ui";
import { format, eachDayOfInterval, subDays, startOfMonth } from "date-fns";

const mockWorkouts = [
  { date: new Date(), type: "Cardio", duration: 30, intensity: 5 },
  {
    date: subDays(new Date(), 1),
    type: "Strength",
    duration: 45,
    intensity: 7,
  },
  // Add more as needed for initial data
];

export default function App() {
  const [workouts, setWorkouts] = useState(mockWorkouts);
  const [open, setOpen] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    type: "Cardio",
    duration: "",
    intensity: "",
  });
  const [goal, setGoal] = useState({ type: "Cardio", target: 100 });

  const today = new Date();
  const last7Days = eachDayOfInterval({ start: subDays(today, 6), end: today });

  const currentMonthWorkouts = workouts.filter(
    (workout) =>
      workout.date >= startOfMonth(new Date()) && workout.date <= today
  );

  const streak = last7Days.reduce((acc, day) => {
    if (
      workouts.some(
        (w) => format(w.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
      )
    ) {
      return acc + 1;
    }
    return 0;
  }, 0);

  const addWorkout = () => {
    setWorkouts([...workouts, { ...newWorkout, date: new Date() }]);
    setOpen(false);
    setNewWorkout({ type: "Cardio", duration: "", intensity: "" });
  };

  const progress =
    (workouts.reduce(
      (acc, workout) =>
        workout.type === goal.type ? acc + workout.duration : acc,
      0
    ) /
      goal.target) *
    100;

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4">Fitness Tracker</h1>

      {/* Goal Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Goal: {goal.type}</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="mb-2" />
          <p>{progress.toFixed(2)}% Complete</p>
        </CardContent>
      </Card>

      {/* Add Workout Button */}
      <Button className="mt-4" onClick={() => setOpen(true)}>
        Add Workout
      </Button>

      {/* Workout Streak */}
      <div className="mt-4">
        <h2 className="text-lg">Streak: {streak} days</h2>
        <div className="flex">
          {last7Days.map((day) => (
            <div
              key={day.toISOString()}
              className={`w-6 h-6 rounded-full m-1 ${
                workouts.some(
                  (w) =>
                    format(w.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                )
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Monthly Summary */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Workouts: {currentMonthWorkouts.length}</p>
          <p>
            Total Duration:{" "}
            {currentMonthWorkouts.reduce((sum, w) => sum + w.duration, 0)} mins
          </p>
          <p>
            Avg Intensity:{" "}
            {(
              currentMonthWorkouts.reduce((sum, w) => sum + w.intensity, 0) /
              currentMonthWorkouts.length
            ).toFixed(1)}
          </p>
        </CardContent>
      </Card>

      {/* Personal Best */}
      <Tabs defaultValue="duration" className="mt-4">
        <TabsList>
          <TabsTrigger value="duration">Longest</TabsTrigger>
          <TabsTrigger value="intensity">Highest Intensity</TabsTrigger>
        </TabsList>
        <TabsContent value="duration">
          <p>{Math.max(...workouts.map((w) => w.duration))} mins</p>
        </TabsContent>
        <TabsContent value="intensity">
          <p>{Math.max(...workouts.map((w) => w.intensity))} Intensity</p>
        </TabsContent>
      </Tabs>

      {/* Recent Workouts */}
      <div className="mt-4">
        <h2 className="text-lg">Recent Workouts</h2>
        {workouts.slice(-5).map((workout, idx) => (
          <Card key={idx} className="mt-2">
            <CardContent>
              <p>
                {workout.type} - {workout.duration} min - Intensity:{" "}
                {workout.intensity}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Workout Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-xl">Add Workout</h2>
          </DialogHeader>
          <Input
            type="number"
            placeholder="Duration (min)"
            value={newWorkout.duration}
            onChange={(e) =>
              setNewWorkout({ ...newWorkout, duration: Number(e.target.value) })
            }
          />
          <Input
            type="number"
            placeholder="Intensity (1-10)"
            value={newWorkout.intensity}
            onChange={(e) =>
              setNewWorkout({
                ...newWorkout,
                intensity: Number(e.target.value),
              })
            }
          />
          <Button onClick={addWorkout}>Add</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
