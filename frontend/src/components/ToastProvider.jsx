// ToastProvider.jsx
import React from "react";
import { Toaster } from "react-hot-toast";

const ToastProvider = ({ children }) => {
    return (
        <>
            {children}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#333",
                        color: "#fff",
                    },
                    success: {
                        style: {
                            background: "#10B981",
                        },
                    },
                    error: {
                        style: {
                            background: "#EF4444",
                        },
                    },
                }}
            />
        </>
    );
};

export default ToastProvider;