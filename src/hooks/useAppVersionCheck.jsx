import { useEffect, useRef } from "react";

export default function useAppVersionCheck(interval = 30000) {
  const currentVersion = useRef(null);

  useEffect(() => {
    const checkVersion = async () => {
        // console.log("checking version")
        try {
            const res = await fetch("/version.json", { cache: "no-store" });
            const data = await res.json();

            // console.log("version check data", data)

            if (!currentVersion.current) {
                currentVersion.current = data.version;
            } else if (data.version !== currentVersion.current) {
                // console.log("version mismatch")
                window.location.reload(true); // hard refresh
            }
        } catch (err) {
            console.error("Version check failed:", err);
        }
    };

    checkVersion();
    const id = setInterval(checkVersion, interval);
    return () => clearInterval(id);
  }, [interval]);
}
