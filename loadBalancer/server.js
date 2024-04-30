import express from 'express'
import axios from 'axios'
import cron from 'node-cron'
import Table from 'cli-table3'
import chalk from 'chalk'
import logger from './logs.js'

const app = express()
const makeTable = new Table({
    head:[  
            chalk.cyanBright("Time Log"),
            chalk.yellowBright("Total Servers"),
            chalk.green("Healthy Servers"),
            chalk.red("Dead Servers")
        ]
})

let healthyServers = [];
let currentState = -1;

const PORT = process.env.PORT

// if(!PORT){
//     PORT = 4000;
// }

const alternateServer = () => {
    if(healthyServers.length<=0){  //servers dead
        return null
    }
    currentState = (currentState+1) % healthyServers.length;
    return currentState
}
const requestToServer = async(req,res) => {
    try {
        const {response} = await axios({
            method:req.method,
            url: `${healthyServers[currentState]}${req.originalUrl}`,
        })
        if(!response){
            console.log('axios request failed')
        }
        return res.status(200).json({
            success:true,
            response
        })
    } catch (error) {
        console.log('error part of requestToServer function',error.message)
        res.status(500).json({
            success:false,
        })
    }
}
const requestHandler = async(req,res) =>{
    try {
        logger.info('Handling the service Request');
        logger.info(`Recieved Request From ${req.ip}\n 
                    Host: ${req.hostname}\n
                    user-agent: ${req.get("User-Agent")}`
                    )
        
        const currentServer = alternateServer();

        if(currentServer===null){
            console.warn("FATAL!!")
            return res.status(500).json({
                success:false,
                error:'All Runnig servers Are Dead Now',
                message:'Load Balancer Configuration error'
            })
        }

        return requestToServer(req,res);
    } catch (error) {
        console.log('error part of request handler function',error.message)
        res.status(500).json({
            success:false,
        })
    }
}

app.get("/favicon.ico",(req,res) => {
    res.status(202).end();
})

app.all('*',(req,res) => {
    requestHandler(req,res)
})

const checkHealth = async() => {
    try {
        console.log(chalk.rgb(`Health STATUS refreshes after${healthCheckTime} seconds`))

        for(let i=1;i<=servers.size();i++){
            const current = servers.get(i); //i+1 maybe

            try{
                //const response = axios.get(`${current}${healthCheckApi}`)

                const index = healthyServers.indexOf(current);
                if(index<0){
                    healthyServers.push(current)
                }
            }catch(error){
                const index = healthyServers.indexOf(current)
                index>-1 && healthyServers.splice(index,1)
                logger.error(`Health STATUS error of Server Number ${current} , message:${error.message}`)
            }
        }

        const healthyCount = healthyServers.length;
        const deadCount = servers.size - healthyServers.length
        
        makeTable.splice(0,makeTable.length)
        makeTable.push([
                            new Date().toTimeString(),
                            servers.size,
                            healthyCount,
                            deadCount
                        ]
    );
    } catch (error) {
        console.log('This is error Part of checkHealth fn' , error)
    }
}
const newServer = () =>{
    app.listen(PORT, () =>{
        for(const [key,val] of servers){
            healthyServers.push(val);
        }

        console.log(`Load Balancer Running on Port ${PORT}`)

        const healthCheckJob = cron.schedule(`*******/${healthCheckTime}*******`, () => {
            checkHealth();
        })
    })
}

export default newServer;