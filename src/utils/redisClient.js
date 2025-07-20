import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();
let redis;
if(process.env.REDIS_URL){
    console.log("Using Redis URL from environment variables");
    redis=new Redis(process.env.REDIS_URL, {
  tls: {}  
});
}
else{
    redis=new Redis();
}

export default redis;