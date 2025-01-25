import { useEffect, useState } from "react";

const useAudio = (url: string) => {
  const [audio] = useState(
    typeof window !== "undefined" ? new Audio(url) : undefined
  );
  const [playing, setPlaying] = useState(false);

  const toggle = (play: boolean) => {
    setPlaying(play);
  };

  useEffect(() => {
    playing ? audio?.play() : audio?.pause();
  }, [audio, playing]);

  useEffect(() => {
    audio?.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio?.removeEventListener("ended", () => setPlaying(false));
    };
  }, [audio]);

  return { playing, toggle };
};

export default useAudio;
