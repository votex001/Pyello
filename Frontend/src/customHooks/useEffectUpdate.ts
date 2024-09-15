import { useEffect, useRef } from "react"

export const useEffectUpdate = (callBack: () => void, dependencies: React.DependencyList) => {
    const isFirstRender = useRef(true)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        callBack()
    }, dependencies)
}
