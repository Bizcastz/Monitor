//UPDATE WHEN CHANGED
const shell_version = 'MONSHELL-5.0.2';

localDebug = false;

var noAdherent = false;
var offerNone = false;
var last_layer = '';
var last_background = '';
var timerMoveInfoTag;
var timerCheckDownloading;
var timerMiniTag;
var scr_width = '7680px';
var scr_height = '4320px';
//getLocation();

var xmlPath = '../../';
var dataXMLPath = '../../';
var deviceXML = new XMLHttpRequest();
var modelXML = new XMLHttpRequest();
var priceXML = new XMLHttpRequest();
var dataXML = new XMLHttpRequest();
var systemXML = new XMLHttpRequest();

var modelXML1 = new XMLHttpRequest();
var modelXML2 = new XMLHttpRequest();
var modelXML3 = new XMLHttpRequest();
var modelXML4 = new XMLHttpRequest();
var modelXML5 = new XMLHttpRequest();
var modelXML6 = new XMLHttpRequest();

var priceXML1 = new XMLHttpRequest();
var priceXML2 = new XMLHttpRequest();
var priceXML3 = new XMLHttpRequest();
var priceXML4 = new XMLHttpRequest();
var priceXML5 = new XMLHttpRequest();
var priceXML6 = new XMLHttpRequest();

var isHTML = false;

var rightTag = true;
var currentClass = 'tvTagRight';
var fromOnDemand = false;

var sku_count = 1;
var my_sku = '';
var thisSKU = '';

var chassis_sku_1 = '';
var chassis_sku_2 = '';
var chassis_sku_3 = '';
var chassis_sku_4 = '';
var chassis_sku_5 = '';
var chassis_sku_6 = '';

var price_sku_1 = '';
var price_sku_2 = '';
var price_sku_3 = '';
var price_sku_4 = '';
var price_sku_5 = '';
var price_sku_6 = '';

var chassisCount = 0;

//Duration message on screen in secs
var QRMessageDuration = 10;

//How long to display the QR instructions video in secs
var selectedMessageDuration = 5;

//How long to cover the video area to hide the android play icon in miliseconds
var coverDelay = 5000;

//How long to allow pause for in secs
var pauseTimeout = 120;
var pauseTimer;

//By how many hours do we compare current price.xml date after which we reboot device
var priceXMLMaxOffset = 4;

/*
var nextSection = 0;
var sectionDuration = [5000, 5000, 10000, 5000];
var sectionTimer;
*/

//MINUTES IN THE HOUR THE TAG SHOWS ON RIGHT VS LEFT
var arrMinutesRight = [
  0, 1, 4, 5, 8, 9, 12, 13, 16, 17, 20, 21, 24, 25, 28, 29, 32, 33, 36, 37, 40,
  41, 44, 45, 48, 49, 52, 53, 56, 57,
];
var arrMinutesLeft = [
  2, 3, 6, 7, 10, 11, 14, 15, 18, 19, 22, 23, 26, 27, 30, 31, 34, 36, 38, 39,
  42, 43, 46, 47, 50, 51, 54, 55, 58, 59,
];
var arrMinutesQRmessage = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
  60,
];

var arrMinutesRepaintData = [0, 30];

// var arrMinutesRepaintData = [
//   0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
//   22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
//   41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
//   60,
// ];

//Hours during the day when to check if price.xml current
var arrHoursCheckPriceXMLDate = [0, 4, 8, 12, 14, 15, 16, 20];

//How long to display screen indicator for (in secs)
var maxShapes = 20;
var shapePositions = [];
var noShapes = true;

const NUMBEROFRATINGBARS = 12;

const cutOff_time = 8;

$(document).ready(function () {
  document.getElementById('container').style.display = 'none';

  //Initialize shapes array with all empty
  for (i = 0; i < maxShapes - 1; i++) {
    shapePositions[i] = false;
  }

  //FROM TA FOR PLAYING CORRECT TV FORMAT OF VIDOE
  try {
    window.myData.setTVModel();
  } catch (err) {
    logAction('Error calling window.myData.setTVModel() =' + err, false);
  }

  try {
    var assetType = window.myData.GetNewAssetType();
    console.log('asset type=' + assetType);
    logAction('Aset type=' + assetType), false;
    if (
      assetType.includes('image') ||
      assetType.includes('html') ||
      assetType.includes('feed') ||
      assetType.includes('social')
    ) {
      logAction('Call UrlLink', false);
      console.log('Call UrlLink');
      window.myData.HideMovie();
      urlink();
    }
  } catch (e) {
    logAction('Error Call UrlLink = ' + e, false);
  }

  setScaleFactor();

  /**
   * Get the user IP throught the webkitRTCPeerConnection
   * @param onNewIP {Function} listener function to expose the IP locally
   * @return undefined
   */
  function getUserIP(onNewIP) {
    //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection =
      window.RTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
        iceServers: [],
      }),
      noop = function () {},
      localIPs = {},
      ipRegex =
        /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
      key;

    function iterateIP(ip) {
      if (!localIPs[ip]) onNewIP(ip);
      localIPs[ip] = true;
    }

    //create a bogus data channel
    pc.createDataChannel('');

    // create offer and set local description
    pc.createOffer(function (sdp) {
      sdp.sdp.split('\n').forEach(function (line) {
        if (line.indexOf('candidate') < 0) return;
        line.match(ipRegex).forEach(iterateIP);
      });

      pc.setLocalDescription(sdp, noop, noop);
    }, noop);

    //listen for candidate events
    pc.onicecandidate = function (ice) {
      if (
        !ice ||
        !ice.candidate ||
        !ice.candidate.candidate ||
        !ice.candidate.candidate.match(ipRegex)
      )
        return;
      ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
  }

  // Usage

  getUserIP(function (ip) {
    myIP = ip;
    document.getElementById('lbl_version').innerHTML =
      document.getElementById('lbl_version').innerHTML + ' - ' + myIP;
    //document.getElementById("ip").innerHTML = 'Got your IP ! : '  + ip + " | verify in http://www.whatismypublicip.com/";
  });

  //TURN ON MAIN CONTAINER
  document.getElementById('container').style.display = 'inline';
  //document.getElementById("lbl_version").innerHTML = myVersion + " - " +  $(window).width() + " x " + $(window).height();

  //document.getElementById("m_connected").addEventListener("touchstart", showMenu, false);

  $('#m_connected').click(function () {
    showMenu();
  });

  $('#img_logo').click(function () {
    showMenu();
  });

  /*Check HTML document is ready or not   on 15 Feb 2018 by TAG*/
  try {
    logAction('Document ready', false);
    window.myData.startAssetPlay();
  } catch (err) {
    logAction('error HTML document load or not=' + err, false);
  }

  /*
    document.getElementById("div_adherent").style.display = "none";
    document.getElementById("div_credit").style.display = "none";
    document.getElementById("div_Garantie_Liverson_Pos").style.display = "inline";
*/
  refreshData();

  /*
    //Display chassis prices if more than one system in the group
    if (chassisCount > 1) {
        document.getElementById("div_prices").style.display = "inline";
        document.getElementById("div_specs").style.display = "inline";
        //document.getElementById("div_offres").style.display = "inline";
    }else {
        document.getElementById("div_prices").style.display = "none";
        document.getElementById("div_specs").style.display = "inline";
        //document.getElementById("div_offres").style.display = "inline";
    }
*/
  /*
    //Display offer, etc depending on chassis
    if (chassisCount === 1){
        document.getElementById("div_Garantie_Liverson").style.display = "inline";
        document.getElementById("div_credit").className = "creditPos1";
        document.getElementById("div_credit").style.display = "inline";
        document.getElementById("div_adherent").className = "adherentPos1";

        if (offerNone){
            document.getElementById("div_adherent").style.display = "none";
        }else {
            document.getElementById("div_adherent").style.display = "inline";
        }
    } else if (chassisCount === 2){
        if (noAdherent) {
            document.getElementById("div_adherent").style.display = "none";
            document.getElementById("div_Garantie_Liverson").style.display = "inline";
        }else{
            if (offerNone){
                document.getElementById("div_adherent").style.display = "none";
            }else {
                document.getElementById("div_adherent").style.display = "inline";
            }
            document.getElementById("div_Garantie_Liverson").style.display = "none";
        }
        document.getElementById("div_credit").className = "creditPos2";
        document.getElementById("div_credit").style.display = "inline";
        document.getElementById("div_adherent").className = "adherentPos2";
    }else if (chassisCount === 3){
        document.getElementById("div_Garantie_Liverson").style.display = "none";
        document.getElementById("div_credit").className = "creditPos3";
        document.getElementById("div_credit").style.display = "inline";
        document.getElementById("div_adherent").className = "adherentPos2";
        document.getElementById("div_adherent").style.display = "none";
    }

     */

  //Timer to sync movement of price tag
  timerMoveInfoTag = setInterval(mainTimer, 1000);
});

