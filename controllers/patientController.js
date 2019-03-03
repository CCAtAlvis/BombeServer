const index = (req, res) => {
  res.render('patient/index');
}

const start = (req, res) => {
  const code = req.body.refCode;
  res.redirect(`/patient/start/${code}`);
}

const viewStart = (req, res) => {
  // const code = req.params.id;
  res.render('patient/start', {req:req});
}

const chat = (req, res) => {
  const from = req.params.id;
  res.render('patient/chat', {from: from});
}

const live = (req, res) => {
  const from = req.params.id;
  res.render('patient/live', {from: from}); 
}


module.exports = {
  index,
  viewStart,
  start,
  chat,
  live
}
