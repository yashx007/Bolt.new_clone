"use client";
import React, { useContext, useState, useEffect } from "react";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import Image from "next/image";
import { ArrowRight, Loader2Icon } from "lucide-react";
import { Link } from "lucide-react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { useSidebar } from "../ui/sidebar";
import { toast } from "sonner";


export const countToken = (inputText) => {
  if (!inputText || typeof inputText !== "string") {
    console.warn("Invalid or missing input detected, defaulting to empty string.");
    inputText = ""; // Default to an empty string
  }
  return inputText.trim().split(/\s+/).filter((word) => word).length;
};



function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { messages, setMessages } = useContext(MessagesContext);

  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const UpdateTokens = useMutation(api.users.UpdateToken);

  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    if (id) GetWorkspaceData();
  }, [id]);

  const GetWorkspaceData = async () => {
    try {
      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id,
      });
      setMessages(result?.messages || []);
    } catch (error) {
      console.error("Error fetching workspace data:", error);
    }
  };

  useEffect(() => {
    if (messages?.length > 0 && messages[messages.length - 1]?.role === "user") {
      GetAiResponse();
    }
  }, [messages]);

  const GetAiResponse = async () => {
    setLoading(true);
    try {
      const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
      const result = await axios.post("/api/ai-chat", { prompt: PROMPT });

      const aiResp = {
        role: "ai",
        content: result.data.result,
      };

      const updatedMessages = [...messages, aiResp];
      setMessages(updatedMessages);

      await UpdateMessages({
        messages: updatedMessages,
        workspaceId: id,
      });

      const token = Number(userDetail?.token) - countToken(aiResp.content);

      setUserDetail(prev => ({
        ...prev,
        token: token
      }))

      await UpdateTokens({ userId: userDetail?._id, token });
    } catch (error) {
      console.error("Error generating AI response:", error);
    } finally {
      setLoading(false);
    }
  };

  const onGenerate = (input) => {
    if (userDetail?.token < 10) {
      toast('You dont have enough tokens')
      return;
    }
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setUserInput("");
  };

  return (
    <div className="relative h-[85vh] flex flex-col">
      {/* Messages Section */}
      <div className="flex-1 overflow-y-scroll scrollbar-hide pl-5">
        {(Array.isArray(messages) ? messages : []).map((msg, index) => (
          <div
            key={index}
            className="p-3 rounded-lg mb-2 flex gap-2 items-center leading-7"
            style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
          >
            {msg?.role === "user" && (
              <Image
                src={userDetail?.picture}
                alt="userImage"
                width={35}
                height={35}
                className="rounded-full"
              />
            )}
            <ReactMarkdown className="flex flex-col">{msg.content}</ReactMarkdown>
          </div>
        ))}
        {loading && (
          <div
            className="p-3 rounded-lg mb-2 flex gap-2 items-start"
            style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
          >
            <Loader2Icon className="animate-spin" />
            <h2>Generating response...</h2>
          </div>
        )}
      </div>


      {/* Input Section */}
      <div className="flex gap-2 items-end">
        {userDetail && (
          <Image
            src={userDetail?.picture}
            className="rounded-full cursor-pointer"
            onClick={toggleSidebar}
            alt="user"
            width={30}
            height={30}
          />
        )}
        <div
          className="p-5 border rounded-xl max-w-xl w-full mt-3"
          style={{ backgroundColor: Colors.BACKGROUND }}
        >
          <div className="flex gap-2">
            <textarea
              placeholder={Lookup.INPUT_PLACEHOLDER}
              value={userInput}
              onChange={(event) => setUserInput(event.target.value)}
              className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
            />
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer"
              />
            )}
          </div>
          <div>
            <Link className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
