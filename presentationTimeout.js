import xapi from 'xapi';


/**
 * RoomOS macro to terminate local share on devices to allow the room to be shown as available on outside-the-room Navigators
 *  In rooms with fixed in-room computers local sharing often stays on in the room preventing the room
 *  from becoming available- this macro addresses the issue
 * 
 * Author: Tyler Osgood - tyosgood@cisco.com
 * 
 * MIT License
 */


//configure these variables
const delay = 10; //number of minutes to delay before stopping presentation (after there are no people in room)
const debugging = Boolean(false);  //set to true to enable console logging for debugging

//do not configure anything below
let timeout;
debug('Debugging is on');

//listen for PeoplePresence status updates and stop preso after room is empty and delay expires
xapi.Status.RoomAnalytics.PeoplePresence.on((people) => {
  debug(`People present: `+people);
  if (people == 'No'){
        debug("No one present - setting timeout")
        xapi.Status.RoomAnalytics.RoomInUse.get().then((Inuse) => {debug('Room In Use: '+Inuse);});
        timeout = setTimeout(stopShare, delay*60000)}
     else if (people == 'Yes'){
        clearTimeout(timeout);
        debug("People present - clearing timeout")
     }
});


function stopShare(){
  xapi.Command.Presentation.Stop();
  debug("Presentation Stopped");
  if (debugging) setTimeout(inUse,5000);
}

function inUse(){
  xapi.Status.RoomAnalytics.RoomInUse.get().then((Inuse) => {console.log('Room In Use: '+Inuse);})
}

function debug(message){
  if (!debugging) return;
  else {
    console.log(message);
  }
}
