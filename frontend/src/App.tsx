import { Route, Routes } from "react-router-dom";
import { AllBooks } from "./pages/Books/AllBooks";
import { Home } from "./pages/Home";
import { BooksLobby } from "./pages/Books/BooksLobby";
import { CreateBook } from "./pages/Books/CreateBook";
import { EditBook } from "./pages/Books/EditBook";
import { AllAuthors } from "./pages/Authors/AllAuthors";
import { EditAuthor } from "./pages/Authors/EditAuthor";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/books" element={<AllBooks />} />
      <Route path="/booksmenu" element={<BooksLobby />} />
      <Route path="/create-book" element={<CreateBook />} />
      <Route path="/edit-book/:id" element={<EditBook />} />
      <Route path="/edit-author/:id" element={<EditAuthor />} />
      <Route path="/authors" element={<AllAuthors />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;
