// import { useCallback, useEffect, useRef, useState, useContext } from "react";
// import { usePost } from "../hooks/usePost";
// import { postUri } from "../../http";
// import { AuthContext } from "../store/AuthContext";
// import Quill from "quill";
// import "quill/dist/quill.snow.css";
// import { useSocket } from "../store/SocketContext";

// import "../components/TextEditor.css";

// const ToolBarOptions = [
//   [{ header: [1, 2, 3, 4, 5, 6, false] }],
//   [{ font: [] }],
//   [{ size: ["small", false, "large", "huge"] }],
//   [{ list: "ordered" }, { list: "bullet" }],
//   ["bold", "italic", "underline"],
//   [({ color: [] }, { background: [] })],
//   [{ script: "sub" }, { script: "super" }],
//   [{ align: [] }],
//   ["image", "blockquote", "code-block"],
//   ["clean"],
// ];

// const TextEditor = ({ groupDocumentId }) => {
//   const { userData, token } = useContext(AuthContext);

//   const pendingCharsRef = useRef(0);
//   const typingTimeoutRef = useRef(null);

//   const socket = useSocket();
//   const [quill, setQuill] = useState();

//   const { postData } = usePost(postUri);

//   useEffect(() => {
//     if (socket == null || quill == null) return;

//     socket.once("load-document", (document) => {
//       quill.setContents(document);
//       quill.enable();
//     });

//     socket.emit("get-document", groupDocumentId);
//   }, [socket, quill]);

//   useEffect(() => {
//     if (socket == null || quill == null) return;

//     const interval = setInterval(() => {
//       socket.emit("save-document", quill.getContents());
//     }, 2000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, [socket, quill]);

//   useEffect(() => {
//     if (socket == null || quill == null) return;

//     const handler = (delta) => {
//       quill.updateContents(delta);
//     };

//     socket.on("receive-changes", handler);

//     return () => {
//       socket.off("receive-changes", handler);
//     };
//   }, [socket, quill]);

//   useEffect(() => {
//     if (!socket || !quill) return;

//     const flush = () => {
//       const toSend = pendingCharsRef.current;
//       if (toSend > 0) {
//         postData(
//           import.meta.env.VITE_POST_GROUP_DOCUMENTS_CONTRIBUTIONS_URI,
//           {
//             documentId: groupDocumentId,
//             schoolEmail: userData?.schoolEmail,
//             addedChars: toSend,
//           },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         pendingCharsRef.current = 0;
//       }
//     };

//     const handler = (delta, oldDelta, source) => {
//       if (source !== "user") return;

//       let inserted = 0;
//       delta.ops.forEach((op) => {
//         if (op.insert) {
//           if (typeof op.insert === "string") inserted += op.insert.length;
//           else inserted += 1;
//         }
//       });

//       if (inserted > 0) {
//         pendingCharsRef.current += inserted;

//         clearTimeout(typingTimeoutRef.current);
//         typingTimeoutRef.current = setTimeout(() => {
//           flush();
//         }, 1500);
//       }

//       socket.emit("send-changes", delta);
//     };

//     quill.on("text-change", handler);

//     return () => {
//       quill.off("text-change", handler);
//       clearTimeout(typingTimeoutRef.current);
//       flush();
//     };
//   }, [socket, quill, groupDocumentId, userData, postData, token]);

//   const editorRef = useCallback((wrapper) => {
//     if (wrapper == null) return;

//     wrapper.innerHTML = "";
//     const editor = document.createElement("div");
//     wrapper.append(editor);
//     const q = new Quill(editor, {
//       theme: "snow",
//       modules: { toolbar: ToolBarOptions },
//     });
//     q.disable();
//     q.setText("Loading.........");
//     setQuill(q);
//   }, []);

//   return <div className="rounded-md bg-gray-100" ref={editorRef} />;
// };

// export default TextEditor;

import { useCallback, useEffect, useRef, useState, useContext } from "react";
import { usePost } from "../hooks/usePost";
import { postUri } from "../../http";
import { AuthContext } from "../store/AuthContext";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useSocket } from "../store/SocketContext";
import "../components/TextEditor.css";

const ToolBarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ size: ["small", false, "large", "huge"] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const TextEditor = ({ groupDocumentId }) => {
  const { userData, token } = useContext(AuthContext);
  const pendingCharsRef = useRef(0);
  const typingTimeoutRef = useRef(null);
  const socket = useSocket();
  const [quill, setQuill] = useState();
  const { postData } = usePost(postUri);

  // Load the document
  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();

      if (userData?.role === "lecturer") {
        quill.disable();
        const toolbar = document.querySelector(".ql-toolbar");
        if (toolbar) toolbar.style.display = "none";
      }
    });

    socket.emit("get-document", groupDocumentId);
  }, [socket, quill, userData]);

  // Auto-save document every 2 seconds
  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 2000);

    return () => clearInterval(interval);
  }, [socket, quill]);

  // Receive changes from socket
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", handler);
    return () => socket.off("receive-changes", handler);
  }, [socket, quill]);

  // Handle typing and contribution tracking
  useEffect(() => {
    if (!socket || !quill) return;

    const flush = () => {
      const toSend = pendingCharsRef.current;
      if (toSend > 0) {
        postData(
          import.meta.env.VITE_POST_GROUP_DOCUMENTS_CONTRIBUTIONS_URI,
          {
            documentId: groupDocumentId,
            schoolEmail: userData?.schoolEmail,
            addedChars: toSend,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        pendingCharsRef.current = 0;
      }
    };

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;

      let inserted = 0;
      delta.ops.forEach((op) => {
        if (op.insert) {
          if (typeof op.insert === "string") inserted += op.insert.length;
          else inserted += 1;
        }
      });

      if (inserted > 0) {
        pendingCharsRef.current += inserted;
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => flush(), 1500);
      }

      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
      clearTimeout(typingTimeoutRef.current);
      flush();
    };
  }, [socket, quill, groupDocumentId, userData, postData, token]);

  // Editor setup
  const editorRef = useCallback(
    (wrapper) => {
      if (wrapper == null) return;
      wrapper.innerHTML = "";

      const editor = document.createElement("div");
      wrapper.append(editor);

      const q = new Quill(editor, {
        theme: "snow",
        modules: { toolbar: ToolBarOptions },
      });

      q.disable();
      q.setText("Loading.........");
      setQuill(q);

      setTimeout(() => {
        if (userData?.role === "lecturer") {
          q.disable();
          const toolbar = wrapper.querySelector(".ql-toolbar");
          if (toolbar) toolbar.style.display = "none";
        }
      }, 0);
    },
    [userData]
  );

  return (
    <div
      className={`rounded-md ${
        userData?.role === "lecturer" ? "" : "bg-gray-100"
      }`}
      ref={editorRef}
    />
  );
};

export default TextEditor;
