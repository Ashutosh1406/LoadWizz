
// #!/usr/bin/env node


import chalk from "chalk";
import inquirer from "inquirer";
import newServer from "../server.js";

console.log(chalk.whiteBright("LOAD BALANCER CLI"))

let serverCount = 0;
global.servers = new Map();

global.healthCheckTime = 12;
global.healthCheckApi = '/';

const totalServerCountFromUser = async() =>{
    const server = await inquirer.prompt(  //cli prompt i/o
        {
            name:'serverCount',
            type:'Input',
            message:'Enter Total Active Server Count for Monitoring',
            validate: (input) => /[0-9]+$/.test(input) || 'Please enter the input as numeric digits'
        }
    );
    serverCount = server.serverCount //from prompt 
}

const serverDetailsFromUser = async() => {
    for(let i=1;i<=serverCount;i++){
        const server = await inquirer.prompt(
            {
                name:'ServerURL',
                type:'input',
                message:`Enter running server URL ${i}`,
            }
        )
        server.set(i,server.ServerURL)
    }
}

const healthCheckEndPointFromUser = async() => {
    const server = await inquirer.prompt(
        {
            name:'Endpoint',
            type:input,
            message:"Enter the EndPoint for health check. (default is set to '/') "
        }
    )
    healthCheckApi = server.Endpoint
    //TODO:
}


const healthCheckTimeFromUser = async()=>{
    const server = await inquirer.prompt({
        name: "seconds",
        type: "number",
        message: `Enter Time for Routine Server Health Checkup (preConfigured Time is 12 seconds)`,
        validate: (input)=> /[0-9]+$/.test(input) || 'Please enter the input as numeric digits'
    });

    healthCheckTime = server.seconds;
}

const startServerConfirmation = async() => {
    const server = await inquirer.prompt(
        {
            name:'runLB',
            type:'confirm',
            message:'Start Load-Balancer-Server(4000 default)'
        }
    );
    if(server.runLB){
        console.log('Load Balancer made by Ashutosh(2024 grad Bachelors of Technology in IT)')
        newServer(); //runs here
    }else{
        console.log('Closing Application! Thank you For Using the load balancer ~ Made by Ashutosh(1414) ~')
    }
}
const startExecutable = async()=>{
    await totalServerCountFromUser();
    await serverDetailsFromUser();
    await healthCheckEndPointFromUser();
    await healthCheckTimeFromUser();
    await startServerConfirmation()

}

startExecutable();




