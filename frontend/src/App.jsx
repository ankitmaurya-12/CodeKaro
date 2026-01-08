import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Editor from '@monaco-editor/react'

const socket = io("http://localhost:9000");

function App() {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// start code here");
  const [copySucess, setCopySucess] = useState("");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState([]);
  // const [typing, setTyping] = useState("");

  useEffect(()=>{
    socket.on("userJoined", (users)=>{
      setUsers(users);
    })

    socket.on("codeUpdate",(newCode)=>{
      setCode(newCode);
    })

    /////////////////////////////////////////////////
    // this is small town coder method but it will not stroe multiple user in array only work with string usestate
    // socket.on("userTyping", (user)=>{
    //   setTyping(`${user.slice(0,8)}... is typing.`);

    //   setTimeout(() => {
    //     setTyping("")
    //   }, 2500);
    // })
    //////////////////////////////


    //but this is seen in CoderGyan and it perfect to add multiple user in it
    socket.on("userTyping", (user) => {
      setTyping(prev => {
        if (prev.includes(user)) return prev;
        return [...prev, user];
      });
    
      setTimeout(() => {
        setTyping(prev => prev.filter(u => u !== user));
      }, 3000);
    });

    socket.on("languageUpdate",(newLanguage)=>{
      setLanguage(newLanguage);
    })
    
    return ()=>{
      socket.off("userJoined");
      socket.off("codeUpdate");
      socket.off("userTyping");
      socket.off("languageUpdate");
    }
  },[]);

  useEffect(()=>{
    const handleBeforeUpload = () =>{
      socket.emit("leaveRoom");
    }

    window.addEventListener("beforeunload",handleBeforeUpload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUpload);
    };
  },[]);

  const joinRoom = () => {
    // console.log(roomId, userName);

    if ((roomId && userName)) {
      socket.emit("join", { roomId, userName });
      setJoined(true);
    }
  };

  const leaveRoom = () =>{
    socket.emit("leaveRoom");
    setJoined(false);
    setRoomId("");
    setUserName("");
    setCode("// start code here");
    setLanguage("javascript");
  }

  //to copy the room code
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopySucess("Copied !!");
    setTimeout(() => {
      setCopySucess("")
    }, 2000);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeChange", {roomId, code: newCode});

    socket.emit("typing", {roomId, userName});
  };

  
  const handleLanguageChange = (e)=>{
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socket.emit("languageChange", {roomId, language: newLanguage});
  }


  if (!joined) {
    return (
      <div className="join-container">
        <div className="join-form">
          <h1>Join Code Room</h1>
          <input
            type="text"
            placeholder="Room Id"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={joinRoom}>Joined Room</button>
        </div>
      </div>
    );
  }

  // return <div>User Joined</div>;

  return (
    <div className="editor-conatiner">
      <div className="sidebar">
        <div className="room-info">
          <h2>Code Room:{roomId}</h2>
          <button onClick={copyRoomId} className="copy-button">
            Copy Id
          </button>
          {copySucess && <span className="copy-sucess">{copySucess}</span>}
        </div>
        <h3>Users in Room :</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user.slice(0, 8)}...</li>
          ))}
          {/* <li>Shubu</li> */}
        </ul>

        {/* <p className="typing-indicator">{typing}</p> */}

        {typing.length >0 && (
        <p className="typing-indicator">
          {typing.map((u) => `${u.slice(0, 8)}...`).join(", ")} typing...
        </p>
        )}

        <select
          className="language-selector"
          value={language}
          // onChange={(e) => setLanguage(e.target.value)}
          onChange={handleLanguageChange}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
        <button className="leave-button" onClick={leaveRoom}>Leave Room</button>
      </div>

      <div className="editor-wrapper">
        <Editor
          height={"100%"}
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
      </div>
    </div>
  );
}

export default App;
