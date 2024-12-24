import React, {
  PropsWithChildren,
  useState,
  useEffect,
  createContext,
  useContext,
} from "react";
import { supabase } from "@/lib/superbase";
import { Session } from "@supabase/supabase-js";

// Define the AuthData type for context value
type AuthData = {
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
  isAdmin: boolean;
};

// Define the Profile type
type Profile = {
  id: string;
  group: string; // For example, "ADMIN" or "USER"
  // Add other profile fields as needed
};

// Create the AuthContext with default values
const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
  profile: null,
  isAdmin: false,
});

// AuthProvider component
export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Fetch the current session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        // If there's a session, fetch the user's profile
        if (session) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error initializing authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProfile = async (userId: string) => {
      try {
        // Fetch the profile from the database
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          setProfile(null);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error("Unexpected error fetching profile:", error);
        setProfile(null);
      }
    };

    initializeAuth();

    // Subscribe to auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);

        if (newSession) {
          await fetchProfile(newSession.user.id);
        } else {
          setProfile(null); // Clear profile on logout
        }
      }
    );

    // Cleanup subscription on unmount
    return () => subscription?.unsubscribe();
  }, []);

  // Derived state for isAdmin
  const isAdmin = profile?.group === "ADMIN";

  return (
    <AuthContext.Provider value={{ session, loading, profile, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
