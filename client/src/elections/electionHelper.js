const isEmpty = (ob) => {
    for (const key in ob) {
        return false
    }
    return true
}
export { isEmpty }