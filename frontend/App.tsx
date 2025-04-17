import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

import { Mint } from "@/pages/Mint";
import { Admin } from "@/pages/Admin";
import PagesListed from "./pages/Pagelisted";
import MyPages from "./pages/MyPages";

function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Mint />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/pages-listed",
        element: <PagesListed />,
      },
      {
        path: "/my-pages",
        element: <MyPages />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
