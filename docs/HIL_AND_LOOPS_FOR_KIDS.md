# How "Human-in-the-Loop" Uses Loops — Explained for a 12-Year-Old

Imagine you have a super-smart robot helper that does your homework, fixes your
LEGO builds, and tidies your room — all by itself. That sounds great, but you'd
still want to **check its work** before you hand the homework in, right? And
sometimes the robot gets confused and needs to **ask you** what to do.

That's exactly what this project is about. There are two big ideas, and they fit
together like a video game with a "save" button.

---

## Idea 1: The Loop (a robot that keeps trying until it gets it right)

A **loop** just means "do something over and over again." Think of practicing a
free throw: shoot, miss, fix your aim, shoot again, until the ball goes in.

In this repo there's a special kind of loop called a **Maker/Checker loop**.
There are two robots:

- 🛠️ **The Maker** — does the actual work (like writing code or fixing a bug).
- 🕵️ **The Checker** — a _different_ robot whose only job is to grade the Maker's
  work and say "Nope, here's what's wrong" or "Yes! That's correct."

Here's the loop:

```
   Maker does the work  ──►  Checker grades it
        ▲                          │
        │                          ▼
        └──  "Fix these things"  ◄──  Not good enough? Try again
                                   │
                                   ▼
                          Perfect? → STOP, you're done! ✅
```

Why use _two_ robots instead of one? Because if you grade your own homework,
you'll always say it's great! 😅 A separate Checker is honest, just like a
teacher checking your math.

**Three smart rules keep the loop safe** (you can see these in
`skills/loop/SKILL.md` and `src/agents/loop-engineering/`):

1. **Set the finish line before you start.** Like a game with a clear goal:
   "When all the tests pass, you win." The robot can't move the goalposts to
   cheat.
2. **Have a budget (an allowance).** The loop is only allowed to spend so much
   money and time. When the allowance runs out, it stops — just like when your
   phone game says "out of lives."
3. **Save your progress to a file.** After every try, the robot writes down what
   happened in a little notebook (a "state file"). If the computer crashes or
   you come back tomorrow, it can read the notebook and pick up right where it
   left off — like loading a saved game.

---

## Idea 2: Human-in-the-Loop (when the robot taps you on the shoulder)

"**Human-in-the-Loop**" (people shorten it to **HIL**) means: _a real person is
part of the loop._ The robot is fast and smart, but a human still gets to be the
boss for the important stuff.

This happens in two ways in the repo:

### A) "Hey, can you do this one thing?" — the To-Do button

Every morning the system emails Risto (the human) a short list of things only a
person should do. Each item has a big **✅ Done** button. When he clicks it, the
computer marks that job finished.

You can see this in `src/routes/hil.routes.ts` — it's literally called the
"HIL (Human-in-the-Loop) Route," and clicking the button updates a list called
`hil_todos` ("human-in-the-loop to-dos").

### B) "I'm not sure — please help!" — escalation

Sometimes a robot is working and gets _less than 80% sure_ it's doing the right
thing. Instead of guessing and making a mess, it **raises its hand** and sends
the human an email that says, basically, _"I'm only 60% confident, can you
check?"_ That's called an **escalation** (table name: `hil_escalations`).

It's like when you're building something and you're not sure, so you go ask a
grown-up instead of breaking it.

---

## How the two ideas work TOGETHER

Here's the cool part — the safe robot loop and the human fit together:

```
  ┌─────────────── THE LOOP (robots) ───────────────┐
  │   Maker works  →  Checker grades  →  try again   │
  └───────────────────────┬──────────────────────────┘
                          │
        Robot is confident and the job is "safe"?
                          │  yes → just do it ✅
                          │
        Job is risky, OR robot is unsure (<80%)?
                          │  → STOP and ask the human 🙋
                          ▼
              👤  HUMAN-IN-THE-LOOP
            (clicks Done, or answers the question)
```

There's a colour-coded rulebook for what robots can do on their own:

- 🟢 **Green** = totally fine, robot does it alone (reading files, running tests).
- 🟡 **Yellow** = allowed, but write it in the logbook so we can check later.
- 🔴 **Red** = **STOP — a human must say yes first** (things like sending real
  emails, deleting important stuff, or publishing to the live website).

So the **loop** makes robots productive (they try, get graded, and try again
without bugging you for every tiny thing), and **human-in-the-loop** makes them
_safe_ (a person is always the final boss for anything risky).

---

## The one-sentence version

> The robots run in a **loop** — work, get graded, try again — but a **human
> stays in that loop** to approve the risky stuff and to help whenever a robot
> isn't sure. Fast like a robot, safe like a grown-up is watching. 🤖🤝🧑
> </content>
> </invoke>
