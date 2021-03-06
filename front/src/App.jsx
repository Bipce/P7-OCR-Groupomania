import { Redirect } from "react-router-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useContext } from "react";
import TopicsPage from "./pages/TopicsPage";
import TopicPage from "./pages/TopicPage";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { UserContext } from "./contexts/User";
import Register from "./pages/Register";
import UserPage from "./pages/UserPage";

const App = () => {
  const { user } = useContext(UserContext);

  let routes;

  if (user) {
    routes = (
      <Switch>
        <Route exact path="/" component={TopicsPage} />
        <Route path="/topic/:id">
          <TopicPage />
        </Route>
        <Route path="/user">
          <UserPage />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/" component={Login} />
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <Router>
      <Navbar />
      {routes}
    </Router>
  );
};

export default App;
