import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Use undefined initial state to indicate "not yet determined"
  // This prevents hydration mismatches since we return false on SSR
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Return false during SSR/initial render to match server-rendered HTML
  // After hydration, the effect will set the correct value
  return isMobile ?? false
}
