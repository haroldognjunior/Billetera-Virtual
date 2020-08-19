import React from "react"
import Form from './exportCrearUsuario'

const handleSubmit = values => console.log("")
const initialValues = {}
const exportCrearUsuario = () => (
    <div className="exportform">
        <Form handleSubmit={() => handleSubmit()} initialValues={initialValues}/>
    </div>
)

export default exportCrearUsuario
