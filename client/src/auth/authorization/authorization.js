
async function getAuth() {
    try {
        const response = await fetch('/api/auth', {
            method: 'GET'
        })

        const responseData = await response.json()

        return responseData
    }
    catch (error) {
        console.log(error);
        return { message: "Unauthorized", isAdmin: false }
    }
}
export default getAuth;