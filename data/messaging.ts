const pageMessages = {}

const errorMessages = {
    pages: {
        unauthorized: {
            code: 403,
            title: "This is a restricted area",
            description: "You tried to reach a page that you are not authorized to access. Please contact us if you require assistance."
        },
        notFound: {
            code: 404,
            title: "You have found a secret place",
            description: "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. You may have mistyped the address, or the page hasbeen moved to another URL."
        },
        serverError: {
            code: 500,
            title: "Server error",
            description: "The server encountered an error and could not complete your request."
        },
    }
}

const uiMessages = {
    homeBtnVerbose: "Go to home page"
}

export {errorMessages, pageMessages, uiMessages }