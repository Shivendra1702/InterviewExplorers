import "./App.css";
import Posts from "./components/Posts";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import { UserContextProvider } from "./UserContext";
import { motion, useScroll, useSpring } from "framer-motion";

import {
  Login,
  Register,
  Missing,
  CreatePost,
  Profile,
  SinglePost,
  EditPost,
} from "./pages";

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <UserContextProvider>
      <motion.div className="progress-bar" style={{ scaleX }} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Posts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post/:id" element={<SinglePost />} />
          <Route path="/editpost/:id" element={<EditPost />} />
        </Route>
        <Route path="*" element={<Missing />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
