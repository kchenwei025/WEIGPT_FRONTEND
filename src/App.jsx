import { useState, useEffect } from "react";

const App = () => {
  const [value, setValue] = useState("");
  const [renderValue, setRenderValue] = useState("");
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [title, setTitle] = useState(null);
  const [backStory, setBackStory] = useState("");
  const [chatRoomColor, SetChatRoomColor] = useState(false);
  const [armyColor, setArmyColor] = useState(false);
  const [careerColor, setCareerColor] = useState(false);
  const [darkModeColor, setDarkModeColor] = useState(false);
  const [chatRoomStatus, setChatRoomStatus] = useState(false);
  const [posts, setPosts] = useState([]);
  const [guessCorrect, setGuessCorrect] = useState([]);

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setTitle(null);
  };

  const handleClick = (uniqueTitle) => {
    setTitle(uniqueTitle);
    setValue("");
    setMessage(null);
  };

  const chatRoomData = async () => {
    if (value) {
      const options = {
        method: "POST",
        body: JSON.stringify({
          role: "user",
          chat: value,
        }),
        headers: { "Content-Type": "application/json" },
      };
      try {
        const response = await fetch(
          "https://backend-b6uu.onrender.com/post",
          options
        );
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
    if (!value) {
      const options2 = {
        method: "POST",
        body: JSON.stringify({
          role: "assistant",
          chat: message.content,
        }),
        headers: { "Content-Type": "application/json" },
      };
      try {
        const response = await fetch(
          "https://backend-b6uu.onrender.com/post",
          options2
        );
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const chatRoom = () => {
    setMessage(null);
    setValue("");
    setTitle(null);

    const mainElement = document.querySelector(".main");

    if (chatRoomColor) {
      setBackStory("");
      mainElement.style.backgroundColor = "";
      SetChatRoomColor(false);
      setChatRoomStatus(false);
    } else {
      setBackStory(
        "You are in group chat envirmont to have causal coversation, you always response with one sentence."
      );
      mainElement.style.backgroundColor = "teal";
      SetChatRoomColor(true);
      setChatRoomStatus(true);
    }
  };

  useEffect(() => {
    if (posts) {
      console.log(posts);
    }
  }, [posts]);

  const armyFact = () => {
    const mainElement = document.querySelector(".main");

    if (armyColor) {
      setBackStory("");
      mainElement.style.backgroundColor = "";
      setArmyColor(false);
    } else {
      setBackStory(
        "You are an assistant who tells any random and very short fun fact about Army. And you served in the Army for 15 years. Anything question people ask you , you find a way to relate back to Army. John Kluse is your first sergeant, he is a god-level soilder to you. when you here his name, you will say wooah and followed by a past story"
      );
      mainElement.style.backgroundColor = "DarkSeaGreen";
      setArmyColor(true);
    }
  };

  const careerFact = () => {
    const mainElement = document.querySelector(".main");

    if (careerColor) {
      setBackStory("");
      mainElement.style.backgroundColor = "";
      setCareerColor(false);
    } else {
      setBackStory(
        "You are an assistant who guides people to find a software related jobs espcially bootcamp graduates. You have been work for HR depart for over 30 years, you know everything there is to know about resume, cover letter ,and tech interview. You always provide positive feedback and informative new and posting"
      );
      mainElement.style.backgroundColor = "DarkKhaki";
      setCareerColor(true);
    }

    console.log("clicked");
  };

  const darkMode = () => {
    const mainElement = document.querySelector(".main");

    if (darkModeColor) {
      setBackStory("");
      mainElement.style.backgroundColor = "";
      setDarkModeColor(false);
    } else {
      setBackStory(
        "You are extremly facinated about death fact, You always find a way to warn people about the danger in this world. You always provide number and death rates about death rate involed anything that you were asked."
      );
      mainElement.style.backgroundColor = "black";
      setDarkModeColor(true);
    }

    console.log("clicked");
  };

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        system: backStory,
        message: value,
      }),
      headers: { "Content-Type": "application/json" },
    };
    try {
      const response = await fetch(
        "https://backend-b6uu.onrender.com/completions",
        options
      );
      const data = await response.json();
      console.log(data);

      setMessage(data.choices[0].message);
      setRenderValue(value);
      if (chatRoomStatus) {
        chatRoomData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (message !== null && chatRoomStatus) {
      chatRoomData();
    }
  }, [message, chatRoomStatus]);

  useEffect(() => {
    console.log(
      "this is Tile: ",
      title,
      "/////////this is renderValue: ",
      renderValue,
      "//////////this is message: ",
      message
    );
    if (!title && renderValue && message) {
      setTitle(`🗨️  ${renderValue}`);
    }

    if (title && renderValue && message) {
      setPreviousChats((preChats) => [
        ...preChats,
        {
          title: title,
          role: "🙂",
          content: renderValue,
        },
        {
          title: title,
          role: "🤖",
          content: message.content,
        },
      ]);
    }
  }, [message, title]);

  const currentchat = previousChats.filter(
    (previousChat) => previousChat.title === title
  );

  // new Set(array) creates a new Set object from the resulting array.
  // Array.from(set) converts the Set object back into an array, containing only the unique titles.

  const uniqueTitle = Array.from(
    new Set(previousChats.map((previousChats) => previousChats.title))
  );

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("https://backend-b6uu.onrender.com/post");
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          throw new Error("Request failed");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts(); // Fetch posts initially

    const interval = setInterval(fetchPosts, 1000); // Fetch posts every 5 seconds

    return () => {
      clearInterval(interval); // Clean up the interval when the component unmounts
    };
  }, []); // Empty dependency array to run the effect only once on mount

  const handleSubmit = (e) => {
    e.preventDefault();
    getMessages();
    setValue("");
    console.log(currentchat);
  };

  const handleGuess = (index, role) => {
    console.log("clicked");
    const newGuessCorrect = [...guessCorrect];
    const isCorrect =
      (role === "user" && posts[index].role === "user") ||
      (role === "assistant" && posts[index].role === "assistant");
    newGuessCorrect[index] = isCorrect;
    setGuessCorrect(newGuessCorrect);
    console.log(guessCorrect);
  };

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitle?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <button onClick={chatRoom}>ChatRoom Who is AI</button>
        <button onClick={armyFact}>Army Facts AI</button>
        <button onClick={careerFact}>Career Services AI</button>
        <button onClick={darkMode}>Death Fact AI</button>

        <nav>
          <p> Made by Wei Chen</p>
        </nav>
      </section>

      <section className="main">
        {!title && <h1>Welcome to WeiChatGPT</h1>}
        <p>Hover here to see intruction</p>
        <div className="tutorial">
          <p>1. ChatRoom(teal): Guess who is AI with other users</p>
          <p>2. Army AI(green) :Tell Army Facts </p>{" "}
          <p>3. Career AI(yellow) :Guide job seaching Facts</p>
          <p>4. Dark mode AI(black): Tell death Facts</p>
          <p>Click selected AI to switch back to normal AI</p>
        </div>
        <ul className="feed">
          {!chatRoomStatus
            ? currentchat.map((ChatMessage, index) => (
                <li key={index}>
                  <p className="role">{ChatMessage.role}</p>
                  <p>{ChatMessage.content}</p>
                </li>
              ))
            : posts.map((ChatMessage, index) => (
                <li key={index}>
                  <p className="role">{`🗨️`}</p>
                  <p>{ChatMessage.chat}</p>
                  {ChatMessage.role === "user" && (
                    <div>
                      <button onClick={() => handleGuess(index, "user")}>
                        🙂
                      </button>
                      <button onClick={() => handleGuess(index, "assistant")}>
                        🤖
                      </button>
                    </div>
                  )}
                  {ChatMessage.role === "assistant" && (
                    <div>
                      <button onClick={() => handleGuess(index, "user")}>
                        🙂
                      </button>
                      <button onClick={() => handleGuess(index, "assistant")}>
                        🤖
                      </button>
                    </div>
                  )}

                  {guessCorrect[index] !== undefined && (
                    <p>
                      {guessCorrect[index]
                        ? "You guessed right!"
                        : "You guessed wrong!"}
                    </p>
                  )}
                </li>
              ))}
        </ul>

        <div className="bottom-section">
          <div className="input-container">
            <form onSubmit={handleSubmit}>
              <input value={value} onChange={(e) => setValue(e.target.value)} />
              <button id="submit" type="submit" className="illuminate-on-hover">
                ➢
              </button>
            </form>

            <p className="info">
              Free Research Preview. ChatGPT may produce inaccurate information
              about people, places, or facts. ChatGPT May 24 Version
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
