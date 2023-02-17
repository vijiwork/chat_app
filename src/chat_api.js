const express = require("express");
const router = express.Router();
const chat_model = require("../model/chat");
const { v4: uuidv4 } = require("uuid");

router.get("/get_chat_msg", async (req, res) => {
  const resp = await chat_model.find({});
  try {
    res.send(resp);
  } catch (err) {
    console.log(err);
  }
});

router.post("/save_chat_msg", async (req, res) => {
  let data = req.body;
  data.chat_id = uuidv4();
  const resp = await chat_model(data);
  resp.save((err, result) => {
    try {
      res.send(result);
    } catch (err) {
      return console.log(err);
    }
  });
});

router.get('/get_chat_by_id/:id', async(req, res) =>{
 let resp = await chat_model.find({ roomname: req.params.id,is_read:false });
 res.send(resp);
});

router.put('/delete_chat_by_id/:id', async(req, res) =>{
  let resp =await chat_model.findByIdAndDelete({ _id : req.params.id });
  res.send(resp);
});
  


module.exports = router;
