export function setSessionStorage(key: string, value: string | null): void {
    if (value === null) {
        sessionStorage.removeItem(key) // Remove the item if value is null
    } else {
        sessionStorage.setItem(key, value) // Set the item if value is a string
    }
}

export function getSessionStorage(key: string): string | null {
    return sessionStorage.getItem(key)
}
