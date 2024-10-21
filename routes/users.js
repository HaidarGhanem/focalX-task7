const express = require('express')
const Course = require('../models/Courses')
const router = express.Router()

router.get('/courses', async (req,res)=>{
    try {
        const courses = await Course.find()
        res.status(200).json({courses: courses})
    } catch (e) {
        res.status(500).json({error: e})
    }
})

router.get('/courses/:id', async (req,res)=>{
    try {
        const course = await Course.findById({_id: req.params.id})
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' })
        }
        res.status(200).json({ course })
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

router.get('/courses/videos/:id', async (req,res)=>{
    try {
        const course = await Course.findById({_id: req.params.id})
        res.status(200).json({course: course.videos})
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})


router.post('/courses/videos/comments/:courseId/:videoId', async (req, res) => {
    const { content , username } = req.body
    if (!content) {
        return res.status(400).json({ msg: 'Comment content is required' })
    }
    try {
        const course = await Course.findById(req.params.courseId)
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' })
        }
        const video = course.videos.id(req.params.videoId)
        if (!video) {
            return res.status(404).json({ msg: 'Video not found' })
        }
        if (!video.comments) {
            video.comments = []
        }
        video.comments.push({ content , videoId : req.params.courseId  ,username })
        await course.save()
        res.status(200).json({ msg: 'Comment added successfully', video })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

module.exports = router