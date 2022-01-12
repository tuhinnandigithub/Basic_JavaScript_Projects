const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
let battleLog = [];

const enteredValue = prompt('max life for you and monster','100');
let maxLife = parseInt(enteredValue);

if(isNaN(maxLife) || maxLife <= 0){
    maxLife = 100;
}

let currentMonsterHealth =  maxLife;
let currentPlayerHealth = maxLife;
let hasBonusLife = true;

adjustHealthBars(maxLife); 

function reset(){
    currentMonsterHealth =  maxLife;
    currentPlayerHealth = maxLife; 
    resetGame(maxLife);
}
function endRound(){
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;

    writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);
    if(currentPlayerHealth <= 0 && hasBonusLife){
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('You would have been dead but your bonus saved you');
    }
    if(currentMonsterHealth <= 0 && currentPlayerHealth > 0){
        alert('You Won!!');
        writeToLog(LOG_EVENT_GAME_OVER, 'PLAYER WON', currentMonsterHealth, currentPlayerHealth);
        reset(maxLife);
    }
    else if(currentPlayerHealth <= 0 && currentMonsterHealth > 0){
        alert('You Lost!!');
        writeToLog(LOG_EVENT_GAME_OVER, 'MONSTER WON', currentMonsterHealth, currentPlayerHealth);
        reset(maxLife);
    }
    else if(currentPlayerHealth <= 0 && currentMonsterHealth <= 0){
        alert('Draw!!!');
        writeToLog(LOG_EVENT_GAME_OVER, 'A DRAW', currentMonsterHealth, currentPlayerHealth);
        reset(maxLife);
    }
}
function attackMode(mode){
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
    // if(mode === MODE_ATTACK){
    //     maxDamage = ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_ATTACK;
    // }
    // else if(mode === MODE_STRONG_ATTACK){
    //     maxDamage = STRONG_ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    // }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
    endRound();
}
function writeToLog(ev, val, playerHealth, monsterHealth){
    let logEntry = {
            event : ev,
            value : val,
            finalPlayerHealth : playerHealth,
            finalMonsterHealth : monsterHealth
        };
    if(ev === LOG_EVENT_PLAYER_ATTACK){
        logEntry.target = 'MONSTER';  
    }
    else if(ev === LOG_EVENT_PLAYER_STRONG_ATTACK){
         logEntry = {
            event : ev,
            value : val,
            target : 'MONSTER',
            finalPlayerHealth : playerHealth,
            finalMonsterHealth : monsterHealth
        };
    }
    else if(ev === LOG_EVENT_MONSTER_ATTACK){
         logEntry = {
            event : ev,
            value : val,
            target : 'PLAYER',
            finalPlayerHealth : playerHealth,
            finalMonsterHealth : monsterHealth
        };
    }
    else if(ev === LOG_EVENT_PLAYER_HEAL){
         logEntry = {
            event : ev,
            value : val,
            target : 'PLAYER',
            finalPlayerHealth : playerHealth,
            finalMonsterHealth : monsterHealth
        };
    }
    else if(ev === LOG_EVENT_GAME_OVER){
         logEntry = {
            event : ev,
            value : val,
            finalPlayerHealth : playerHealth,
            finalMonsterHealth : monsterHealth
        };
    }
    battleLog.push(logEntry);
}
function attackHandler(){ 
    attackMode('ATTACK');
} 

function strongAttackHandler(){
    attackMode('STRONG_ATTACK');
}

function healButtonHandler(){
    let healValue;
    if(currentPlayerHealth >= maxLife - HEAL_VALUE){
        alert("You can't heal more than max life");
        healValue = maxLife - currentPlayerHealth;
    }
    else{
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);
    endRound();
}

function printLogHandler(){
    //console.log(battleLog);
    let i = 0;
    for(const logEntry of battleLog){
        console.log(`#${i}`);
        for(const key in logEntry){
            console.log(`${key} => ${logEntry[key]}`);
        }
        i++;
    }
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healButtonHandler);
logBtn.addEventListener('click', printLogHandler);