//Open the settings screen
function showMenu() {
  try {
    window.myData.OpenSetup();
  } catch (err) {}
}

function setScaleFactor() {
  try {
    var iWidth = 0;
    var iHeight = 0;
    var sysWidth = 0;
    var sysHeight = 0;

    try {
      iWidth = $(window).width();
      iHeight = $(window).height();
    } catch (err) {
      iWidth = 0;
      iHeight = 0;

      //window.myData.LogMessage("set scale factor: " + err);
      logAction('set scale factor: ' + err, false);
    }

    var scale_x = 1;
    var scale_y = 1;

    scale_x = iWidth / 7680.0;
    scale_y = iHeight / 4320.0;

    document.getElementById('container').style.transform =
      'scale(' + scale_x + ')';
  } catch (err) {
    logAction('setScaleFactor: ' + err, false);
  }
}

function setConnectedIcon() {
  var d = new Date();
  try {
    var isOn = window.myData.IsConnected();
    if (isOn) {
      $('#m_connected').attr(
        'src',
        'images/cloud-online.svg?timestamp=' + d.getTime()
      );
      turnQR('visible');
    } else {
      $('#m_connected').attr(
        'src',
        'images/cloud-offline.svg?timestamp=' + d.getTime()
      );
      turnQR('hidden');
    }
  } catch (err) {}
}

function turnQR(theMode) {
  document.getElementById('div_qr_display').style.visibility = theMode;
}

function getDataFromContainer() {
  try {
    var pushCode = window.myData.getCode(); // it will return the code from last push notification
    var pushPayload = window.myData.getPayload(); // it will return the payload from last push notification

    //FULL JSON PAYLOAD DATA
    var jsonPayload = window.myData.pushMessage();

    //Take action depending on the pushCode
    switch (pushCode) {
      case '001': //Playing an asset
        //Turn off timer for infoTag
        clearInterval(timerMoveInfoTag);

        //Make pause icon hidden
        document.getElementById('div_pause_button').style.visibility = 'hidden';

        //Indicate playing from onDemand request, not from loop
        fromOnDemand = true;

        //Hide HTML layer in case it was on. If needed by the asset it will get turned on in urlink() function
        document.getElementById('htmldiv').style.visibility = 'hidden';
        document.getElementById('htmldiv').style.display = 'none';

        myFile = '';
        movieAsset = GetElementsByAttribute(
          dataXML,
          'asset',
          'guid',
          pushPayload
        );
        if (movieAsset.length > 0) {
          myTitle = movieAsset[0].getAttributeNode('title').nodeValue;
          myFile = movieAsset[0].getAttributeNode('target').nodeValue;
          displayNotification(myTitle);
        }

        if (myFile.includes('notag')) {
          changeClass('noTag');
        } else {
          //Change to mini tag
          changeClass('miniTagRight');
        }
        break;
      case '002': //Toggle price tag on/off
        if (pushPayload === 'ON') {
          turnTagON('infoTag');
        } else {
          turnTagOFF('infoTag');
          //TURN IT BACK ON AFTER 30secs
          setTimeout(turnTagON, 30000, 'infoTag');
        }
        break;
      case '003':
        //location/model info
        logAction('OK', true);
        setTimeout(function () {
          document.getElementById('lbl_debugText').innerHTML = '';
        }, 3000);
        break;
      case '004':
        //volume info: mute, unmute, +, -
        break;
      case '005':
        //Return to loop
        fromOnDemand = false;
        window.myData.RestartLoop();
        setInfoTag();
        //switchTag();
        break;
      case '006':
        //Display shape on screen to identify this device
        var myPayload = JSON.parse(jsonPayload);
        displayShape(
          myPayload.color,
          myPayload.shape,
          myPayload.colorshapenumber
        );
        break;
      case '007':
        //User scanned QR code
        displaySelectedMessage();
        break;
      case '008':
        //Activate only if onDemand
        if (fromOnDemand) {
          //Continue Play of asset
          window.myData.assetControls('play');

          //Make pause icon hidden
          document.getElementById('div_pause_button').style.visibility =
            'hidden';

          try {
            //If video had been paused, just clear the timer
            cleatTimeout(pauseTimer);
          } catch (err) {
            //document.getElementById("lbl_debugText").innerHTML = "ERROR - " + err;
            logAction('clear pause timer=' + err, true);
          }
        }
        break;
      case '009':
        //Activate only if onDemand
        if (fromOnDemand) {
          //Pause asset
          window.myData.assetControls('pause');

          //Make pause iocn visible
          document.getElementById('div_pause_button').style.visibility =
            'visible';

          //Set a timer to restart video after x amount of time in case user leaves it paused
          pauseTimer = setTimeout(restartVideo, pauseTimeout * 1000);
        }
        break;
      case '011':
        //Turn off shape if it exists on the screen
        var myPayload = JSON.parse(jsonPayload);
        removeShape(
          myPayload.color,
          myPayload.shape,
          myPayload.colorshapenumber
        );
        break;
      case '500':
        // RESTART THE APK
        break;
      case '501':
        //DEBUG ON/OFF
        var myPayload = JSON.parse(jsonPayload);
        if (myPayload.debug == 'ON') {
          localDebug = true;
          logAction('DEBUG IS ON', true);
        } else {
          logAction('DEBUG IS OFF', true);
          localDebug = false;
        }
        setTimeout(function () {
          document.getElementById('lbl_debugText').innerHTML = '';
        }, 3000);
        break;
      case '502':
        // RESTART DEVICE
        break;
      case '503':
        //Show current value of localDebug
        logAction('Local Debug = ' + localDebug.toString(), true);
        setTimeout(function () {
          document.getElementById('lbl_debugText').innerHTML = '';
        }, 3000);
        break;
      case '504':
        // p2p, show notifications, block settings
        break;
      case '505':
        // send checkin to server
        break;
      default:
    }
  } catch (err) {
    logAction('GetDataFromContainer=' + err, false);
  }
}

