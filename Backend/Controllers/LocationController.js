const User = require('../Models/User');


const fetchUserLocation = async(req,res)=>{
    try {
        const {userId , latitude , longitude }= req.body;
        const user = await User.findOneAndUpdate({_id:userId} , {location:{
            latitude,
            longitude
        }} , {new:true});

        if(!user){
            return res.status(404).json({message:'user not found'});
        }
        console.log(user);
        return res.status(200).json({success:true , user});
        

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error.message});
        
    }

}

module.exports= {fetchUserLocation};