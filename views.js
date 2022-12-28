const getlanding = (req, res) => {
    console.log(res)
    // res.render('index')
}

const postQr = (req, res) => {
    console.log(req.body);
}


module.exports = {getlanding, postQr}