function restartVideo() {
  window.myData.assetControls('play');
  document.getElementById('div_pause_button').style.visibility = 'hidden';
}

function displaySelectedMessage() {
  document.getElementById('video_message').src = 'selectedmessage.png';
  document.getElementById('div_selected_message').style.visibility = 'visible';
  setTimeout(turnOffMessage, selectedMessageDuration * 1000);
}

function turnCoverOFF() {
  // document.getElementById("div_cover").style.visibility = "hidden";
  document.getElementById('div_selected_message').style.visibility = 'visible';
  //document.getElementById("video_message").style.visibility = "visible";
}

function turnOffMessage() {
  document.getElementById('div_selected_message').style.visibility = 'hidden';
}

function removeShape(theColor, theShape, theNumber) {
  //1. Findout if there is a div_shape with the class congtaining color and shape
  //2. If there is such a class, get the position and call shapeOff to remove it
  shapeLocation = findShape(theColor, theShape, theNumber);
  if (shapeLocation > -1) {
    shapeOff(shapeLocation);
  }
}

function findShape(theColor, theShape, theNumber) {
  shapeLocation = -1;
  //Check if color shape is being used and return position
  for (i = 0; i < maxShapes - 1; i++) {
    if (shapePositions[i] == true) {
      if (
        document
          .getElementById('div_shape_' + i)
          .className.includes(theShape) &&
        document.getElementById('div_shape_' + i).className.includes(theColor)
      ) {
        shapeLocation = i;
        break;
      }
    }
  }
  return shapeLocation;
}

function displayShape(theColor, theShape, theNumber) {
  //NEW METHOD WITH MULTIPLE SHAPES
  //1. find an available div# from the array
  //2. set the values for the div
  //3. if first shape in the array then turn mask div on
  //4. turn the timer on before calling the shapeyOff function
  freePosition = getFreePosition();
  document.getElementById('div_shape_' + freePosition).className =
    'shape_' + theShape + '_' + theColor;
  if (noShapes) {
    noShapes = false;
    document.getElementById('div_shape_mask').className = 'shapeMask';
  }

  timerForScreenIndicator = getDataFromXML(
    modelXML,
    'shape_duration_onscreen_inseconds',
    0
  );
  setTimeout(shapeOff, timerForScreenIndicator * 1000, freePosition);
}

function getFreePosition() {
  //get a free position in the array and return the index
  for (i = 0; i < maxShapes - 1; i++) {
    if (shapePositions[i] == false) {
      shapePositions[i] = true;
      return i;
    }
  }
}

function shapeOff(turnOffPosition) {
  //NEW METHOD FOR MULTIPLE SHAPES
  //1. turn off the correc div#
  //2. free that position in the array
  //3. if no more shapes in the array then turn off mask div
  document.getElementById('div_shape_' + turnOffPosition).className =
    'hideShape';
  clearPosition(turnOffPosition);
}

function clearPosition(thePosition) {
  //clear the position in the array
  //if no used positions in array then clear div mask
  shapePositions[thePosition] = false;

  for (i = 0; i < maxShapes - 1; i++) {
    if (shapePositions[i] == true) {
      return;
    }
  }
  document.getElementById('div_shape_mask').className = 'hideShape';
  noShapes = true;
}

function displayNotification(theText) {
  document.getElementById('lbl_notification').innerHTML = theText;
  document.getElementById('div_notification').style.display = 'inline';
  document.getElementById('div_notification').style.visibility = 'visible';

  notifTimer = setTimeout(turnNotificationMessageOff, 4000);
}

function turnNotificationMessageOff() {
  document.getElementById('div_notification').style.display = 'none';
  document.getElementById('div_notification').style.visibility = 'hidden';
  document.getElementById('lbl_notification').innerHTML = '';
  clearTimeout(notifTimer);
}

function turnTagON(theElement) {
  document.getElementById(theElement).style.visibility = 'visible';
  document.getElementById(theElement).style.display = 'block';
}

function turnTagOFF(theElement) {
  document.getElementById(theElement).style.visibility = 'hidden';
  document.getElementById(theElement).style.display = 'none';
}

function mainTimer() {
  checkDownloading();

  d = new Date();

  mySecs = d.getSeconds();
  myMins = d.getMinutes();
  myHrs = d.getHours();

  //Move tag side to side based on minutes, only if we are not playing a video on demand.
  if (!fromOnDemand) {
    moveTagByMinutes(myMins, mySecs, false);
  }

  //Refresh Data on screen
  if (
    contains(arrMinutesRepaintData, myMins) &&
    //(mySecs == 0 || mySecs == 30)
    mySecs == 0
  ) {
    refreshData();
  }

  //Check if price.xml is old
  if (contains(arrHoursCheckPriceXMLDate, myHrs) && myMins == 0) {
    //alert('CHECKING at ' + myHrs);
    if (checkHoursOfPriceXML() >= priceXMLMaxOffset || myHrs == 12) {
      rebootDevice();
    }
  }
}

