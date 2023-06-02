import { DyteButton } from "@dytesdk/react-ui-kit";
import { useDyteMeeting } from "@dytesdk/react-web-core";
import React, { useEffect, useRef, useState } from "react";
import applyDesign from "../utils/applyDesign";
import VideoPlayer from "../VideoPlayer/ViedeoPlayer";

const Setup = () => {
  const { meeting } = useDyteMeeting();
  const buttonEl = useRef(null);
  const [playRecodedSession, setPlayRecordedSession] = useState(false);
  const videoUrl = "https://627zx1-3000.csb.app/recordings/out.m3u8";

  useEffect(() => {
    if (!buttonEl.current) return;
    applyDesign(buttonEl.current);
  }, []);

  if (!meeting) return null;
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p>You haven't joined the room yet.</p>
      <DyteButton ref={buttonEl} onClick={() => meeting.joinRoom()}>
        Join Room
      </DyteButton>

      <DyteButton
        style={{ marginTop: "10px" }}
        onClick={() => setPlayRecordedSession(true)}
      >
        Play recorded video
      </DyteButton>

      {playRecodedSession && <VideoPlayer videoUrl={videoUrl} />}
    </div>
  );
};

export default Setup;
