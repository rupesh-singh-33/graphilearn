import { createBrowserRouter } from "react-router-dom";

import App from "./App";

import LearningHub from "./pages/learning/LearningHub";
import LineDrawingLesson from "./pages/learning/LineDrawingLesson";
import TransformationsLesson from "./pages/learning/TransformationsLesson";
import VideoLessons from "./pages/learning/VideoLessons";
import Quiz from "./pages/learning/Quiz";
import Progress from "./pages/learning/Progress";

import Transformations from "./pages/graphics/Transformations";
import DDASimulator from "./pages/graphics/DDASimulator";
import BresenhamSimulator from "./pages/graphics/BresenhamSimulator";
import CircleSimulator from "./pages/graphics/CircleSimulator";
import ClippingSimulator from "./pages/graphics/ClippingSimulator";
import BezierSimulator from "./pages/graphics/BezierSimulator";
import ThreeDGraphics from "./pages/graphics/ThreeDGraphics";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  // Learning

  {
    path: "/learn",
    element: <LearningHub />,
  },

  {
    path: "/learn/line-drawing",
    element: <LineDrawingLesson />,
  },

  {
    path: "/learn/transformations",
    element: <TransformationsLesson />,
  },

  {
    path: "/learn/videos",
    element: <VideoLessons />,
  },

  {
    path: "/learn/quiz",
    element: <Quiz />,
  },

  {
    path: "/learn/progress",
    element: <Progress />,
  },

  // Graphics Simulators

  {
    path: "/graphics/transformations",
    element: <Transformations />,
  },

  {
    path: "/graphics/dda",
    element: <DDASimulator />,
  },

  {
    path: "/graphics/bresenham",
    element: <BresenhamSimulator />,
  },

  {
    path: "/graphics/circle",
    element: <CircleSimulator />,
  },

  {
    path: "/graphics/clipping",
    element: <ClippingSimulator />,
  },

  {
    path: "/graphics/bezier",
    element: <BezierSimulator />,
  },

  {
    path: "/graphics/3d",
    element: <ThreeDGraphics />,
  },
]);

export default router;
