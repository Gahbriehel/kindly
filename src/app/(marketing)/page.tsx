import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function LandingPage() {
  return (
    <Router>
      {/* <div className="relative bg-gradient-to-br from-gray-300 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-300"> */}
      <div className="relative transition-colors duration-300">
        {/* <h1 className="text-4xl font-bold">this is landing page</h1> */}
        <Navbar />
      </div>
    </Router>
  );
}