function checkHoursOfPriceXML() {
  //Check date of current price.xml and reboot if more than X hours have passed
  var priceXMLDate = Date.parse(getDataFromXML(priceXML, 'price_filedate', 0));
  var NowDate = Date.now();

  // var hours = diff_hours(priceXMLDate, NowDate);
  // alert (hours);

  // Convert the diff to hours
  var theDiff = (NowDate - priceXMLDate) / 3600000;

  return theDiff;
}

function rebootDevice() {
  //if difference between priceXMLDate and current date is X+ hours then reboot
  if (theDiff >= priceXMLMaxOffset) {
    //Need to reboot device
    //systemControl(“RESTART”)
    try {
      //alert('rebooting');
      window.myData.systemControl('REBOOT');
    } catch (err) {}
  }
}

function moveTagByMinutes(theMins, theSecs, checkSecs) {
  try {
    //Move tag side to side based on minutes
    //The arrays contain the minutes in the hour the tag should flip to that side
    if (
      (contains(arrMinutesRight, theMins) && theSecs == 0 && checkSecs) ||
      (contains(arrMinutesRight, theMins) && !checkSecs)
    ) {
      //Switch tag right
      rightTag = false;
      switchTag();
    } else if (
      (contains(arrMinutesLeft, theMins) && theSecs == 0 && checkSecs) ||
      (contains(arrMinutesLeft, theMins) && !checkSecs)
    ) {
      //Switch tag left
      rightTag = true;
      switchTag();
    }
    /*
        if ((contains(arrMinutesQRmessage, theMins) && theSecs == 0)) {
            document.getElementById("div_qr_message").style.visibility = "visible";
            setTimeout(turnQRMessageOFF, QRMessageDuration * 1000);
        }
        */
  } catch (err) {
    logAction('moveTagByMinutes=' + err, false);
  }
}

function switchTag() {
  if (rightTag) {
    rightTag = false;
    changeClass('tvTagLeft');
  } else {
    rightTag = true;
    changeClass('tvTagRight');
  }
  switchQRMessage();
}

function switchQRMessage() {
  if (rightTag) {
    document.getElementById('div_qr_message').className =
      'qr_message_position_R';
  } else {
    document.getElementById('div_qr_message').className =
      'qr_message_position_L';
  }
}

function turnQRMessageOFF() {
  document.getElementById('div_qr_message').style.visibility = 'hidden';
}

function changeClass(theClass) {
  currentClass = theClass;
  document.getElementById('infoTag').className = currentClass;

  document.getElementById('energyTag').className = 'NOT' + currentClass;

  if (theClass == 'miniTagRight' || theClass == 'noTag') {
    document.getElementById('energyTag').style.display = 'none';
  } else {
    document.getElementById('energyTag').style.display = 'inline';
  }
}

//Called by container when asset finishes playing
function externalVideoFinished() {
  //IF coming from ondemand request
  if (fromOnDemand) {
    fromOnDemand = false;

    //Just turn on the full tag with whatever the current class is
    setInfoTag();
  }

  // Force HTML layer to be hidden. If needed, it will be turned on by the function where HTML is played
  document.getElementById('htmldiv').style.visibility = 'hidden';
  document.getElementById('htmldiv').style.display = 'none';
}

function setInfoTag() {
  clearInterval(timerMoveInfoTag);

  if (rightTag) {
    currentClass = 'tvTagLeft';
  } else {
    currentClass = 'tvTagRight';
  }
  myTag = document.getElementById('infoTag').className = currentClass;
  myTag2 = document.getElementById('energyTag').className =
    'NOT' + currentClass;

  //Re engage the timer
  timerMoveInfoTag = setInterval(mainTimer, 1000);
}

function loadXMLFiles() {
  loadXMLFile(deviceXML, xmlPath + 'device.xml');
  loadXMLFile(modelXML, xmlPath + 'model.xml');
  loadXMLFile(priceXML, xmlPath + 'price.xml');
  loadXMLFile(systemXML, xmlPath + 'system_information.xml');
  loadXMLFile(dataXML, dataXMLPath + 'data.xml');

  // //Check price.xml date and reboot if more than 4hrs old
  // fetch(xmlPath + 'price.xml')
  //   .then((response) => response.text())
  //   .then((data) => {
  //     // Do something with your data
  //     console.log(data);
  //   });
}

function refreshData() {
  cleanAllFields();

  loadXMLFiles();

  //GET DATA FOR QR CODE
  try {
    theCode = getDataFromXML(deviceXML, 'device_control_code', 0);
    myURL = getDataFromXML(modelXML, 'device_code_url', 0);

    //SET QR CODE DIMENSIONS
    theWidth = 430;
    theHeight = 430;

    //DISPLAY QR CODE
    var d = new Date();
    theURL =
      myURL +
      '/index.html?SystemDeviceID=' +
      theCode +
      '&timestamp=' +
      d.getTime();
    //document.getElementById('lbl_code').innerText = theCode;

    //Set the text on the screen from myURL var instead of hardcoded. Need to strip the "//" from the
    //text and display
    if (myURL.indexOf('//') > 0) {
      splitURL = myURL.split('//');
      domainOnly = splitURL[1];
    } else {
      domainOnly = myURL;
    }
    //document.getElementById('lbl_url').innerText = domainOnly;

    document.getElementById('qrcodeCanvas').innerHTML = '';
    jQuery('#qrcodeCanvas').qrcode({
      text: theURL,
    });
  } catch (err) {
    console.log('error wroking on QR code ' + err);
  }

  //------------SET MAIN SECTION

  setSegmentation();

  //Set main model info
  try {
    document.getElementById('img_logo').src =
      'logos/' +
      getDataFromXML(modelXML, 'manufacturer_name', 0).toLowerCase() +
      '_logo.png';
    document.getElementById('lbl_modelFullName').innerText = getDataFromXML(
      modelXML,
      'type_name',
      0
    );
    document.getElementById('lbl_modelSku_1').innerText = getDataFromXML(
      modelXML,
      'model_sku',
      0
    );
  } catch (err) {
    console.log('error setting main model info' + err);
  }

  do_Inventory();

  //NEED TO DO THIS HERE SO thisSKU IS AVAILABLE INSIDE doPriceSection
  thisSKU = getDataFromXML(modelXML, 'chassis_sku', 0);

  //Set main price
  doPriceSection(modelXML, priceXML, 1);
  //------------SET MAIN SECTION

  //------------SET SPECS SECTION

  do_Utilization();

  do_Specs();

  do_Benefits();

  do_Energy();

  //------------SET ENERGY SECTION

  /*
    try {
        myWatts = getDataFromXML(modelXML, "type_power_watts_on_value", 0);
        document.getElementById("engWatts").innerHTML = myWatts;
        document.getElementById("engkWhAnnum").innerHTML = Math.round(((myWatts * .95) * 1460)/1000);
        sizeInches = getDataFromXML(modelXML, "type_videosize_inch_value", 0);
        sizeCm = getDataFromXML(modelXML, "type_videosize_cm_value", 0);
        document.getElementById("engScreenIn").innerHTML = sizeInches;
        document.getElementById("engScreenCm").innerHTML = sizeCm;

        myRate = getDataFromXML(modelXML, "type_energy_class", 0);
        document.getElementById("engRate").className = getEnergyRate(myRate);

    } catch (err) {
        logAction("Energy Label : " + err, false);
    }
*/

  //------------END SET ENERGY SECTION

  //SET THE SIZE OF THE PRICE TAG MASK
  //document.getElementById("div_tag_mask").className="tagMask_" + String(tagItems);

  setConnectedIcon();

  uploadPricingInfo();
}

