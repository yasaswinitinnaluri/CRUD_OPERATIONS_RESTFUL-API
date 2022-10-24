const express = require("express");
const app = express();
app.use(express.json());

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
var serviceAccount = require("./key.json");
initializeApp({
    credential: cert(serviceAccount)
});
const db = getFirestore();
let x = 0;
app.post('/add/course', async function(req, res) {
    const data = req.body;
    x += 1;
    const id = x.toString();
    const r = await db.collection('courses').doc(id).set(data);
    res.send("data added sucessfully");
});
app.get('/get/:id', async function(req, res) {
    const id = req.params.id.toString();
    const Ref = db.collection('courses').doc(id);
    const doc = await Ref.get();
    if (!doc.exists) {
        res.status(404).send("course with the given id not found !!");
    } else {
        res.send([doc.data()]);
    }
});
app.get('/courses', async function(req, res) {
    try {
        const ref = db.collection('courses');
        const responds = await ref.get();
        let arr = [];
        responds.forEach(element => {
            arr.push(element.data());
        });
        res.send(arr);
    } catch (error) {
        res.send(error);
    }
});
app.patch('/update', async function(req, res) {
    const Ref = db.collection('courses').doc(req.body.id);
    Ref.update({
        'price': req.body.price,
    });
    res.send("updated !!!");
});
app.delete('/delete', async function(req, res) {
    const Ref = db.collection('courses').doc(req.body.id);
    Ref.delete();
    res.send("delete !!!");
});
app.listen(3000);