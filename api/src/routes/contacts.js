const { Router } = require("express");
const server = require("express").Router();
const router = Router();
const { Op } = require("sequelize");
const { Users } = require("../models/index.js");

//Ruta para traer contactos de un usuario

server.get("/:idUser", (req,res) => {

    const idUser =  req.params.idUser
    
    //busco el usuario por id
    Users.findByPk(idUser)
        .then(user => {
            var contacts =  user.contacts
       
               
            if (contacts.length != 0)
            {
                var promesas = contacts.map((c) => Users.findByPk(c));
                Promise.all(promesas)
                    .then(function (contactos) {
                        res.status(200).json({contactos})
                    })
            }
            
            else{
                res.status(404).json({message: "No se tiene contactos aúnnnnnnnn"})
            }
            
        })

        .catch(err => res.status(400).json({err}));


})


server.post('/:idUser/addContact', (req,res)=> {

    const idUser =  req.params.idUser;
    const email = req.body.email;

    //busco usuario y usuario a agregar
    let usuario = Users.findByPk(idUser)
    let agregado = Users.findOne({where: {email: email}})
    

    Promise.all([usuario,agregado])
        .then(users=>{
            var contacts = users[0].contacts;
            //pusheo en el array de contactos el id del contacto a agregar
            contacts.push(users[1].id)

            //updateo el array con el nuevo array que creé
            Users.update({
                contacts: contacts
            },{
                returning: true, where: {id: users[0].id}
            })
            .then(userUpdated=>{
                res.status(200).send(userUpdated);
            })
        })
        .catch(err => { res.status(400).send(err); });
})



server.delete('/:idUser/deleteContact/:email', (req,res) => {
    const idUser =  req.params.idUser;
    const email = req.params.email;

    //busco usuario y usuario a borrar
    let usuario = Users.findByPk(idUser)
    let deleteado = Users.findOne({where: {email: email}})
    
    Promise.all([usuario,deleteado])
        .then(users=>{
            var contacts = users[0].contacts;
            //creo un nuevo array donde NO exista el id del usuario que quiero borrar
            const newContacts = contacts.filter(idUsers =>  idUsers != users[1].id)
            //modifico el array de contactos con el nuevo array que excluyó el id a eliminar
            Users.update({
                contacts: newContacts
            },{
                returning: true, where: {id: users[0].id}
            })
            .then(userUpdated=>{
                res.status(200).send(userUpdated);
            })
        })
        .catch(err => { res.status(400).send(err)});
})

module.exports = server;