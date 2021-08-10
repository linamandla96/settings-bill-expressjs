module.exports = function SettingsBill() {
const moment = require('moment');
    let smsCost;
    let callCost;
    let warningLevel;
    let criticalLevel;
    let actionList = [];
     let momentList = [];
    function setSettings(settings) {
        smsCost = Number(settings.smsCost);
        callCost = Number(settings.callCost);
        warningLevel = settings.warningLevel;
        criticalLevel = settings.criticalLevel;
    }

    function getSettings
        () {
        return {
            smsCost,
            callCost,
            warningLevel,
            criticalLevel
        }
    }

    function recordAction(action) {
        let cost = 0;

        if (grandTotal() < criticalLevel) {
            if (action === "call") {
                cost = callCost;
    
            } else if (action === "sms") {
                cost = smsCost;
    
            }
    
            if (cost != 0) {
                actionList.push({
                    type: action,
                    cost,
                    timestamp: new Date()
                    
                });
    
                momentList.push({
                    type: action,
                    cost,
                    timestamp : new Date()

                });
            }
    
            for (let i = 0; i < momentList.length; i++) {
                let timestamp = moment(actionList[i].timestamp).format('YYYY-MM-DD hh:mm:ss a');
                momentList[i].timestamp = (moment(timestamp, 'YYYY-MM-DD hh:mm:ss a').fromNow());
                
            }
        }
    }


    function actions() {
        return momentList;
    }

    function actionsFor(type) {
        const filteredActions = [];


        for (let index = 0; index < momentList.length; index++) {
            const action = momentList[index];

            if (action.type === type) {

                filteredActions.push(action);
            }
        }

        return filteredActions;


    }

    function getTotal(type) {
        let total = 0;

        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];

            if (action.type === type) {

                total += action.cost;
            }
        }
        return total;


    }

    function grandTotal() {
        return getTotal('sms') + getTotal('call');
    }

    function totals() {
        let smsTotal = getTotal('sms')
        let callTotal = getTotal('call')
        return {
            smsTotal,
            callTotal,
            grandTotal: grandTotal()
        }
    }

    function hasReachedWarningLevel() {
        const total = grandTotal();
        const reachedWarningLevel = total >= warningLevel
            && total < criticalLevel;

        return reachedWarningLevel;
    }
function addclassName(){
    
    if (hasReachedWarningLevel()) {
       return 'warning';
    }
    else if (hasReachedCriticalLevel()) {
       return 'danger';
    }
}



    function hasReachedCriticalLevel() {
        const total = grandTotal();
        return total >= criticalLevel;
    }

    return {
        setSettings,
        getSettings,
        recordAction,
        actions,
        actionsFor,
        totals,
        hasReachedWarningLevel,
        addclassName,
        hasReachedCriticalLevel
    }
}