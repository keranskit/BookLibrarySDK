export const NETWORKS = {
    SEPOLIA: 'sepolia',
    LOCALHOST: 'localhost'
}

export const INPUTS = {
    ADD_BOOK: {
        command: 'add-book',
        additionalParamsCount: 2
    },
    BORROW_BOOK: {
        command: 'borrow-book',
        additionalParamsCount: 1
    },
    RETURN_BOOK: {
        command: 'return-book',
        additionalParamsCount: 1
    },
    GET_ALL_AVAILABLE_BOOKS: {
        command: 'get-all-available-books',
        additionalParamsCount: 0
    },
    CHECK_IS_BOOK_AVAILABLE: {
        command: 'check-is-book-available',
        additionalParamsCount: 1
    },
    CHECK_IS_BOOK_RENTED: {
        command: 'check-is-book-rented',
        additionalParamsCount: 1
    },
}
