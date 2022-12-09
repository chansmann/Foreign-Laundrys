//Import modules
const express= require('express');
const mongoose= require('mongoose');
const { redirect } = require('express/lib/response');
const QRCode = require('qrcode');



const port=process.env.PORT || 3000; // this is our port number

const { v4: uuidv4 } = require('uuid');



//Import Data Model
const MachineModel = require("./models/machine");
const res = require('express/lib/response');
const { v4 } = require('uuid');
const req = require('express/lib/request');


const app = express(); // this is our app or instance of express

// API Middlewares


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(express.json()); // this is to accept data in json format

app.use(express.urlencoded({ extended: true })); // this is basically to decode the data send through html form

app.use('/public/images/', express.static('./public/images')); // this to serve our public folder as a static folder





//connection ot mongodb
mongoose.connect(
    "mongodb+srv://chansmann:Chris1234@chriscluster.24mechz.mongodb.net/?retryWrites=true&w=majority", {
})

    .then(res => {
        console.log("MongoDB connected")
    });



// API ROUTES

app.get('/',(req,res)=>{

    res.sendFile(__dirname + '/public/index.html');

});

/* app.get('/read:_id', async (req,res)=>{

    const _id = req.params._id;
    await MachineModel.findById(_id)
        .lean().exec(function (err, results){
            if(err) return console.error(err)
            try {
                response.send(results)
                res.render('instruction')
            } catch (error) {
                console.log("error getting results")
            }
        })

}); */

app.get('/code/:id',(req,res)=>{

    const _id = req.params.id;
    const endpoint = "http://172.17.71.166:3000/result/"+_id

    const generateQR = async text => {
        try {
            const QRimg = await QRCode.toDataURL (text);
            res.send(`<img src=${QRimg}></img>`) ;
        } catch(err) {
            console.log(err);
        }
    }

    generateQR(endpoint);

    res.sendFile(__dirname+'/public/qr-code.html');

});

app.get('/result/:_id', async (req,res)=>{

    const _id = req.params._id;
    console.log(_id)
    try{
        await MachineModel.findById(_id, (error, result) =>{
            console.log(result)
            res.render('instruction', {
                "manName" : result.manName,
                "modelName" : result.modelName,
                "wash30" : result.wash30,
                "wash40" : result.wash40,
                "wash60" : result.wash60,
                "notes" : result.notes,
                "file" : result.file,
            });
            
        });
    } catch(error){
        console.log(error);
    }

});

app.post('/write',async(req,res)=>{ //async => sets the function to asynchone mode, to execute just until await command

    const id= uuidv4();

    input = {
        _id: id,
        manName: req.body.manufacture,
        modelName: req.body.model,
        wash30: req.body.program30,
        wash40: req.body.program40,
        wash60: req.body.program60,
        notes: req.body.notes,
        file: req.body.upload,
    }

    console.log(req.body); // the data we get is in the body of the request
    const machine = new MachineModel(input);
/*     res.sendFile(__dirname+'/public/qr-code.html'); */

try{
    await machine.save();
    res.sendFile(__dirname+'/public/qr-code.html');
}
catch(err){
    console.log(err);
}
res.redirect('/code/'+id);
});

// This is basically to losten on port 

app.listen(port,()=>{
    console.log('Server started at http://localhost:'+port)

});




