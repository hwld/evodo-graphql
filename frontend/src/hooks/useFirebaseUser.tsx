import { firebaseAuth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

type FirebaseUser =
  | { idToken: string; id: string }
  | { idToken: undefined; id: undefined };

export const useFirebaseUser = () => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser>({
    idToken: undefined,
    id: undefined,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        const userId = user.uid;
        const token = await user.getIdToken();
        setFirebaseUser({ idToken: token, id: userId });
        return;
      }
      setFirebaseUser({ idToken: undefined, id: undefined });
    });

    return () => unsubscribe();
  }, []);

  return { firebaseUser };
};
