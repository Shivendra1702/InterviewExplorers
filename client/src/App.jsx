import "./App.css";
import Posts from "./components/Posts";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import { UserContextProvider } from "./UserContext";

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
  return (
    <UserContextProvider>
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
