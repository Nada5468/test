const { User, validate } = require('./user.js');
const express = require('express');
const router = express.Router();
 
router.post('/', async (req, res) => {
    // First Validate The Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
 
    // Check if this user already exisits
    let user = await User.findOne({ name: req.body.name });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {
        // Insert the new user if they do not exist yet
        user = new User({
            name: req.body.name,
            password: req.body.password
        });
        await user.save();
        res.send(user);
    }
});
 
module.exports = router;
