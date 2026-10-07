# GraphiLearn – Interactive Computer Graphics Learning System

GraphiLearn is an interactive educational web application designed to make Computer Graphics concepts easier to understand through **theory, visualizations, animations, interactive simulations, multimedia learning, quizzes, and progress tracking**.

Instead of relying only on static notes, GraphiLearn allows students to learn concepts and immediately experiment with them through interactive graphics.

---

## 🎯 Project Objective

The main objective of GraphiLearn is to provide an interactive and multimedia-based learning platform for Computer Graphics.

The application focuses on:

- Understanding Computer Graphics concepts visually
- Learning algorithms through step-by-step simulations
- Performing interactive experiments
- Reinforcing concepts through quizzes and activities
- Tracking learning progress
- Supporting multimedia-based learning through narration and videos

---

## 🚀 Features

### 📚 Learning Modules

GraphiLearn currently includes the following modules:

- **2D Transformations**
  - Translation
  - Rotation
  - Scaling
  - Shearing

- **Line Drawing Algorithms**
  - DDA Algorithm
  - Bresenham Line Drawing Algorithm

- **Circle Drawing**
  - Midpoint Circle Drawing Algorithm
  - 8-way symmetry visualization

- **Line Clipping**
  - Cohen-Sutherland Line Clipping Algorithm
  - Region code visualization

- **Bezier Curves**
  - Cubic Bezier Curves
  - Interactive control points

- **3D Graphics**
  - 3D object visualization
  - Rotation
  - Scaling
  - Perspective-based visualization

---

## 🧪 Interactive Simulations

The application provides interactive graphics simulations where users can modify parameters and observe the results.

Examples include:

- Pixel-by-pixel line drawing
- Animated DDA algorithm
- Animated Bresenham algorithm
- Circle pixel generation
- Interactive clipping
- Draggable Bezier control points
- Interactive 3D transformations

---

## 🎬 Multimedia Learning

GraphiLearn follows a multimedia learning approach using:

- Text-based explanations
- Visual diagrams
- Interactive graphics
- Animations
- Video lessons
- Browser-based narration
- Interactive activities

The narration feature uses the browser's Speech Synthesis API.

---

## 📝 Quiz System

The application includes a Computer Graphics quiz containing multiple-choice questions covering:

- 2D transformations
- Line drawing algorithms
- Circle drawing
- Line clipping
- Bezier curves
- 3D graphics

Quiz scores are stored locally and displayed on the Progress page.

---

## 🎮 Interactive Activity

GraphiLearn also includes an interactive concept-practice activity.

Students answer Computer Graphics questions and receive:

- Immediate feedback
- Correct/incorrect explanations
- Score calculation
- Completion status
- Retry option

The activity score is stored using browser local storage.

---

## 📊 Progress Tracking

The Progress page tracks:

- Completed learning modules
- Quiz score
- Interactive activity score
- Module completion percentage
- Overall learning progress

Progress data is maintained using browser `localStorage`.

---

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Icons

### Graphics

- HTML5 Canvas
- Three.js
- React Three Fiber
- React Three Drei

### Routing

- React Router

### Browser APIs

- Web Speech API / Speech Synthesis
- Local Storage API

---

## 📁 Project Structure

```text
cgms/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── learning/
│   │
│   ├── pages/
│   │   ├── graphics/
│   │   └── learning/
│   │
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── router.jsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```
