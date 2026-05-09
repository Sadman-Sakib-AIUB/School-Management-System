"use client";
import { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "../store/store";
import { initializeAuth } from "../store/slices/authSlice";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    dispatch(initializeAuth());
    setIsReady(true);
  }, [dispatch]);

   if (!isReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          <p className="text-gray-500 text-3xl text-center pt-5">লোডিং...</p>
        </div>
      </div>
    );
  }
  return children;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}