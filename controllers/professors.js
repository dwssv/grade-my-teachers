const Professor = require('../models/professor')
const departments = require('../seeds/departments')
const users = require('../controllers/users')
module.exports.index = async (req, res) => {
    const professor = await Professor.find({})
    res.render('professors/index', { professor })
}

module.exports.renderNewForm = (req, res) => {
    res.render('professors/new', { departments })
}

module.exports.createProfessor = async (req, res) => {
    const professor = new Professor(req.body.professor)
    professor.author = req.user._id
    await professor.save()
    req.flash('success', 'Sucessfully added a new professor!')
    res.redirect(`/professors/${professor._id}`)
}

module.exports.showProfessor = async (req, res) => {
    const professor = await Professor.findById(req.params.id).populate('comments')
    if (!professor) {
        req.flash('error', 'Cannot find that professor')
        return res.redirect('/professors')
    }
    res.render('professors/show', { professor })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const professor = await Professor.findById(id)
    if (!professor) {
        req.flash('error', 'Cannot find that professor')
        return res.redirect('/professors')
    }
    res.render('professors/edit', { professor, departments })
}

module.exports.editProfessor = async (req, res) => {
    const { id } = req.params
    const professor = await Professor.findByIdAndUpdate(id, req.body.professor)
    req.flash('success', 'Sucessfully edited a professor!')
    res.redirect(`/professors/${professor._id}`)
}

module.exports.deleteProfessor = async (req, res) => {
    const { id } = req.params
    await Professor.findByIdAndDelete(id)
    req.flash('success', 'Sucessfully deleted a professor!')
    res.redirect('/professors')
}