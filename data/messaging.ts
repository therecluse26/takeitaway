const companyInfo = {
    phoneNumber: "(602) 524-6545"
}

const pageMessages = {
    contactUs: {
        title: "Contact Us",
        messages: {
            submitted: "Thank you for your message! We will reply to you as soon as possible."
        }
    },
    
}

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
    },
    api: {
        unauthorized: {
            code: 403,
            message: "You are not authorized to perform this action",
        },
        notFound: {
            code: 404,
            message: "The requested resource was not found"
        },
        methodNotAllowed: {
            code: 405,
            message: "The given method is not allowed"
        },
        serverError: {
            code: 500,
            message: "The server encountered an error and could not complete your request."
        },
        stripe: {
            noCustomer: {
                code: 500,
                message: "No Stripe customer found for this user"
            },
            noSessionId: {
                code: 400,
                message: "No Stripe session ID found"
            },
            noSession: {
                code: 400,
                message: "No Stripe session found"
            },
            noSetupIntent: {
                code: 400,
                message: "No Stripe setup intent found"
            },
            paymentMethod: {
                code: 400,
                message: "No Stripe payment method found"
            },
            paymentMethodAlreadyExists: {
                code: 400,
                message: "The specified payment method already exists"
            },
        }
    },
    form: {
        failedToSubmit: {
            code: 400,
            message: "There was an error submitting your message. Please contact us at " + companyInfo.phoneNumber + "."
        },
        failedToInitialize: {
            code: 400,
            message: "There was an error with the contact form. Please contact us at " + companyInfo.phoneNumber + "."
        }

    }
}

const uiMessages = {
    homeBtnVerbose: "Go to home page"
}

export {errorMessages, pageMessages, uiMessages, companyInfo }