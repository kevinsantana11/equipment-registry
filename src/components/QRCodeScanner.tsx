"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function QRCodeScanner() {
    let [message, setMessage] = useState("Nothing detected.");
    let lastScan = useRef("");
    let [count, setCount] = useState(0);

    function onScanSuccess(decodedText: string, decodedResult: any) {
        try {
            Number(decodedText);
            if (decodedText === lastScan.current) {
                setCount((curr) => curr + 1);
            } else {
                setCount(1);
                lastScan.current = decodedText;
            }
        } catch (e) {
            setCount(0);
            setMessage("That code doesn't represent a number/id");
            console.log(`Error: ${e}`, e);
        }
    }

    const colorMap = (cnt: number) => {
        if (cnt == 1) {
            return "border-orange-500";
        } else if (cnt == 2) {
            return "border-yellow-500";
        } else if (cnt >= 3) {
            return "border-green-500";
        } else {
            return "border-red-500";
        }
    }

    const onScanError = (errorMessage: string, error: any) => {
        setCount(0);
    };
    useEffect(() => {
        var html5QrcodeScanner = new Html5QrcodeScanner(
            "qr-code-scanner", { fps: 10 }, undefined);
        html5QrcodeScanner.render(onScanSuccess, onScanError);
    }, []);

    useEffect(() => {
        if (count == 1) {
            setMessage(`Detected code`);
        } else if (count > 1 && count < 3 )
            setMessage(`Decoded id: ${lastScan.current}, verifying...`);
        if (count >= 3) {
            redirect(`/members/${Number(lastScan.current)}`);
        }
    }, [count]);

    return (
        <div className="flex flex-col w-[400px]">
            <p>Please click <b>Request Camera Permissions</b> to enable the application to access and enable your devices camera.</p>
            <div className="flex-col self-center">
                <p>{message}</p>
            </div>
            <div className={[colorMap(count), "border-4"].join(" ")}>
                <div id="qr-code-scanner"></div>
            </div>
        </div>
    )
}