function cleanAllFields() {
  //Price
  //document.getElementById('lbl_copiePrivee_Txt').innerHTML = '';
  //document.getElementById('lbl_energy_txt').innerHTML = '';
  //document.getElementById('lbl_utilisation_type').innerHTML = '';
  //document.getElementById('lbl_segmentation_type').innerHTML = '';
  document.getElementById('lbl_priceDisplaySup_1').innerHTML = '';
  document.getElementById('lbl_priceDisplay_1').innerHTML = '';
  document.getElementById('lbl_regPriceDisplaySup_1').innerHTML = '';
  document.getElementById('lbl_regPrice_1').innerHTML = '';
  document.getElementById('lbl_modelSku_1').innerHTML = '';
  document.getElementById('lbl_ecoParTxt_1').innerHTML = '';
  //Size
  document.getElementById('lbl_spec_1_1').innerHTML = '';
  document.getElementById('lbl_spec_1_2').innerHTML = '';
  //RESOLUTION
  document.getElementById('lbl_spec_2_1').innerHTML = '';
  document.getElementById('lbl_spec_2_2').innerHTML = '';
  document.getElementById('lbl_spec_2_3').innerHTML = '';
  //DALLE
  document.getElementById('lbl_spec_3_1').innerHTML = '';
  document.getElementById('lbl_spec_3_2').innerHTML = '';
  //RESPONCE
  document.getElementById('lbl_spec_4_1').innerHTML = '';
  document.getElementById('lbl_spec_4_2').innerHTML = '';
  document.getElementById('lbl_spec_4_3').innerHTML = '';
  //SYNCHRONISATION
  document.getElementById('lbl_spec_5_1').innerHTML = '';
  document.getElementById('img_spec_5_2').src = '';
  document.getElementById('img_spec_5_3').src = '';
  document.getElementById('img_spec_5_4').src = '';
  //CONNECTIQUE
  document.getElementById('lbl_spec_6_1').innerHTML = '';
  document.getElementById('lbl_spec_6_2').innerHTML = '';
  document.getElementById('lbl_spec_6_3').innerHTML = '';
  document.getElementById('lbl_spec_6_4').innerHTML = '';
  document.getElementById('lbl_spec_6_5').innerHTML = '';
  document.getElementById('lbl_spec_6_6').innerHTML = '';
  document.getElementById('lbl_spec_6_7').innerHTML = '';
  document.getElementById('lbl_spec_6_8').innerHTML = '';
  document.getElementById('lbl_spec_6_9').innerHTML = '';
  document.getElementById('lbl_spec_6_10').innerHTML = '';
  //CONSOMMATION
  document.getElementById('lbl_spec_7_1').innerHTML = '';
  document.getElementById('lbl_spec_7_2').innerHTML = '';
  document.getElementById('lbl_spec_7_3').innerHTML = '';
  //CONTRASTE
  document.getElementById('lbl_spec_8_1').innerHTML = '';
  document.getElementById('lbl_spec_8_2').innerHTML = '';
  document.getElementById('lbl_spec_8_3').innerHTML = '';
  //LUMINSOSITÉ
  document.getElementById('lbl_spec_9_1').innerHTML = '';
  document.getElementById('lbl_spec_9_2').innerHTML = '';
  document.getElementById('lbl_spec_9_3').innerHTML = '';
  //ANGLE DE VISION
  document.getElementById('lbl_spec_10_1').innerHTML = '';
  document.getElementById('lbl_spec_10_2').innerHTML = '';
  document.getElementById('lbl_spec_10_3').innerHTML = '';
  //RAPPORT
  document.getElementById('lbl_spec_11_1').innerHTML = '';
  document.getElementById('lbl_spec_11_2').innerHTML = '';
  document.getElementById('lbl_spec_11_3').innerHTML = '';
  //FRÉQUENCE
  document.getElementById('lbl_spec_12_1').innerHTML = '';
  document.getElementById('lbl_spec_12_2').innerHTML = '';
  document.getElementById('lbl_spec_12_3').innerHTML = '';
  //DIMENSIONS
  document.getElementById('lbl_spec_13_1').innerHTML = '';
  document.getElementById('lbl_spec_13_2').innerHTML = '';

  for (let row = 2; row < NUMBEROFRATINGBARS + 1; row++) {
    document.getElementById('div_ratingbars_' + row).className = 'barsType_0';
  }

  //UTILIZATION
  document.getElementById('lbl_utilisation_type').innerHTML = '';
  for (let i = 1; i < 9; i++) {
    document.getElementById('lbl_utilisation_name_' + i).innerHTML = '';
    document.getElementById('div_utilisation_' + i).className =
      'utilisation_' + i + ' utilisation_mode_';
  }

  //BENEFITS
  document.getElementById('lbl_benefits_title').innerHTML = '';
  for (let i = 1; i < 13; i++) {
    document.getElementById('lbl_benefit_title_' + i).innerHTML = '';
    document.getElementById('lbl_benefit_' + i).innerHTML = '';
  }

  //ENERGY TAG
  document.getElementById('div_energy_rate').className = '';
  document.getElementById('lbl_energy_oem').innerHTML = '';
  document.getElementById('lbl_energy_model').innerHTML = '';
  document.getElementById('lbl_energy_kwh').innerHTML = '';
  document.getElementById('lbl_energy_displayres_horizontal').innerHTML = '';
  document.getElementById('lbl_energy_displayres_vertical').innerHTML = '';
  document.getElementById('lbl_energy_videosize_cm').innerHTML = '';
}

function do_Inventory() {
  theSku = document.getElementById('lbl_modelSku_1').innerHTML.split(' ');
  theInv = theSku[2];
  if (theInv >= 2) {
    document.getElementById('img_inventory').src = 'images/inventory-in.png';
  } else {
    document.getElementById('img_inventory').src = 'images/inventory-out.png';
  }
}

