import { firebaseAuth } from "@/lib/firebase";
import { User as FirebaseAuthUser, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

type FirebaseAuthState = {
  user: FirebaseAuthUser | undefined;
  isLoading: boolean;
};

export const useFirebaseAuthState = () => {
  const [firebaseAuthState, setFirebaseUser] = useState<FirebaseAuthState>({
    user: undefined,
    isLoading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        setFirebaseUser({ user: user, isLoading: false });
        return;
      }
      setFirebaseUser({ user: undefined, isLoading: false });
    });

    return () => unsubscribe();
  }, []);

  return { firebaseAuthState };
};
