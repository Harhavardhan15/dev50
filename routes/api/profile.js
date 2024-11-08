const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const request = require('request');
const config = require('config');
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator");

//route GET api/profile/me
//desc get current user profile
//access private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile); 
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//route POST api/profile
//desc Create or update user profile
//access private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    // destructure the request
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;
    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    //Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
   
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update profile
      
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
       
         return res.json(profile)
      }
     
      //create profile    
      profile = new Profile(profileFields);
       
   
      await profile.save();
      return res.json(profile);
    } 
    catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);

//route GET api/profile
//desc get all profiles
//access public
router.get('/',async (req,res)=>{
    try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//route GET api/profile/user/user:id
//desc get  profile by id
//access public
router.get('/user/:user_id',async (req,res)=>{
    
    try {
        const profile = await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        if(!profile) return res.status(400).json({msg:'Profile not found'});

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if(error.kind == "ObjectId"){
            return res.status(400).json({ msg :'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
}) ;



//route DELETE api/profile
//desc delete profile user and posts
//access Provate
router.delete('/',auth,async (req,res)=>{
  
    try {       
       //have to delete user posts
       await Post.deleteMany({user:req.user.id});

 //delete profile
 await Profile.findOneAndDelete({user:req.user.id});
 //delete user
 await User.findOneAndRemove({ _id: req.user.id })
        res.json({msg:"Delete Successful"});
    } catch (error) {
        console.error(error.message);
        if(error.kind == "ObjectId"){
            return res.status(400).json({ msg :'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
}) ;


//route PUT api/profile/experience
//desc Add profile experience
//access Provate
router.put('/experience', [auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From Date is required').not().isEmpty()
]], async(req,res)=>{
  
  const errors=  validationResult(req);
  if (!errors.isEmpty()){
return res.status(400).json({errors:errors.array()});
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }=  req.body;

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } 

  try{
const profile = await Profile.findOne({user:req.user.id});

profile.experience.unshift(newExp);
await profile.save();
res.json(profile);
  } catch(err){
    console.error(err.message);
res.status(500).send('Server Error');
  }

})



//route DELETE api/profile/experience/exp_id
//desc delete  experience for logged in user from profile
//access Private
router.delete('/experience/:exp_id', auth, async(req,res) =>{
try{
  
  const profile = await Profile.findOne({user:req.user.id});

  //get remove index
  const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

  profile.experience.splice(removeIndex,1);
  await profile.save();
  res.json(profile);

}catch(err){
  console.error(err.message);
res.status(500).send('Server Error');
}
})



//Add Delete Profile Education

//route PUT api/profile/education
//desc Add profile education
//access Provate
router.put('/education', [auth, [
  check('school', 'Title is required').not().isEmpty(),
  check('degree', 'Company is required').not().isEmpty(),
  check('from', 'From Date is required').not().isEmpty(),
  check('fieldofstudy', 'Field of study is required').not().isEmpty()
]], async(req,res)=>{
  
  const errors=  validationResult(req);
  if (!errors.isEmpty()){
return res.status(400).json({errors:errors.array()});
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }=  req.body;

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } 

  try{
const profile = await Profile.findOne({user:req.user.id});

profile.education.unshift(newEdu);
await profile.save();
res.json(profile);
  } catch(err){
    console.error(err.message);
res.status(500).send('Server Error');
  }

})



//route DELETE api/profile/education/:edu_id
//desc delete  education for logged in user from profile
//access Private
router.delete('/education/:edu_id', auth, async(req,res) =>{
try{
  const profile = await Profile.findOne({user:req.user.id});

  //get remove index
  const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

  profile.education.splice(removeIndex,1);
  await profile.save();
  res.json(profile);

}catch(err){
  console.error(err.message);
res.status(500).send('Server Error');
}
})



//route GET api/profile/github/:username
//desc get github repos
//access Public
router.get('/github/:username',async(req,res) =>{
try{
  const options= {
    uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
    method:'GET',
    headers:{'user-agent':'node.js'}
  };
  request(options,(error,response,body)=>{
    if(error){
      console.error(error);
          }
          if(response.statusCode!==200){
           return res.status(404).json({msg:'No Github profile found'})
          } 
          res.json(JSON.parse(body));
  })
}catch(err){
  console.error(err.message); 
  res.status(500).send('Server Error');
}
})
module.exports = router; 
