const axios = require('axios');
const fetchLocation = async(lat , long)=>{

    const location = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json` , {
        headers:{
            'User-Agent' : 'Raven/1.0 (manubhav731@gmail.com)'
        }})

        console.log(location.data);

        return location.data;
    }

    module.exports={fetchLocation}

    


