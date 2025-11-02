import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type LoxModule = typeof import("@lox-space/wasm");

const LoxContext = createContext<LoxModule | undefined>(undefined);

type LoxProviderProps = {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: (error: Error) => ReactNode;
};

export function LoxProvider({
  children,
  fallback = <div>Loading WASM...</div>,
  errorFallback = (error: Error) => (
    <div>Error loading WASM: {error.message}</div>
  ),
}: LoxProviderProps) {
  const [lox, setLox] = useState<LoxModule | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const module = await import("@lox-space/wasm");
        await module.default();
        setLox(module);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load WASM"));
      }
    }

    init();
  }, []);

  if (error) return <>{errorFallback(error)}</>;
  if (!lox) return <>{fallback}</>;

  return <LoxContext.Provider value={lox}>{children}</LoxContext.Provider>;
}

export function useLox() {
  const context = useContext(LoxContext);
  if (context === undefined) {
    throw new Error("useLox must be used within LoxProvider");
  }
  return context;
}