function do_Utilization() {
  utilization_title = getDataFromXML(modelXML, 'type_utilization_title', 0);
  document.getElementById('lbl_utilisation_type').innerHTML = utilization_title;
  utilization_text = getDataFromXML(modelXML, 'type_utilization_text', 0);
  utilization_text = utilization_text.split('~');
  utilization_buttons = getDataFromXML(modelXML, 'type_utilization_buttons', 0);

  processButtons(utilization_buttons, utilization_text);
}

function processButtons(util_buttons, util_text) {
  for (index = 0; index < util_buttons.length; index++) {
    button_number = index + 1;
    theDiv = 'div_utilisation_' + button_number;
    theClass =
      'utilisation_' +
      button_number +
      ' utilisation_mode_' +
      util_buttons[index];
    document.getElementById('div_utilisation_' + button_number).className =
      theClass;
    document.getElementById('lbl_utilisation_name_' + button_number).innerText =
      util_text[index];
  }
}

function do_Benefits() {
  let allBenefits = getDataFromXML(modelXML, 'type_benefits', 0).split('|');
  allBenefits.forEach(processBenefit);
}

function processBenefit(benefit, index) {
  if (index == 0) {
    document.getElementById('lbl_benefits_title').innerHTML = benefit;
  } else {
    benefitItems = benefit.split('~');
    benefitItems.forEach(processBenefitItem, index);
  }
}

function processBenefitItem(item, index) {
  myPos = index + 1;
  if (myPos == 1) {
    myLbl = 'title_';
  } else {
    myLbl = '';
  }

  myLbl = myLbl + this;
  myTag = 'lbl_benefit_' + myLbl;
  document.getElementById(myTag).innerHTML = item;
}

function do_Specs() {
  let allSpecs = getDataFromXML(modelXML, 'type_specs', 0).split('|');
  allSpecs.forEach(processSpec);
}

function processSpec(spec, index) {
  myPos = index + 1;
  specItems = spec.split('~');
  specItems.forEach(processSpecItem, myPos);
}

function processSpecItem(item, index, thisArr) {
  myPos = index + 1;

  myElem = document.getElementById('div_ratingbars_' + this);
  if (myPos == thisArr.length && myElem) {
    if (myElem) {
      //SPECIAL CASE: RATINGS
      do_specsRatings(this, item);
    }
  } else {
    //POSITION 5 IS SPECIAL, AFTER THE TITLE, IT DEALS WITH IMAGES
    if (this == 5 && myPos != 1) {
      //DEAL WITH IMAGES
      if (item != '') {
        myTag = 'img_spec_' + this + '_' + myPos;
        document.getElementById(myTag).src = 'images/' + item + '.png';
      }
    } else {
      myTag = 'lbl_spec_' + this + '_' + myPos;
      document.getElementById(myTag).innerHTML = item;
    }
  }
}

function do_specsRatings(row, value) {
  document.getElementById('div_ratingbars_' + row).className =
    'barsType_' + value;
}

function setSegmentation() {
  //SET BACKGROUND COLOR STYLE
  myColors = getDataFromXML(modelXML, 'type_segment_color', 0).replace(
    '|',
    ','
  );
  //document.getElementById("body_background").style.background = "radial-gradient(" + myColors + ")";

  document.getElementById('div_segmentation').style.visibility = 'hidden';

  if (getDataFromXML(modelXML, 'type_subcategory_value', 0) !== '') {
    document.getElementById('div_segmentation').style.visibility = 'visible';
    document.getElementById('lbl_segmentation_type', 0).innerHTML =
      getDataFromXML(modelXML, 'type_subcategory_value', 0);
  }
}

function do_Energy() {
  //IF INCORRECT LEVEL, THEN CLEAR DIV
  energy_rates = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  document.getElementById('div_energy_position').style.visibility = 'hidden';
  if (
    energy_rates.includes(
      getDataFromXML(modelXML, 'type_energy_class', 0).toLowerCase()
    )
  ) {
    document.getElementById('div_energy_rate').className =
      'energy_' +
      getDataFromXML(modelXML, 'type_energy_class', 0).toLowerCase();
    document.getElementById('lbl_energy_oem').innerHTML = getDataFromXML(
      modelXML,
      'type_manufacturername_value',
      0
    );
    document.getElementById('lbl_energy_model').innerHTML = getDataFromXML(
      modelXML,
      'type_modelnumber_value',
      0
    );
    document.getElementById('lbl_energy_kwh').innerHTML = getDataFromXML(
      modelXML,
      'type_energy_kwh',
      0
    );
    document.getElementById('lbl_energy_displayres_horizontal').innerHTML =
      getDataFromXML(modelXML, 'type_display_resolution_horizontal', 0);
    document.getElementById('lbl_energy_displayres_vertical').innerHTML =
      getDataFromXML(modelXML, 'type_display_resolution_vertical', 0);
    document.getElementById('lbl_energy_videosize_cm').innerHTML =
      getDataFromXML(modelXML, 'type_videosize_cm_value', 0);

    document.getElementById('div_energy_position').style.visibility = 'visible';
  }
}

function roundUp(num, precision) {
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
}

function sortNumber(a, b) {
  return a - b;
}

