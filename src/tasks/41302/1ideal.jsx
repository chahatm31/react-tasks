import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const workoutTypes = ['Cardio', 'Strength', 'Flexibility'];

const initialGoals = [
  { id: 1, name: 'Run 5K', target: 5, unit: 'km', progress: 0 },
  { id: 2, name: 'Bench Press', target: 100, unit: 'kg', progress: 0 },
];

const WorkoutForm = ({ onAddWorkout }) => {
  const [workout, setWorkout] = useState({ type: '', duration: '', intensity: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (workout.type && workout.duration && workout.intensity) {
      onAddWorkout({ ...workout, date: new Date().toISOString().split('T')[0] });
      setWorkout({ type: '', duration: '', intensity: '' });
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Log Workout</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={workout.type} onValueChange={(value) => setWorkout({ ...workout, type: value })}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select workout type" />
              </SelectTrigger>
              <SelectContent>
                {workoutTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={workout.duration}
              onChange={(e) => setWorkout({ ...workout, duration: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="intensity">Intensity (1-10)</Label>
            <Input
              id="intensity"
              type="number"
              min="1"
              max="10"
              value={workout.intensity}
              onChange={(e) => setWorkout({ ...workout, intensity: e.target.value })}
            />
          </div>
          <Button type="submit">Log Workout</Button>
        </form>
      </CardContent>
    </Card>
  );
};

const WorkoutList = ({ workouts }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Recent Workouts</CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[200px]">
        <ul className="space-y-2">
          {workouts.map((workout, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{workout.type}</span>
              <span>{workout.duration} min</span>
              <span>Intensity: {workout.intensity}/10</span>
              <span>{workout.date}</span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </CardContent>
  </Card>
);

const GoalTracker = ({ goals, onUpdateGoal, onAddGoal }) => {
  const [newGoal, setNewGoal] = useState({ name: '', target: '', unit: '' });

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (newGoal.name && newGoal.target && newGoal.unit) {
      onAddGoal({ ...newGoal, id: Date.now(), progress: 0 });
      setNewGoal({ name: '', target: '', unit: '' });
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Fitness Goals</CardTitle>
      </CardHeader>
      <CardContent>
        {goals.map((goal) => (
          <div key={goal.id} className="mb-4">
            <Label htmlFor={`goal-${goal.id}`}>{goal.name}</Label>
            <div className="flex items-center space-x-2">
              <Input
                id={`goal-${goal.id}`}
                type="number"
                value={goal.progress || 0}
                onChange={(e) => onUpdateGoal(goal.id, parseFloat(e.target.value) || 0)}
              />
              <span>/ {goal.target} {goal.unit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${((goal.progress || 0) / goal.target) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
        <form onSubmit={handleAddGoal} className="mt-4 space-y-2">
          <Input
            placeholder="Goal Name"
            value={newGoal.name}
            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Target"
            value={newGoal.target}
            onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
          />
          <Input
            placeholder="Unit"
            value={newGoal.unit}
            onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
          />
          <Button type="submit">Add New Goal</Button>
        </form>
      </CardContent>
    </Card>
  );
};

const WorkoutDetails = ({ workout }) => (
  <div className="space-y-2">
    <p><strong>Type:</strong> {workout.type}</p>
    <p><strong>Duration:</strong> {workout.duration} minutes</p>
    <p><strong>Intensity:</strong> {workout.intensity}/10</p>
    <p><strong>Date:</strong> {workout.date}</p>
  </div>
);

const WorkoutTimeline = ({ workouts }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Workout Timeline</CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[300px]">
        <ul className="space-y-4">
          {workouts.map((workout, index) => (
            <li key={index} className="border-l-2 border-blue-500 pl-4 py-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link">{workout.date}: {workout.type}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Workout Details</DialogTitle>
                    <DialogDescription>Details of your workout on {workout.date}</DialogDescription>
                  </DialogHeader>
                  <WorkoutDetails workout={workout} />
                </DialogContent>
              </Dialog>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </CardContent>
  </Card>
);

const StreakTracker = ({ workouts }) => {
  const calculateStreak = () => {
    if (workouts.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < workouts.length; i++) {
      const workoutDate = new Date(workouts[i].date);
      workoutDate.setHours(0, 0, 0, 0);
      
      if (currentDate.getTime() - workoutDate.getTime() > 86400000) break;
      if (currentDate.getTime() === workoutDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      }
    }
    
    return streak;
  };

  const streak = calculateStreak();

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Workout Streak</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <span className="text-4xl font-bold">{streak}</span>
          <p>day{streak !== 1 ? 's' : ''} in a row</p>
        </div>
        <div className="mt-4 flex justify-center">
          {[...Array(7)].map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 mx-1 rounded-full ${
                index < streak ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const WorkoutSummary = ({ workouts }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate.getMonth() === currentMonth && workoutDate.getFullYear() === currentYear;
  });

  const totalWorkouts = thisMonthWorkouts.length;
  const totalDuration = thisMonthWorkouts.reduce((sum, workout) => sum + parseInt(workout.duration), 0);
  const averageIntensity = thisMonthWorkouts.length > 0
    ? (thisMonthWorkouts.reduce((sum, workout) => sum + parseInt(workout.intensity), 0) / thisMonthWorkouts.length).toFixed(1)
    : 0;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>This Month's Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{totalWorkouts}</p>
            <p className="text-sm">Workouts</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{totalDuration}</p>
            <p className="text-sm">Total Minutes</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{averageIntensity}</p>
            <p className="text-sm">Avg Intensity</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PersonalBests = ({ workouts }) => {
  const [personalBests, setPersonalBests] = useState({
    longestWorkout: { duration: 0, date: '' },
    highestIntensity: { intensity: 0, date: '' },
  });

  useEffect(() => {
    const longestWorkout = workouts.reduce((max, workout) => 
      parseInt(workout.duration) > parseInt(max.duration) ? workout : max
    , { duration: 0 });

    const highestIntensity = workouts.reduce((max, workout) => 
      parseInt(workout.intensity) > parseInt(max.intensity) ? workout : max
    , { intensity: 0 });

    setPersonalBests({
      longestWorkout: { duration: longestWorkout.duration, date: longestWorkout.date },
      highestIntensity: { intensity: highestIntensity.intensity, date: highestIntensity.date },
    });
  }, [workouts]);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Personal Bests</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="duration">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="duration">Longest Workout</TabsTrigger>
            <TabsTrigger value="intensity">Highest Intensity</TabsTrigger>
          </TabsList>
          <TabsContent value="duration">
            <div className="text-center py-4">
              <p className="text-3xl font-bold">{personalBests.longestWorkout.duration} minutes</p>
              <p className="text-sm">on {personalBests.longestWorkout.date}</p>
            </div>
          </TabsContent>
          <TabsContent value="intensity">
            <div className="text-center py-4">
              <p className="text-3xl font-bold">{personalBests.highestIntensity.intensity}/10</p>
              <p className="text-sm">on {personalBests.highestIntensity.date}</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState(initialGoals);

  useEffect(() => {
    const savedWorkouts = localStorage.getItem("workouts");
    const savedGoals = localStorage.getItem("goals");
    if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [workouts, goals]);

  const handleAddWorkout = (newWorkout) => {
    setWorkouts([newWorkout, ...workouts]);
  };

  const handleUpdateGoal = (id, progress) => {
    setGoals(
      goals.map((goal) => (goal.id === id ? { ...goal, progress } : goal))
    );
  };

  const handleAddGoal = (newGoal) => {
    setGoals([...goals, newGoal]);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Fitness Tracker</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <WorkoutForm onAddWorkout={handleAddWorkout} />
          <GoalTracker
            goals={goals}
            onUpdateGoal={handleUpdateGoal}
            onAddGoal={handleAddGoal}
          />
        </div>
        <div>
          <StreakTracker workouts={workouts} />
          <WorkoutSummary workouts={workouts} />
          <PersonalBests workouts={workouts} />
          <WorkoutList workouts={workouts.slice(0, 5)} />
        </div>
      </div>
      <WorkoutTimeline workouts={workouts} />
    </div>
  );
}