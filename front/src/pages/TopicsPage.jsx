import Topic from "../components/Topic";
import { useEffect, useState } from "react";
import axios from "axios";
import "./TopicsPage.css";

const TopicPage = () => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get("http://localhost:3001/api/topics");
      setTopics(response.data);
    })();
  }, []);

  return (
    <div className="container">
      <div className="topics">
        {topics.map((topic) => (
          <Topic key={topic.id} data={topic} />
        ))}
      </div>
      <button className="button__style topic__button">Créer un topic</button>
    </div>
  );
};

export default TopicPage;