function doPriceSection(modelFile, priceFile, priceLocation) {
  no_price = true;
  try {
    my_regular = getDataFromXML(priceFile, 'price_regular', 0).trim();
    my_display = getDataFromXML(priceFile, 'price_display', 0).trim();
    myScenario = getDataFromXML(priceFile, 'price_description', 0);
    thesku = getDataFromXML(modelXML, 'type_modelsku_value', 0);
    document.getElementById('div_redline').style.display = 'none';

    if (my_regular != '' || my_display != '' || thesku != '') {
      no_price = false;
    }
  } catch (err) {
    console.log('error getting main data ' + err);
  }

  if (no_price) {
    //TURN OFF PRICE SECTION BECAUSE THERE IS NOTHING PRICE TO SHOW
    document.getElementById('lbl_priceLocation_1').style.display = 'none';
  } else {
    document.getElementById('div_redline').style.display = 'inline';

    try {
      myClass = 'priceTagPos' + priceLocation;
      document.getElementById('lbl_priceLocation_' + priceLocation).className =
        myClass + ' priceType' + myScenario;

      myEco = '';
      myEco = getDataFromXML(priceFile, 'price_ecopart', 0);
      if (myEco != '') {
        document.getElementById('div_ecoPart_' + priceLocation).style.display =
          'inline';
        document.getElementById('lbl_ecoParTxt_' + priceLocation).innerHTML =
          myEco + '€';
      } else {
        document.getElementById('div_ecoPart_' + priceLocation).style.display =
          'none';
      }
    } catch (err) {
      console.log('error in doPriceSection 1 ' + err);
    }

    //Break the price in two at the decimal mark
    //Give me the last 3 chars in the string and look for a "." or ","
    //If "." or "," found, then break the string at that position and use the two parts to populate the HTML
    // REGULAR PRICE
    try {
      if (my_regular != '') {
        full_price1 = getDataFromXML(priceFile, 'price_regular', 0).trim();
        last_marker = full_price1.substring(
          full_price1.length - 3,
          full_price1.length - 2
        );
        if (last_marker == '.' || last_marker == ',') {
          last_marker_position = full_price1.length - 2;
          full_price1 = replaceChar(full_price1, last_marker_position - 1, '.');
        } else {
          last_marker_position = full_price1.length + 1;
        }
        document.getElementById('lbl_regPrice_' + priceLocation).innerText =
          full_price1.substring(0, last_marker_position - 1);
        document.getElementById(
          'lbl_regPriceDisplaySup_' + priceLocation
        ).innerText = '€' + full_price1.substring(last_marker_position);
      } else {
        document.getElementById('div_redline').style.display = 'none';
      }
    } catch (err) {
      console.log('error getting regular price ' + err);
    }

    //DISPLAY PRICE
    if (my_display != '') {
      try {
        full_price2 = getDataFromXML(priceFile, 'price_display', 0).trim();
        last_marker = full_price2.substring(
          full_price2.length - 3,
          full_price2.length - 2
        );
        if (last_marker == '.' || last_marker == ',') {
          last_marker_position = full_price2.length - 2;
          full_price2 = replaceChar(full_price2, last_marker_position - 1, '.');
        } else {
          last_marker_position = full_price2.length + 1;
        }
        document.getElementById('lbl_priceDisplay_' + priceLocation).innerHTML =
          full_price2.substring(0, last_marker_position - 1);
        document.getElementById(
          'lbl_priceDisplaySup_' + priceLocation
        ).innerHTML = '€' + full_price2.substring(last_marker_position);
      } catch (err) {
        console.log('error getting display price ' + err);
      }
    }

    //DISCOUNT

    //ADD CODE TO CALCUALTE PERCENT DISCOUNT
    // FOR SCENARIOS 3,4,5,6
    try {
      if (
        myScenario == '3' ||
        myScenario == '4' ||
        myScenario == '5' ||
        myScenario == '6'
      ) {
        try {
          var float1 = Math.round(parseFloat(full_price1) * 100) / 100;
          var float2 = Math.round(parseFloat(full_price2) * 100) / 100;
          var full_price3 = Math.round((float2 - float1) * 100) / 100;
          full_price3 = full_price3.toFixed(2);
          full_price4 = full_price3.toString();
          last_marker = full_price4.substring(
            full_price4.length - 3,
            full_price4.length - 2
          );
          if (last_marker == '.' || last_marker == ',') {
            last_marker_position = full_price4.length - 2;
          } else {
            last_marker_position = full_price4.length + 1;
          }
        } catch (err) {
          console.log('error getting discount ' + err);
        }

        if (float1 > 0 && float2 > 0 && float1 != float2) {
          document.getElementById('lbl_discount_1').innerHTML =
            full_price4.substring(0, last_marker_position - 1);
          document.getElementById('lbl_discountSup_1').innerHTML =
            '€' + full_price4.substring(last_marker_position);

          temp_discount = float2 / float1 - 1;
          temp_discount_100s = temp_discount * 100;
          percent_discount = Math.round(temp_discount_100s);
          //div_percent_<scenario>
          document.getElementById('div_percent_' + myScenario).innerHTML =
            percent_discount + '%';

          if (float2 >= float1) {
            if (float2 == float1 && myScenario == 4) {
              document.getElementById('div_percent_' + myScenario).innerHTML =
                '';
              document.getElementById('lbl_priceLocation_1').className =
                'priceTagPos1 priceType-1';
              document.getElementById('div_regPrice1').visibility = 'visible';
            } else {
              // document.getElementById('lbl_priceLocation_1').className =
              //   'priceTagPos1 priceType0';
              document.getElementById('div_regPrice1').style.visibility =
                'hidden';
            }
          }
        } else {
          document.getElementById('lbl_discount_1').innerHTML = '';
          document.getElementById('lbl_discountSup_1').innerHTML = '';
          document.getElementById('div_percent_' + myScenario).innerHTML = '';
          document.getElementById('div_regPrice1').style.visibility = 'hidden';
        }
      }
    } catch (err) {
      console.log('error calculating discount ' + err);
    }

    //SHOW THE LABEL
    document.getElementById(
      'lbl_priceLocation_' + priceLocation
    ).style.visibility = 'visible';
  }
}

function urlink() {
  try {
    var htmlLink = window.myData.gethtmlLink();
  } catch (err) {
    logAction('feed,social ,image load error=' + err, false);
  }

  document.getElementById('htmldiv').style.visibility = 'visible';
  document.getElementById('htmldiv').style.display = 'inline';

  try {
    if (
      htmlLink.includes('png') ||
      htmlLink.includes('.jpg') ||
      htmlLink.includes('.jpeg')
    ) {
      //document.getElementById("lbl_debugText").innerHTML = "PLAYING IMAGE - " + htmlLink;
      console.log('load image');
      document.getElementById('htmlimg').style.width = scr_width;
      document.getElementById('htmlimg').style.height = scr_height;
      console.log('HTML Image=' + htmlLink);
      document.getElementById('htmlimg').src = htmlLink;
      document.getElementById('htmlimg').style.visibility = 'visible';
      document.getElementById('htmlurl').style.visibility = 'hidden';
    } else {
      console.log('load html');
      document.getElementById('htmlurl').style.width = scr_width;
      document.getElementById('htmlurl').style.height = scr_height;

      document.getElementById('htmlurl').style.visibility = 'visible';
      document.getElementById('htmlurl').style.display = 'inline';

      document.getElementById('htmlimg').style.visibility = 'hidden';
      document.getElementById('htmlimg').style.display = 'none';

      document.getElementById('htmlurl').src = htmlLink;
    }
  } catch (err) {
    logAction('feed,social ,image load error=' + err, false);
  }
}

