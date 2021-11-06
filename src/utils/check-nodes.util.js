const config = require('../../config/api_config.json');
const tcpp = require("tcp-ping");

// check node status by name
checkNodeByName = (subdomain) => {
    //console.log(subdomain)
    return new Promise((resolve, reject) => {
        tcpp.probe(`${subdomain}.swizen.online`, 8080, (err, available) => {
            if (available) {
                resolve(available);
            } else {
                reject(err ? false : false);
            }
        });
    }).then((res) => {
        //console.log(res)
        return true;
    }, (err) => {
        //console.log(err)
        return false;
    })
}

module.exports = checkNodeByName;
