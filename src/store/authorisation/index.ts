import { create } from 'zustand'
import { devtools, persist } from "zustand/middleware";

interface AuthorizationState {
  authorisation: string | null
  code_verifier: string | null
  setAuthorisation: (authorisation: string) => void
  setCodeVerifier: (code_verifier: string) => void
}

export const useAuthorizationStore = create<AuthorizationState>()(
  devtools(
    persist(
      (set) => ({
        authorisation: null,
        code_verifier: null,
        setAuthorisation: (authorisation: string) => set((state: AuthorizationState) => ({ ...state, authorisation })),
        setCodeVerifier: (code_verifier: string) => set((state: AuthorizationState) => ({ ...state, code_verifier }))
      }),
      {
        name: "authorization",
      }
    )
  )
)