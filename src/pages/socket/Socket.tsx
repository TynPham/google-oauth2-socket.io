/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ResponseData, ResponseDataWithPagination } from "../../types";
import { Profile } from "../../types/profile.types";
import { jwtDecode } from "jwt-decode";
import InfiniteScroll from "react-infinite-scroll-component";
export interface SocketProps {}

type Conversation = {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
};

const users: { name: string; user_name: string }[] = [
  {
    name: "user1",
    user_name: "user6570c93ebe9acb4f354dffb1",
  },
  {
    name: "user2",
    user_name: "user6570c99f57f95c7c2cd8e148",
  },
];

const LIMIT = 5;
const PAGE = 1;
let socket: any;
export default function Socket(props: SocketProps) {
  const accessToken = localStorage.getItem("access_token") || "";
  const sender_id = jwtDecode<{ userId: string }>(accessToken).userId;
  const [content, setContent] = useState<string>("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [receiver, setReceiver] = useState<string>("");
  const [pagination, setPagination] = useState<{ page: number; total_page: number }>({ page: 1, total_page: 1 });

  useEffect(() => {
    socket = io("http://localhost:3000", {
      auth: { id: sender_id },
    });
    socket.on("receive_message", (data: { payload: Conversation }) => {
      const { payload } = data;
      setConversations((prev) => [...prev, payload]);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, []);

  const handleChat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (content) {
      const conversation: Conversation = {
        id: new Date().getTime().toString(),
        content,
        sender_id,
        receiver_id: receiver,
      };
      setConversations((prev) => [...prev, conversation]);
      socket.emit("send_message", { payload: conversation });
      setContent("");
    }
  };
  const handleLoginChat = ({ name, user_name }: { name: string; user_name: string }) => {
    axios
      .get<ResponseData<Profile>>(`users/${user_name}`, {
        baseURL: "http://localhost:3000/",
        // headers: {
        //   Authorization: "Bearer " + localStorage.getItem("access_token"),
        // },
      })
      .then((data) => {
        setReceiver(data.data.result._id);
        alert(`you ar chatting with ${name}`);
      });
  };

  useEffect(() => {
    if (receiver) {
      axios
        .get<ResponseDataWithPagination<Conversation[]>>(`conversations/receiver/${receiver}`, {
          baseURL: "http://localhost:3000/",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
          params: {
            limit: LIMIT,
            page: PAGE,
          },
        })
        .then((data) => {
          setConversations(data.data.result.reverse());
          setPagination({ page: data.data.page, total_page: data.data.total_page });
        });
    }
  }, [receiver]);

  const fetchMoreConversations = () => {
    console.log("e");
    if (receiver && pagination.page < pagination.total_page) {
      axios
        .get<ResponseDataWithPagination<Conversation[]>>(`conversations/receiver/${receiver}`, {
          baseURL: "http://localhost:3000/",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
          params: {
            limit: LIMIT,
            page: pagination.page + 1,
          },
        })
        .then((data) => {
          setConversations((prev) => [...data.data.result.reverse(), ...prev]);
          setPagination({ page: data.data.page, total_page: data.data.total_page });
        });
    }
  };

  return (
    <div>
      <div>
        Chat with{" "}
        {users.map((user) => (
          <button key={user.user_name} onClick={() => handleLoginChat(user)}>
            {user.name}
          </button>
        ))}
      </div>
      Chat
      <form onSubmit={handleChat}>
        <div className="wrapper">
          <div
            className="conversations"
            id="scrollableDiv"
            style={{
              maxHeight: 200,
              overflow: "auto",
              display: "flex",
              flexDirection: "column-reverse",
            }}
          >
            <InfiniteScroll
              dataLength={conversations.length}
              next={fetchMoreConversations}
              style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
              inverse={true} //
              hasMore={pagination.page < pagination.total_page}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableDiv"
            >
              <ul>
                {conversations.map((conversation, index) => (
                  <li className={conversation.sender_id === sender_id ? "sender" : ""} key={index}>
                    {conversation.content}
                  </li>
                ))}
              </ul>
            </InfiniteScroll>
          </div>
          <input type="text" name="content" value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
