const { nanoid } = require('nanoid')
const books = require('./books')

const addBook = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    }

    const id = nanoid(16)
    const finished = pageCount === readPage
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    }

    books.push(newBook)

    const isSuccess = books.filter((book) => book.id === id).length > 0

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        })

        response.code(201)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan'
    })
    response.code(500)
    return response
}

const getAllBooks = (request) => {
    let filteredBooks = [...books]

    if (request.query.name) {
        const searchKeyword = request.query.name.toLowerCase()
        filteredBooks = filteredBooks.filter(book =>
            book.name.toLowerCase().includes(searchKeyword)
        )
    }

    if (request.query.reading !== undefined) {
        const readingStatus = request.query.reading === '1'
        filteredBooks = filteredBooks.filter(book =>
            book.reading === readingStatus
        )
    }

    if (request.query.finished !== undefined) {
        const finishedStatus = request.query.finished === '1'
        filteredBooks = filteredBooks.filter(book =>
            book.finished === finishedStatus
        )
    }

    const simplifiedBooks = filteredBooks.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
    }))

    return {
        status: 'success',
        data: {
            books: simplifiedBooks
        }
    }
}

const getBookById = (request, h) => {
    const { id } = request.params

    const book = books.filter((n) => n.id === id)[0]

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book
            }
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
}

const editBookById = (request, h) => {
    const { id } = request.params

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
    const updatedAt = new Date().toISOString()

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    }

    const index = books.findIndex((book) => book.id === id)

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        }

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        })
        response.code(200)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
}

const deleteBookById = (request, h) => {
    const { id } = request.params

    const index = books.findIndex((book) => book.id === id)

    if (index !== -1) {
        books.splice(index, 1)
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })
        response.code(200)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
}

module.exports = {
    addBook, getAllBooks, getBookById, editBookById, deleteBookById
}
