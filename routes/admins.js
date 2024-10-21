require('dotenv').config()

const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Course = require('../models/Courses')
const Comment = require('../models/Comments')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const JWT_SECRET = process.env.JWTSECRET

const authorize = () => {
    return (req, res, next) => {
        if (!req.session || !req.session.token) {
            return res.status(401).json({ msg: 'Unauthorized: No session available.' })
        }
        jwt.verify(req.session.token, JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ msg: 'Token is not valid' })
            req.user = user._id
            
        next()
    })
}}

router.post('/register', async (req,res)=>{
    try {
        const { username , password } = req.body
        const hashedPassword = await bcrypt.hash( password , 10 )
        const newUser = new User({username , password: hashedPassword})
        await newUser.save()
        res.status(200).json({msg:`${username} created successfully`})
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

router.post('/login', async (req,res)=>{
    try {
        const { username , password } = req.body
        const user = await User.findOne({username})
        if(!user){
            res.status(500).json({error: `Couldn't find user: ${username}`})
        }
        else{
            const same = await bcrypt.compare(password, user.password)
            if(!same){
                res.status(401).json({error: `username or password wrong`})
            }
            else{
                const token = jwt.sign({id: user._id }, JWT_SECRET , {
                    expiresIn: '2h'
                })
                req.session.token = token
                res.status(200).json({msg:`${username} logged in successfully`})
            }
        }
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

router.get('/courses', authorize , async (req, res) => {
    try {
        const coachId = req.user.id
        const courses = await Course.find({coach: coachId})
        res.status(200).json({courses: courses})
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

router.post('/courses', authorize , async (req, res) => {
    try {
        const { title, description, time } = req.body
        const coach = req.user.id
        const newCourse = new Course({ title, description, time , coach })
        await newCourse.save()
        res.status(200).json({msg: `Course : ${title} created successfully`})
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

router.put('/courses/:id', authorize, async (req, res) => {
    try {
        const { title, description, time } = req.body
        const courseId = req.params.id

        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' })
        }

        if (course.coach.toString() !== req.user) {
            return res.status(403).json({ msg: 'Unauthorized: You do not own this course' })
        }

        course.title = title || course.title
        course.description = description || course.description
        course.time = time || course.time

        await course.save()
        res.status(200).json({ msg: `Course : ${course.title} updated successfully` })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

router.delete('/course/:id', authorize , async (req,res) =>{
    const courseId = req.params.id
    try{
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' })
        }

        if (course.coach.toString() !== req.user) {
            return res.status(403).json({ msg: 'Unauthorized: You do not own this course' })
        }

        await Course.findByIdAndDelete(courseId)
        res.status(200).json({ msg: 'Course deleted successfully' })
    }
        catch (e) {
            res.status(500).json({error: e.message})
        }
})

router.post('/courses/videos/:id', authorize , async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)

        if (course.coach.toString() !== req.user) {
            return res.status(403).json({ msg: 'Unauthorized: You do not own this course' })
        }
        else{
            const { title, description } = req.body
            course.videos.push({ title, description })
            await course.save()
            res.status(200).json({msg: `Video : ${title} added successfully`})
        }
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

router.post('/videos/comments/:id/', async (req, res) => {
    try {
        const { content } = req.body;
    const newComment = new Comment({ content, videoId: req.params.id, userId: req.user.id })
    await newComment.save()
        res.status(200).json({msg: `Video : ${title} added successfully`})
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

router.post('/logout', (req, res) => {
    if (req.session.token) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ msg: 'Logout failed' })
            }
            res.status(200).json({ msg: 'Logged out successfuly' })
        })
    } else {
        res.status(400).json({ msg: 'No session to log out' })
    }
})

module.exports = router