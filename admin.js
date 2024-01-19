const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/category');
const Category = mongoose.model('category');

router.get('/', (req, res) => {
    res.render('admin/index');
});

router.get('/posts', (req, res) => {
    res.send('Page of posts');
});

router.get('/category', (req, res) => {
    Category.find().lean().sort({date: 'desc'}).then((category) => {
        res.render('admin/category', {category: category})
    }).catch((err) => {
        req.flash('error', 'houve erro ao listar as categorias');
        req.redirect('/admin');
    })  
});

router.get('/category/add', (req, res) => {
    res.render('admin/addCategory');
})

router.post('/category/new', (req, res) => {
    
    let errors = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        errors.push({text: 'invalid name'})
    }
    
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        errors.push({text: 'invalid slug'});
    }

    if(req.body.nome.length < 2) {
        errors.push({text: 'nome da categoria é muito pequeno'})
    }

    if(errors.length > 0) {
        res.render('admin/addCategory', {erros: errors})
    }

    const newCategory = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Category(newCategory).save().then(() => {
        req.flash('success_msg', 'Category created with success');
        res.redirect('/admin/category');
    }).catch((err) => {
        req.flash('error_msg','Occoured something error');
        res.redirect('/admin');
    })
});

router.get('/category/edit', (req, res) => {
    Category.findOne({_id: req.params.id}).lean(
    ).then((category) => {
        req.flash('success_msg', 'Category edited with success');    
        res.render('admin/editCategoria', {category: category});
        })
        .catch((err) => {
            req.flash('error_msg', 'This category does not exist');
            res.redirect('/admin/category');
        });
});

module.exports = router;