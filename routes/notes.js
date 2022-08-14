var express = require('express');
var router = express.Router();
const Note = require('../models/notes')
const withAuth = require('../middlewares/auth');
const { findById } = require('../models/users');
const { findOneAndUpdate } = require('../models/notes');


//Add new Note on database
router.post('/', withAuth, async function (req,res){
    const{title, body} = req.body
    try {
        let note = new Note ({title:title, body:body, author: req.user._id});
        await note.save()
        res.status(200).json(note)
    } catch (error) {
        res.status(500).json({error: 'Problem to create a new note. Please try again!'})
    }
})

//search a note in the database, either in title or in the body
router.get('/search',withAuth, async(req, res)=>{

    const {query} = req.query;
    try {
        let notes = await Note
          .find({author: req.user._id })
          .find({$text: {$search: query}})//text é para buscar em texto
        res.json(notes)
    } catch (error) {
        res.json({error:error}).status(500)
    }
});

// show a choosen note
router.get('/:id', withAuth, async(req,res)=>{
    try {
        const {id} = req.params
        let note = await Note.findById(id);
        if(isOwner(req.user, note))
            res.json(note)
        else{
            res.status(403).json({error:"Forbiden. Access denied"})
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to get a Note'})
        
    }
})


///Verify if the note belongs to the user
const isOwner = (user,note) => {

    if(JSON.stringify(user._id) == JSON.stringify(note.author._id)){
    return true}
    else{
        return false
    }
}

//Get all the notes by author
router.get('/',withAuth, async (req,res)=>{
    try {
        
        let notes = await Note.find({author: req.user._id})
        res.json(notes)
    } catch (error) {
        console.log(error)
        
    }
})

//Edit Notes
router.put('/:id',withAuth, async (req,res) =>{
    const {title,body} = req.body;
    const {id} = req.params;
    try {
        let note = await Note.findById(id)
        if (isOwner(req.user, note)){
            let note = await Note.findByIdAndUpdate(id,
                {$set: {title: title, body:body} },
                {upsert: true, 'new':true});//Change the old note for the new one
                
                res.json(note)
                
        }else{
            res.status(403).json("Permission denied")
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Problem to update a note'})
        
    }
})

//delete a specified note
router.delete('/:id', withAuth, async (req,res)=>{
    const {id} = req.params;
    try {
        let note = await Note.findById(id)
        if(isOwner, note){
            note.delete()
            res.status(204).json({message:"Ok"})
        }else{
            res.status(403).json("Permission denied")
        }
    } catch (error) {
        res.status(500).json({error: "Error on delete the note"})
    }
});
module.exports = router