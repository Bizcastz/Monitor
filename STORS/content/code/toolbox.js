//HOW TO PARSE XML WITH JQUERY
// https://www.youtube.com/watch?v=w_gReWEq-5g

function loadXMLFile(xmlObject, xmlFile){
    var d = new Date();

    try {
        xmlObject.open("GET", xmlFile + "?timestamp=" + d.getTime(), false);
        xmlObject.send();
    }
    catch (err){
        //MKwindow.myData.LogMessage("loadXML : " + err;
        console.log("loadXML : " + err);

    }
}


//GET AN ELEMENT IN AN XML FILE FROM AN ATTRIBUTE
function GetElementsByAttribute(xmlFile, tag, attr, attrValue) {

    Array.prototype.where = function(matcher) {
        var result = [];
        for (var i = 0; i < this.length; i++) {
            if (matcher(this[i])) {
                result.push(this[i]);
            }
        }
        return result;
    };

    //Get elements and convert to array
    var elems = Array.prototype.slice.call(xmlFile.responseXML.getElementsByTagName(tag), 0);

    //Matches an element by its attribute and attribute value
    var matcher = function(el) {
        return el.getAttribute(attr) == attrValue;
    };

    return elems.where(matcher);
}

//GET VALUE OF A NODE FROM XML FILE
function getDataFromXML(XMLFile, XMLNode, childNode) {

    //NEEDS TO BE MODIFIED TO ACCOMODATE ALL TYPE OF NODES AND CHILDNODES
    try {
        returnValue = XMLFile.responseXML.getElementsByTagName(XMLNode)[childNode].childNodes[0].nodeValue;
        return returnValue;
    }
    catch (err){
        console.log("getDataFromXML: " + err);
        return "";
    }

}

function logAction(errMessage){

    if (localDebug) {
        document.getElementById("lbl_debugText").innerHTML = errMessage;
    }
    console.log(errMessage);

    try {
        window.myData.LogMessage(errMessage);
    }catch (err) {
        console.log(err);
    }
}

function replaceChar(str, index, replacement){
    return str.substr(0, index) + replacement+ str.substr(index + replacement.length);
}

insert = function insert(main_string, ins_string, pos) {
    if(typeof(pos) == "undefined") {
        pos = 0;
    }
    if(typeof(ins_string) == "undefined") {
        ins_string = '';
    }
    return main_string.slice(0, pos) + ins_string + main_string.slice(pos);
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

function contains(arr, element) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === element) {
            return true;
        }
    }
    return false;
}

function getDataFromContainer() {

    try {
        var pushCode = window.myData.getCode(); // it will return the code from last push notification
        var pushPayload = window.myData.getPayload(); // it will return the payload from last push notification

        //FULL JSON PAYLOAD DATA
        var jsonPayload = window.myData.pushMessage();

        //Take action depending on the pushCode
        switch (pushCode) {
            case "001": //Playing an asset

                //Turn off timer for infoTag
                clearInterval(timerMoveInfoTag);

                //Make pause icon hidden
                document.getElementById("div_pause_button").style.visibility = "hidden";

                //Indicate playing from onDemand request, not from loop
                fromOnDemand = true;

                //Hide HTML layer in case it was on. If needed by the asset it will get turned on in urlink() function
                document.getElementById("htmldiv").style.visibility = "hidden";
                document.getElementById("htmldiv").style.display = "none";

                myFile = "";
                movieAsset = GetElementsByAttribute(dataXML, "asset", "guid", pushPayload);
                if (movieAsset.length > 0) {
                    myTitle = movieAsset[0].getAttributeNode("title").nodeValue;
                    myFile = movieAsset[0].getAttributeNode("target").nodeValue;
                    displayNotification(myTitle);
                }


                if (myFile.includes("notag")) {
                    changeClass("noTag");
                } else {
                    //Change to mini tag
                    changeClass("miniTagRight");
                }
                break;
            case "002": //Toggle price tag on/off
                if (pushPayload === "ON") {
                    turnTagON("infoTag");
                } else {
                    turnTagOFF("infoTag");
                    //TURN IT BACK ON AFTER 30secs
                    setTimeout(turnTagON, 30000, "infoTag");
                }
                break;
            case "003":
                //location/model info
                logAction("OK", true);
                setTimeout(function () {
                    document.getElementById("lbl_debugText").innerHTML = "";
                }, 3000);
                break;
            case "004":
                //volume info: mute, unmute, +, -
                break;
            case "005":
                //Return to loop
                fromOnDemand = false;
                window.myData.RestartLoop();
                setInfoTag();
                //switchTag();
                break;
            case "006":
                //Display shape on screen to identify this device
                var myPayload = JSON.parse(jsonPayload);
                displayShape(myPayload.color, myPayload.shape, myPayload.colorshapenumber);
                break;
            case "007":
                //User scanned QR code
                displaySelectedMessage();
                break;
            case "008":
                //Activate only if onDemand
                if (fromOnDemand){
                    //Continue Play of asset
                    window.myData.assetControls("play");

                    //Make pause icon hidden
                    document.getElementById("div_pause_button").style.visibility = "hidden";

                    try {
                        //If video had been paused, just clear the timer
                        cleatTimeout(pauseTimer);
                    } catch (err) {
                        //document.getElementById("lbl_debugText").innerHTML = "ERROR - " + err;
                        logAction("clear pause timer=" + err, true);
                    }
                }
                break;
            case "009":
                //Activate only if onDemand
                if (fromOnDemand) {
                    //Pause asset
                    window.myData.assetControls("pause");

                    //Make pause iocn visible
                    document.getElementById("div_pause_button").style.visibility = "visible";

                    //Set a timer to restart video after x amount of time in case user leaves it paused
                    pauseTimer = setTimeout(restartVideo, pauseTimeout*1000);
                }
                break;
            case "011":
                //Turn off shape if it exists on the screen
                var myPayload = JSON.parse(jsonPayload);
                removeShape(myPayload.color, myPayload.shape, myPayload.colorshapenumber);
                break;
            case "500":
                // RESTART THE APK
                break;
            case "501":
                //DEBUG ON/OFF
                var myPayload = JSON.parse(jsonPayload);
                if (myPayload.debug == "ON") {
                    localDebug = true;
                    logAction("DEBUG IS ON", true)
                } else {
                    logAction("DEBUG IS OFF", true)
                    localDebug = false;
                }
                setTimeout(function () {
                    document.getElementById("lbl_debugText").innerHTML = "";
                }, 3000);
                break;
            case "502":
                // RESTART DEVICE
                break;
            case "503":
                //Show current value of localDebug
                logAction("Local Debug = " + localDebug.toString(), true);
                setTimeout(function () {
                    document.getElementById("lbl_debugText").innerHTML = "";
                }, 3000);
                break;
            case "504":
                // p2p, show notifications, block settings
                break;
            case "505":
                // send checkin to server
                break;
            default:
        }
    } catch (err) {
        //document.getElementById("lbl_debugText").innerHTML = "ERROR - " + err;
        logAction("GetDataFromContainer=" + err, false);
    }
}