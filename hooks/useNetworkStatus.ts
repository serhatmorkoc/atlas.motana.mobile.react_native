import { useState, useEffect, useCallback } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  isChecking: boolean;
  refresh: () => Promise<boolean>;
}

const useNetworkStatus = (): NetworkStatus => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // Initial network check
  useEffect(() => {
    const checkInitialConnection = async () => {
      try {
        const state = await NetInfo.fetch();
        setIsConnected(state.isConnected ?? false);
        setIsInternetReachable(state.isInternetReachable);
        if (__DEV__) {
          console.log("[Network] Initial check:", state.isConnected, "reachable:", state.isInternetReachable);
        }
      } catch (error) {
        if (__DEV__) {
          console.error("[Network] Initial check failed:", error);
        }
        setIsConnected(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkInitialConnection();
  }, []);

  // Listen for network changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      if (__DEV__) {
        console.log("[Network] Status changed:", state.isConnected, "reachable:", state.isInternetReachable);
      }
      setIsConnected(state.isConnected ?? false);
      setIsInternetReachable(state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  // Manual refresh function
  const refresh = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      const state = await NetInfo.fetch();
      const connected = state.isConnected ?? false;
      setIsConnected(connected);
      setIsInternetReachable(state.isInternetReachable);
      if (__DEV__) {
        console.log("[Network] Refresh check:", connected, "reachable:", state.isInternetReachable);
      }
      return connected;
    } catch (error) {
      if (__DEV__) {
        console.error("[Network] Refresh check failed:", error);
      }
      setIsConnected(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  return { isConnected, isInternetReachable, isChecking, refresh };
};

export default useNetworkStatus;