function urlinkclear() {
  console.log('urllink clear');

  try {
    var htmlLink = window.myData.gethtmlLink();
  } catch (error) {}

  document.getElementById('htmlurl').src = '';
  document.getElementById('htmlimg').src = '';
  console.log('checkInfo false img width and height=');
  document.getElementById('htmlimg').style.width = scr_width;
  document.getElementById('htmlimg').style.height = scr_height;
  document.getElementById('htmlurl').style.width = scr_width;
  document.getElementById('htmlurl').style.height = scr_height;
}

//Check if container is downloading anything, and display correct icon in UI
function checkDownloading() {
  try {
    var checkUpdate = window.myData.GetContUpdate();
    //window.myData.LogMessage("contentUpdate is : " + checkUpdate);

    var checkBlock = window.myData.GetContentBlock();

    var p2p = window.myData.GetContentP2P();
  } catch (ee) {
    logAction('error in getting downloading info=' + ee, false);
  }

  try {
    if (checkBlock == 'true') {
      document.getElementById('commBlock').style.visibility = 'visible';
      document.getElementById('commCloud').style.visibility = 'hidden';
    } else {
      document.getElementById('commBlock').style.visibility = 'hidden';
    }
  } catch (ee) {
    logAction('error in block=' + ee, false);
  }

  try {
    if (checkUpdate == 'true') {
      //logAction("Value of P2P = " + p2p);
      if (p2p == 'true') {
        document.getElementById('commCloud').style.visibility = 'hidden';
        document.getElementById('commP2P').style.visibility = 'visible';
        document.getElementById('commBlock').style.visibility = 'hidden';
        document.getElementById('m_connected').style.visibility = 'hidden';
      } else {
        document.getElementById('commCloud').style.visibility = 'visible';
        document.getElementById('commP2P').style.visibility = 'hidden';
        document.getElementById('commBlock').style.visibility = 'hidden';
        document.getElementById('m_connected').style.visibility = 'hidden';
      }
    } else if (checkUpdate == 'false') {
      document.getElementById('commCloud').style.visibility = 'hidden';
      document.getElementById('commP2P').style.visibility = 'hidden';
      document.getElementById('m_connected').style.visibility = 'visible';
    }
  } catch (err) {
    logAction('checkDownloading: ' + err, false);
  }
  //setTimeout("checkDownloading()", 1000);
}

function isHTMLWorking() {
  console.log('isHTMLWorking in stor.js');
  logAction('++ CHECKING HTML ++');
  try {
    var htmlWork = window.myData.getHTMLWorking();
    console.log('recieved from java-htmlWork=' + htmlWork);
    myData.setHtmlWork(htmlWork);
    console.log('send to java htmlWork=' + htmlWork);
  } catch (err) {
    console.log('error in HTMLWork=' + err);
  }
}

//CALLED BY CONTAINER TO VERIFY JS IS STILL OPERATIONAL
function healthyJS() {
  return 'true';
}

function uploadPricingInfo() {
  //STILL TESTING

  //Display Price
  theCents = document.getElementById('lbl_priceDisplaySup_1').innerHTML;
  // if (theCents === '') {
  //   theCents = '00';
  // }
  myDisplay =
    document.getElementById('lbl_priceDisplay_1').innerHTML + '.' + theCents;

  //Regular Price
  theCents = document.getElementById('lbl_regPriceDisplaySup_1').innerHTML;
  // if (theCents === '') {
  //   theCents = '00';
  // }
  myRegular =
    document.getElementById('lbl_regPrice_1').innerHTML + '.' + theCents;

  //Scenario
  myClass = document.getElementById('lbl_priceLocation_1').className;
  myScenario = myClass.substring(myClass.length - 1, myClass.length);

  //SKU FROM UI
  theSku = document.getElementById('lbl_modelSku_1').innerHTML.split(' ');
  mySku = theSku[0];

  // //SKU FROM priceXML.XML
  // theXMLSku = getDataFromXML(priceXML, 'tbl_price_retailer_sku');

  myTax = document.getElementById('lbl_ecoParTxt_1').innerHTML;

  myDevice = getDataFromXML(systemXML, 'tbl_system_guid', 0);

  isoDateString = new Date().toISOString();

  price_string =
    'SKU=' +
    mySku +
    '; DESCRIPTION=' +
    myScenario +
    '; REGULAR=' +
    myRegular +
    '; PRICE=' +
    myDisplay +
    '; TAX=' +
    myTax;

  try {
    myXML = priceXML.responseText.replace(/(\r\n|\n|\r)/gm, '').slice(0, -2000);
    // myXML = priceXML.responseText.slice(0, -2000);
  } catch (e) {
    myXML = 'ERROR';
  }

  var ua = window.navigator.userAgent;
  var msie = ua.indexOf('MSIE ');
  const baseURL = 'https://storsnetwork.com/system_comm_secure.asmx/';
  var parameters =
    'system_device=' +
    myDevice +
    '&prices_string=' +
    price_string +
    '&xmlfile=' +
    myXML +
    '&shell_version=' +
    shell_version +
    '&js_checkin=' +
    isoDateString;

  var APINAME = 'jsPrices6?';
  var serviceURL = baseURL + APINAME + parameters;
  $.ajax({
    type: 'GET',
    url: serviceURL,
    dataType: 'xml',
    error: function (errorThrown) {
      console.log('Error');
      //CHANGE PRICE TAG TO RED IF timestamp in price.xml is < 7am local time
      //ELSE LEAVE AS IS
      price_date_stamp = new Date(
        getDataFromXML(priceXML, 'price_filedate'),
        0
      );

      my_date_stamp = new Date();
      theYear = my_date_stamp.getFullYear();
      theMonth = my_date_stamp.getMonth();
      theDay = my_date_stamp.getDate();
      theHrs = my_date_stamp.getHours();
      cutoff_date = new Date(theYear, theMonth, theDay, cutOff_time, 0, 0, 0);
      if (price_date_stamp < cutoff_date) {
        if (theHrs > cutOff_time) {
          //CHANGE TAG TO RED, OTHERWISE DO NOTHING
          document.getElementById('img_price_check_color').src =
            'images/price-red.svg';
          localStorage.setItem(
            'tag_color',
            document.getElementById('img_price_check_color').src
          );
        }
      }
    },
    success: function (data) {
      responseData = data;

      if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        // If Internet Explorer, return version number
        responseData = data.documentElement.textContent;
      } // If another browser, return 0
      else {
        responseData = data.documentElement.innerHTML;
      }
      //here you can do the rest of the steps
      console.log('API RESPONSE: ' & responseData);

      //CHANGE COLOR ACCORDING TO DATA RECEIVED
      document.getElementById('img_price_check_color').src =
        'images/price-' + responseData + '.svg';

      localStorage.setItem(
        'tag_color',
        document.getElementById('img_price_check_color').src
      );
    },
  });
}
