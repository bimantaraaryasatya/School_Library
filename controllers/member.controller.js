const { request, response } = require('express')
const { where } = require('sequelize')

// Load model for `members` table
const memberModel = require('../models/index').member

// Load operation 
const Op = require(`sequelize`).Op

// Create function for read all data
exports.getAllMember = async (request, response) => {
    // call findAll() to get all data
    let members = await memberModel.findAll()
    return response.json({
        success: true,
        data: members,
        message: `All Members have been loaded`
    })
}

// Create function for filter
exports.findMember = async (request, response) => {
    let keyword = request.body.keyword

    let members = await memberModel.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.substring]: keyword } },
                { gender: { [Op.substring]: keyword } },
                { address: { [Op.substring]: keyword } }
            ]
        }
    })

    return response.json({
        success: true,
        data: members,
        message: `All Members have been loaded`
    })
}

// Create function for add new member
exports.addMember = (request, response) => {
    // Prepare data from request
    let newMember = {
        name: request.body.name,
        address: request.body.address,
        gender: request.body.gender,
        contact: request.body.contact
    }

    // Execute inserting data to member's table
    memberModel.create(newMember)
        .then(result => {
            // if insert's process success
            return response.json({
                success: true,
                data: result,
                message: `New member has been inserted`
            })
        })
        .catch(error => {
            //if insert's process fail
            return response.json({
                success: false,
                message: error.message
            })
        })
}

// Create function for update member
exports.updateMember = (request, response) => {
    // Prepare data that has been changed
    let dataMember = {
        name: request.body.name,
        address: request.body.address,
        gender: request.body.gender,
        contact: request.body.contact
    }

    // define id member that will be update
    let idMember = request.params.idMember

    // execute upate data based on defined id member
    memberModel.update(dataMember, { where: { id:idMember } })
        .then(result => {
            // if update's process success
            return response.json({
                success: true,
                message: `Data member has been updated`
            })
        })
        .catch(error => {
            // if update's process fail
            return response.json({
                success: false,
                message: error.message
            })
        })
}

// Create function for delete data
exports.deleteMember = (request, response) => {
    // Define id member that will be update
    let idMember = request.params.id

    // Execute delete data based on define id member
    memberModel.destroy({ where: { id: idMember } })
        .then(result => {
            // if update's process success
            return response.json({
                success: true,
                message: `Data member has been updated`
            })
        })
        .catch(error => {
            // if update's process fail
            return response.json({
                success: false,
                message: error.message
            })
        })
}