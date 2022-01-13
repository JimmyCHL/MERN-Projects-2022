import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MicIcon from "@mui/icons-material/Mic";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import { Avatar, IconButton } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";
import axios from "./axios";
import ScrollToBottom, { useScrollToBottom } from "react-scroll-to-bottom";

const Chat = ({ messages }) => {
  const scrollToBottom = useScrollToBottom();
  const [input, setInput] = useState("");
  const scrollRef = useRef();
  const sendMessage = async (e) => {
    e.preventDefault();
    await axios.post("/api/messages/new", {
      message: input,
      name: "Jimmy",
      timestamp: new Date().toLocaleString(),
      received: false,
    });

    setInput("");
    // scrollRef.current.scrollIntoView(false, {
    //   behavior: "smooth",
    //   block: "end",
    // });
    scrollToBottom();
  };
  useEffect(() => {
    scrollToBottom();
  }, []);
  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />
        <div className="chat__headerInfo">
          <h3>Room name</h3>
          <p>Last seen at...</p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <ScrollToBottom
        animating={true}
        initialScrollBehavior="smooth"
        className="chat__body"
      >
        {messages.map((message, i) => (
          <p
            key={i}
            className={`chat__message ${message.received && "chat__receiver"}`}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {new Date().toLocaleString()}
            </span>
          </p>
        ))}
      </ScrollToBottom>

      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button type="submit" onClick={sendMessage}>
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
};

export default Chat;
