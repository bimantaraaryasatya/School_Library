const express = require(`express`) // load express library
const md5 = require(`md5`) // load md5 library
const jwt = require(`jsonwebtoken`) // load library jsonwebtoken
const { request, response } = require("../routes/member.route")
const { where } = require("sequelize")
const adminModel = require(`../models/index`).admin // load model of admin

// create function to handle authenticating process
const authenticate = async (request, response) => {
    let dataLogin = {
        username: request.body.username,
        password: md5(request.body.password)
    }

    // check data username and password on admin's table
    let dataAdmin = await adminModel.findOne({where: dataLogin})

    // if data admin exists
    if (dataAdmin) {
        // set payload for generate token
        // payload is must be string 
        // dataAdmin is object, so we must convert to string
        let payload = JSON.stringify(dataAdmin)

        // define secret key as signature
        let secret = `mokleters`

        // generate token
        let token = jwt.sign(payload, secret)

        // define response
        return response.json({
            success: true,
            logged: true,
            message: `Authentication Successed`,
            token: token,
            data: dataAdmin
        })
    }

    // if data admin isn't exists
    return response.json({
        success: false,
        logged: false,
        message: `Authentication Failed. Invalid username or password`
    })
}

// create function authroize
const authroize = (request, response, next) => {
    let headers = request.headers.authorization

    let tokenKey = headers && headers.split(" ")[1]

    if (tokenKey == null) {
        return response.json({
            success: false,
            message: `Unauthorized User`
        })
    }

    let secret = `mokleters`

    jwt.verify(tokenKey, secret, (error, user) => {
        if (error) {
            return response.json({
                success: false,
                message: `Invalid Token`
            })
        }
    })
    next()
}

module.exports = { authenticate, authroize }


