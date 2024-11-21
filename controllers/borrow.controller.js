const { request } = require("express")
const { response } = require("../routes/book.route")
const { where } = require("sequelize")

const borrowModel = require(`../models/index`).borrow // load model for `borrow` table
const detailsOfBorrowModel = require(`../models/index`).details_of_borrow  // load model for `details_of_borrow` table
const Op = require(`sequelize`).Op // load Operator from Sequelize

// create function for add book borrowing
exports.addBorrowing = async (request, response) => {
    // prepare data for borrow's table
    let newData = {
        memberID: request.body.memberID,
        adminID: request.body.adminID,
        date_of_borrow: request.body.date_of_borrow,
        date_of_return: request.body.date_of_return,
        status: request.body.status,
    }

    // execute for inserting to borrow's table
    borrowModel.create(newData)
        .then(result => {
            // get the latest id of book borrowing
            let borrowID = result.id

            // store details of book borrowing from request (type: array object)
            let detailsOfBorrow = request.body.details_of_borrow

            // insert borrowID to each item of detailsOfBorrow
            for (let i = 0; i < detailsOfBorrow.length; i++) {
                detailsOfBorrow[i].borrowID = borrowID
            }

            // insert all data of detailsOfBorrow
            detailsOfBorrowModel.bulkCreate(detailsOfBorrow)
                .then(result => {
                    return response.json({
                        success: true,
                        messsage: `New Book Borrowed has been inserted`
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    })
                })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

// create function for update book borrowing 
exports.updateBorrowing = async (request, response) => {
    // prepare data for borrow's table
    let newData = {
        memberID: request.body.memberID,
        adminID: request.body.adminID,
        date_of_borrow: request.body.date_of_borrow,
        date_of_return: request.body.date_of_return,
        status: request.body.status
    }

    // prepare parameter Borrow ID
    let borrowID = request.params.id

    // execute for inserting to borrow's table
    borrowModel.update(newData, { where: { id: borrowID } })
        .then(async result => {
            // delete all detailsOfBorrow based on borrowID
            await detailsOfBorrowModel.destroy({
                where: { borrowID: borrowID }
            })

            // store details of book borrowing from request
            let detailsOfBorrow = request.body.details_of_borrow

            // insert borrowID to each item of detailsOfBorrow
            for (let i = 0; i < detailsOfBorrow.length; i++) {
                detailsOfBorrowModel[i].borrowID = borrowID
            }

            // re-insert all data of detailsOfBorrow
            detailsOfBorrowModel.bulkCreate(detailsOfBorrow)
                .then(result => {
                    return response.json({
                        success: true,
                        message: `Book Borrowed has been`
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    })
                })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

// create function for delete book borrowing's data
exports.deleteBorrowing = async (request, response) => {
    // prepare borrowID that as parameter to delete
    let borrowID = request.params.id

    // delete detailsOfBorrow using model
    detailsOfBorrowModel.destroy({
        where: {borrowID: borrowID}
    })
        .then(result => {
            // delete borrow's data using model
            borrowModel.destroy({where: {id: borrowID}})
                .then(result => {
                    return response.json({
                        success: true,
                        message: `Borrowing Book's has deleted`
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    })
                })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

// create function for return borrowed book
exports.returnBook = async (request, response) => {
    // prepare borrowID that will be return
    let borrowID = request.params.id

    // prepare current time for return's time
    let today = new Date()
    let currentDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

    // update status and date_of_return from borrow's data
    borrowModel.update(
        {
            date_of_return: currentDate,
            status: true
        },
        {
            where: { id:borrowID }
        }
    )
        .then(result => {
            return response.json({
                success: true,
                message: `Book has been returned`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

// create function for get all borrowing data
exports.getBorrow = async (request, response) => {
    let data = await borrowModel.findAll(
        {
            include: [
                `member`, `admin`,
                {
                    model: detailsOfBorrowModel,
                    as: `details_of_borrow`,
                    include: ["book"]
                }
            ]
        }
    )

    return response.json({
        success: true,
        data: data,
        message: `All borrowing book have been loaded`
    })
}