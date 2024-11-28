parent.trialFrame = window;
parent.console.log('Sent my info to parent');
parent.addEventListener('touchstart', {});



var shapes = []
var task = {}
var target = [[0]];
//draw size small
var grid = 20; // Pixel size of grid unit
var block = 16; // Block size that each primitive occupies
var canvas_w = 5*block*grid;
var canvas_h = 2.5*block*grid;
// x, y as in GM convenction: origin in top left, x increasing to right, y increasing to bottom
var x_start = 0;
var y_start = 1.5*block*grid; // Space for interface and target
var x_target = 0;
var y_target = 0;
var button_y = 0.3*block*grid;
var button_height = 0.2*block*grid;
var button_width = 0.5*block*grid;


let buttonOK;
let buttonRE;
//let buttonStart;
var signal = 0;
var flip = false;
//Procedure
var shape_submitted = -1;
var timesRestart = -1;
//bulls
var whetherInstru = false;
var whetherFix = false;
var whetherOldTrial_Planning = false;
var whetherOldTrial_Dragging = false;
var whetherITI = false;
var whetherITI_Added = false;
var whetherOldTrial_Dragging_setup = true;



var ref_time_Instru = -1;
var ref_time_Fix = -1;
var ref_time_OldTrial_Planning  = -1;
var ref_time_OldTrial_Dragging= -1;
var ref_time_ITI= -1;
var ref_time_ITI_Added= -1;


var interval_Instru = 0.1; 
var interval_Fix = -1;
var interval_OldTrial_Planning  = 8000;
//var interval_OldTrial_Planning  = 100;//debug
var interval_ITI= -1;
var interval_ITI_Added= -1;
//Version 2 20240317 
var whetherRecording = false;
var ref_time_Record = -1;
var endrecording = false;
let recorder;
let mic;
let soundFile;
let level, diameter;
let mediaRecorder; 
let audioChunks = []; 
let recordingDuration = 0; 
let recordingInterval; 
let wtrecord = false;
let click_Record_Start = false;
//Version 3 20240402
let wtsaveBigCompData = false;
let wtsaveSmallCompData =false;

//Version 3 20240402
let intervalID = null;

function setup(){
    createCanvas(canvas_w, canvas_h);
    origin = _renderer.position();
    buttonOK = createButton('提交');
    buttonRE = createButton('复原');
    buttonRecord = createButton('开始游戏');  
    buttonRecord_Conti = createButton('结束录音');  
    buttonRecord_Start = createButton('开始录音');  

    buttonPosition(buttonRecord,canvas_w/2 + button_width,origin.y+canvas_h - 2*button_height,button_width,button_height,color(0, 0, 0, 255),clickStart)
    buttonPosition(buttonRecord_Conti,canvas_w/2 - 0.5* button_width,origin.y+canvas_h - 2*button_height,button_width,button_height,color(0, 0, 0, 255),clickContinue)
    //buttonPosition(buttonRecord_Conti,canvas_w/2 + button_width,origin.y+canvas_h - 2*button_height,button_width,button_height,color(0, 0, 0, 255),clickContinue)
    buttonPosition(buttonRecord_Start,canvas_w/2 -2 * button_width,origin.y+canvas_h - 2*button_height,button_width,button_height,color(0, 0, 0, 255),clickRecord)

    buttonPosition(buttonOK,origin.x + canvas_w/2 - button_width/2,origin.y+canvas_h - 2*button_height,button_width,button_height,color(120, 120, 120, 255),clickOK)
    buttonPosition(buttonRE,origin.x + canvas_w/2 - button_width/3,origin.y + button_y,button_width-button_height,button_height,color(0, 0, 0, 255),clickRE)

  }
function draw(){
    // White background
    background(255);
    presentMarker();
    if(whetherInstru){
      //parent.console.log("present_Instru");
      presentInstru();
      cursor(ARROW); 
    }
    if(whetherFix){
      //parent.console.log("present_Fix");
      presentFix();
      noCursor(); 
    }
    if(whetherOldTrial_Planning){
      //parent.console.log("present_LargeTarget");
      presentLargeTarget();
      noCursor(); 

    }
     //Version 2 20240317 
     if(whetherRecording){
      //parent.console.log("present_Recording");
      presentRecording();
      cursor(ARROW); 

    }
    if(whetherITI_Added){
      //parent.console.log("present_first_ITI");
      presentITI_Added();
      cursor(ARROW); 
    }
    
    if(whetherOldTrial_Dragging){
      //Version 3 20240402  
      //parent.console.log("present_Dragging");
      presentOldDragging();
      cursor(ARROW); 
      if (!intervalID) {
        intervalID = setInterval(logMousePosition, 2); // log every 0.5 seconds
      } 
    }else {
      if (intervalID) {
        clearInterval(intervalID);
        intervalID = null;
        parent.saveMouseData();
       }
    }
    if(whetherITI){
      //parent.console.log("present_second_ITI");
      presentITI();
      noCursor(); 

    }


    if(ref_time_Fix > -1 && (Date.now()  - ref_time_Fix) >= interval_Fix){
        task.Trace_time_fix[task.trial]=Date.now() - ref_time_Fix;
        parent.console.log('RecordData:03_Trace_time_fix');  

        flip = !flip;
        signal = 1 - signal;  

        whetherFix = false;
        whetherOldTrial_Planning = true;
        wtsaveBigCompData=true;//only record at the begginning of planning
        ref_time_Fix = -1;
        ref_time_OldTrial_Planning = Date.now() ;
        task.Trace_start_Planning[task.trial]=ref_time_OldTrial_Planning;
        parent.console.log('RecordData:04_Trace_start_Planning');  

    }

    if(ref_time_OldTrial_Planning > -1 && (Date.now()  - ref_time_OldTrial_Planning) >= interval_OldTrial_Planning){
      flip = !flip;
      signal = 1 - signal;  
      whetherOldTrial_Planning = false;
      ref_time_OldTrial_Planning = -1;
      
      whetherRecording=true;
      wtrecord=true;
      ref_time_OldTrial_Planning = -1;
      ref_time_Record = Date.now();
      task.Trace_start_Record[task.trial] = ref_time_Record;        
      endrecording = false;
      parent.console.log('RecordData:06_Trace_start_Record');  

    }

     //Version 2 20240317 
     if(ref_time_Record > -1 && endrecording ){
      flip = !flip;
      signal = 1 - signal;  
      whetherRecording = false;
      task.Trace_time_Record[task.trial] = Date.now()   - ref_time_Record;
      parent.console.log('RecordData:07_Trace_time_Record');  

      ref_time_Record=-1;
      endrecording=false;
      buttonRecord.hide();
      buttonRecord_Conti.hide();
 
       whetherITI_Added=true;
      ref_time_ITI_Added = Date.now();
      task.Trace_start_iti_Added[task.trial] = ref_time_ITI_Added;     
      parent.console.log('RecordData:08_Trace_start_iti_Added');  

  }


    if(ref_time_ITI_Added > -1&& (Date.now()  - ref_time_ITI_Added) >= interval_ITI_Added ){
      // flip = !flip;
      // signal = 1 - signal;  
      whetherITI_Added = false;
      task.Trace_time_iti_Added[task.trial] = Date.now()   - ref_time_ITI_Added;
      parent.console.log('RecordData:09_Trace_time_iti_Added');  

      ref_time_ITI_Added=-1;

      ref_time_OldTrial_Dragging = Date.now() ;
      task.Trace_start_Dragging[task.trial]=ref_time_OldTrial_Dragging;
      parent.console.log('RecordData:10_Trace_start_Dragging');  
      whetherOldTrial_Dragging = true;
      wtsaveSmallCompData=true;
  }



    if(ref_time_ITI > -1&& (Date.now()  - ref_time_ITI) >= interval_ITI ){
        flip = !flip;
        signal = 1 - signal;  
        
        whetherOldTrial_Dragging_setup=true;
        whetherITI = false;
        task.Trace_time_iti[task.trial] = Date.now()   - ref_time_ITI;
        parent.console.log('RecordData:13_Trace_time_iti');  

        finishTrial();
    }
}

 


//*****************************function************************ */

//Version 3 20240402
function logMousePosition() {
  //console.log("Mouse Position:", mouseX, mouseY);
  task.mousePositions.push({Phase:'probe',Block:task.block_Curr,Trial:task.trial,x: mouseX, y: mouseY, time: Date.now()  });
}

//****************************Main Process************* */
function initTask(in_task){
    // This function is going to be called by parent html,
    // providing task specifics
    task = in_task;
    task.currentID ="Trace";
    //task.trial = 28 //debug
    initTrial();
  }

function initTrial(){
    var header = parent.document.getElementById('header');
    header.style.visibility="hidden"
    // Call parent function and store current task 
    parent.finishedTrace(window);  
    if(task.trial==-1){
      whetherFix=false;
      whetherInstru = true;
      ref_time_Instru = Date.now() ;
       //in changed in sub-46 and there is only one instruction.
      task.Trace_start_instru[0]=ref_time_Instru;
      parent.console.log('RecordData:01_Trace_start_instru');  

    }else{
      whetherFix=true
      ref_time_Fix = Date.now() ;
      task.Trace_start_fix[task.trial+1]=ref_time_Fix;
      parent.console.log('RecordData:02_Trace_start_fix');  
    }
    buttonRE.hide();
    buttonOK.hide();
    buttonRecord.hide();
    buttonRecord_Start.hide();
    buttonRecord_Conti.hide();

    interval_Fix = random(300, 701);
    interval_ITI = random(300, 701);
    interval_ITI_Added = random(300, 701);
    task.trial += 1;
}

function presentInstru(){
    noStroke();
    textSize(35); 
    fill(0); 
    textAlign(CENTER, BOTTOM); 
    let lineHeight = textSize(); 
    text("录音已开启，请开始录音测试。", width / 2, height / 2 + lineHeight*2);
    text("成功录音请点击开始游戏。", width / 2, height / 2 + lineHeight*4);
    if(click_Record_Start){
      buttonRecord.show();
      buttonRecord_Conti.show();
      buttonRecord_Start.hide();
    }else{
      buttonRecord.show();
      buttonRecord_Start.show();
      buttonRecord_Conti.hide();

    }
};
function clickStart(){
  flip = !flip;
  signal = 1 - signal;  
  parent.console.log("click_start");
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  buttonRecord.hide();
  buttonRecord_Start.hide();
  buttonRecord_Conti.hide();
  //the first fix time ( when first time enter the game)
  //Due to the asynchronous nature of the variable's changes, it needs to be placed here
  whetherInstru=false;
  whetherFix = true;
  click_Record_Start=false;
  ref_time_Fix = Date.now() ;
  task.Trace_start_fix[task.trial]=ref_time_Fix;
  parent.console.log('RecordData:02_Trace_start_fix');  

}
function clickContinue(){

  if(click_Record_Start){
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  }else{
    flip = !flip;
    signal = 1 - signal;  
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    whetherITI_Added = true;
    ref_time_ITI_Added = Date.now() ;
    task.Trace_start_iti_Added[task.trial]=ref_time_ITI_Added;
    buttonRecord_Conti.hide();
    buttonRecord_Start.hide();
    whetherRecording = false;
    endrecording = true;
  }


}
function clickRecord(){
  mediaRecorder = null;
  audioChunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        let options = {};
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          options.mimeType = 'audio/webm'; 
        } else {
          parent.console.log('Using browser default audio format.');
        }
        mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorder.ondataavailable = function (e) {
              audioChunks.push(e.data);
        };
        mediaRecorder.onstop = handleStopRecording
        mediaRecorder.start(); 
      });
  if(whetherInstru){
    click_Record_Start = true;
  }
}


function handleStopRecording() {
  let audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
  var filename_2 = 'sub-'+task.subjectTag + '_name-' + task.name.toString() + '_v-' + task.version.toString() + '_s-'+task.session.toString()+ "_"+task.currentID.toString()+"_b-"+task.block_Curr.toString()+"_t-"+task.trial.toString();  
  let filename = (whetherInstru) ? "test" : filename_2;
  convertWebMToWAV(audioBlob,filename);
  clearInterval(recordingInterval);
}




function convertWebMToWAV(webmBlob,filename) {
  const audioCtx = new AudioContext();
  const reader = new FileReader();

  reader.onload = function (event) {
    const arrayBuffer = event.target.result;
    audioCtx.decodeAudioData(arrayBuffer, function (audioBuffer) {
      const wavBuffer = encodeWAV(audioBuffer);
      const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });
      downloadAudio(wavBlob, filename+'.wav');
    });
  };
  reader.readAsArrayBuffer(webmBlob);
}

function encodeWAV(audioBuffer) {
  const buffer = new ArrayBuffer(44 + audioBuffer.length * 2);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + audioBuffer.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, audioBuffer.numberOfChannels, true);
  view.setUint32(24, audioBuffer.sampleRate, true);
  view.setUint32(28, audioBuffer.sampleRate * 4, true);
  view.setUint16(32, audioBuffer.numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, audioBuffer.length * 2, true);

  const length = audioBuffer.length;
  const data = audioBuffer.getChannelData(0);

  let index = 44;
  for (let i = 0; i < length; i++) {
    view.setInt16(index, data[i] * 0x7FFF, true);
    index += 2;
  }

  return view;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function downloadAudio(audioBlob,filename){
  let url = URL.createObjectURL(audioBlob); 
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


function getExtensionFromMimeType(mimeType) {
  switch (mimeType) {
    case 'audio/webm':
      return 'webm';
    case 'audio/mpeg':
      return 'mp3';
    case 'audio/ogg':
      return 'ogg';
    default:
      return '';
  }
}


function presentFix(){
    stroke(0); //  
    strokeWeight(4); //  
    var length =48;
    var centerX = width / 2;
    var centerY = height / 2;
    line(centerX - length / 2, centerY, centerX + length / 2, centerY);
    line(centerX, centerY - length / 2, centerX, centerY + length / 2);
  };

function presentLargeTarget(){
    target = task.trial_target[task.trial];
    // Center new target
    grid_2 = grid*2.5;
    y_start_2 = y_start*1.2
    drawtarget(target,grid_2,y_start_2);
};

//Version 2 20240317 
function presentRecording(){
  target = task.trial_target[task.trial];

  // Center new target
  grid_2 = grid*2.5;
  y_start_2 = y_start*1.2;
  drawtarget(target,grid_2,y_start_2);
  // test recording
  textSize(52); 
  fill(0); 
  textAlign(CENTER, BOTTOM); 
  let lineHeight = textSize(); 
  text("请说出该图案的拼接顺序。", width / 2, height / 2 + lineHeight*4);
  //recording button 
  // level = mic.getLevel();
  // let diameter = map(level, 0, 1, 10, 200);
  // ellipse(width/2, height/2, diameter*50, diameter*50);
  buttonRecord_Conti.show();
  //buttonRecord_Start.show();
  if(wtrecord){
    clickRecord();
    wtrecord=false;
  }
}

function presentOldDragging(){
    //Draw the layout
    if(whetherOldTrial_Dragging_setup){
        ref_time_OldTrial_Dragging = Date.now();
        task.trial_start[task.trial] = ref_time_OldTrial_Dragging;
        parent.console.log('RecordData:10_trial_start');  

        // Create shape objects
        for (let s=0; s < 5; s++)
            shapes[s] = new Draggable(0, 0, []);
        // Create button for finishing trial
        
         buttonOK.hide();
        buttonRE.show();
        initShapes();
        whetherOldTrial_Dragging_setup=false;
        
        var new_event = {'type': 'Trace_Start_Dragging', 
                   'time': ref_time_OldTrial_Dragging, 
                   'positions': []};
        for (let s = 0; s < shapes.length; s++)
          new_event['positions'][s] = [shapes[s].x, shapes[s].y];
        pushEvent(new_event);
    }
    textSize(18); 
    strokeWeight(1); //  
    drawtarget(target,grid,y_start);
    drawLayout();
    drawMovingshapes();

}
function  presentITI_Added(){
  noStroke();

}
function  presentITI(){
    noStroke();

    ref_time_OldTrial_Dragging = -1;
  }
//******************************For Dragging ****************/


function mousePressed() {
    // Evualate for each shape if it is being dragged
    for (i = 0; i < shapes.length; i++)
    {
      if (shapes[i].pressed())
        return;
    }
  }
  
function mouseReleased() {
    // Release shapes from being dragged
    for (i = 0; i < shapes.length; i++)
      shapes[i].released();
  }
function clickOK(){
    flip = !flip;
    signal = 1 - signal;  
    whetherOldTrial_Dragging = false;

    buttonOK.hide()
    buttonRE.hide() 
    ref_time_ITI = Date.now(); 
    parent.console.log('RecordData:12_Trace_start_iti'); 
    parent.console.log('RecordData:12_trial_time');  
    parent.console.log('RecordData:12_trial_solution');  
    parent.console.log('RecordData:12_trial_result');  
    parent.console.log('RecordData:12_trial_correct');  
    parent.console.log('RecordData:12_trial_events');  

    task.trial_time[task.trial] = Date.now() - task.trial_start[task.trial];
    task.Trace_start_iti[task.trial]=Date.now();
    task.trial_solution[task.trial] = shapes[shape_submitted]['id'];
    // Add result: which target entries ended up coloured in
    var row_offset = 0;
    var col_offset = 0;
    var n_rows = 0;
    var n_cols = 0;
    // Run through rectangles in solution and update offsets and cols
    for (let s = 0; s < shapes[shape_submitted].rectangles.length; s++)
    {
      var curr_rect = shapes[shape_submitted].rectangles[s];
      row_offset = Math.max(-Math.floor(curr_rect[1]/grid), row_offset);
      col_offset = Math.max(-Math.floor(curr_rect[0]/grid), col_offset);    
      n_rows = Math.max(Math.floor(curr_rect[1]/grid), n_rows);
      n_cols = Math.max(Math.floor(curr_rect[0]/grid), n_cols);
    }
    // Add offset to n_rows and n_cols to compensate negative coords
    n_rows = n_rows + row_offset + 1;
    n_cols = n_cols + col_offset + 1;
      // Create empty result matrix
    task.trial_result[task.trial] = []
    for (r = 0; r < n_rows; r++)
    {
      task.trial_result[task.trial][r] = [];
      for (c = 0; c < n_cols; c++)
        task.trial_result[task.trial][r][c] = 0;
    }
    // Then add all rectangles in result matrix
    for (let s = 0; s < shapes[shape_submitted].rectangles.length; s++)
    {
    var curr_rect = shapes[shape_submitted].rectangles[s];    
      task.trial_result[task.trial][Math.floor(curr_rect[1]/grid) + row_offset][Math.floor(curr_rect[0]/grid) + col_offset] = 1;
    }
    task.trial_correct[task.trial] = resultScore();

    // Find if result was correct - or actually, use continuous score
    task.trial_events[task.trial].push({
        'type': 'Trace_End_Trial', 
        'time': Date.now()});
    for (let s=0; s < 5; s++)
      shapes[s] = new Draggable(0, 0, []);
    whetherITI = true;

}
function clickRE(){
    initShapes();
    eventReset();
    buttonOK.hide();
  
  }
  function initShapes(){
    // Clear submission
    shape_submitted = -1;
    // Set starting positions in grid coordinates
    var start = [];
    for (let col = 0; col < 5; col ++)
      start[col] = [block * (col + 0.5) - 1, block * 0.5 - 1];
    // Randomly shuffle initial positions
    shuffleArray(start);
    // But now build shapes from squares instead of rectangles// ['十字','横线','边角','帽子','方形'];
    var rectangles = [
      [[1, 0, 1, 1], [0, 1, 1, 1], [1, 1, 1, 1], [2, 1, 1, 1], [1, 2, 1, 1]],
      [[0, 0, 1, 1], [1, 0, 1, 1], [2, 0, 1, 1]],
      [[0, 0, 1, 1], [0, 1, 1, 1], [1, 1, 1, 1]],
      [[1, 0, 1, 1], [0, 1, 1, 1], [1, 1, 1, 1], [2, 1, 1, 1]],
      [[0, 0, 1, 1], [1, 0, 1, 1], [0, 1, 1, 1], [1, 1, 1, 1]]];
    // Convert rectangle grid coordinates to pixels
    for (let s = 0; s < rectangles.length; s++)
      for (let r = 0; r < rectangles[s].length; r++)
        for (let i = 0; i < rectangles[s][r].length; i++)
          rectangles[s][r][i] *= grid;
    // Run through shapes and update their positions
    for (let s = 0; s < shapes.length; s++)
    {
      shapes[s].x = x_start + grid * start[s][0];
      shapes[s].x_start = shapes[s].x;
      shapes[s].y = y_start + grid * start[s][1];
      shapes[s].y_start = shapes[s].y;
    }
    // Run through shapes and set rectangles
    for (let s = 0; s < shapes.length; s++)
      shapes[s].rectangles = rectangles[s];
    // Set shape ids: all primitives in this shape and their offsets
    for (i = 0; i < shapes.length; i++)
    {
      shapes[i].id = [{'id': i, 'x': 0, 'y': 0}];
    }
  
  
  }
 function finishTrial(){
    ref_time_ITI=-1;
    whetherITI = false;
    if (task.trial < (task.n_trials - 1))
    {   
      parent.console.log("task.trial:"+task.trial)
        initTrial();
    }
    else
    {
      parent.console.log("task.trial:"+task.trial)

      var header = parent.document.getElementById('header');
      header.style.visibility="visible";
      task.trial_trace+=1;

      parent.store_trial();
      parent.nextTab();
      parent.saveData();
    }   

 }
//****************************Other function************* */
function pushEvent(new_event){
    // Add event to list
    task.trial_events[task.trial].push(new_event);  
    // Flip the signal pixel for synchronisation
    flip = !flip;
    signal = 1 - signal;  
    parent.console.log('RecordData:pushEvent');  

  }
function eventReset(){
// Indicate as event where each object ended up
var new_event = {'type': 'Trace_Reset', 
                    'time': Date.now()-  task.trial_start[task.trial], 
                    'positions': []};
// Add all shape positions to list
for (let s = 0; s < shapes.length; s++)
    new_event['positions'][s] = [shapes[s].x, shapes[s].y];
// Add event to list
pushEvent(new_event);

//task.trial_events[task.trial].push(new_event);  
}
function resultScore(){
// Calculate intersection over union around target shape
var intersection = 0;
var union = 0;
for (r = -1; r <= target.length; r++)
    for (c = -1; c <= target[0].length; c++)
    {
    // Find if this location is in the target - uses javascript short circuit
    var in_target = (!(r == -1 || r == target.length || c == -1 || c == target[r].length) 
                        && (target[r][c] == 1));
    // Find if this location is in the solution 
    //var solution_val = get(x_target + (c + 0.5) * grid, y_target + (r + 0.5) * grid)[0];
    var in_solution = (!(shape_submitted == -1) 
                        && shapes[shape_submitted].on_shape(x_target + (c + 0.5) * grid, y_target + (r + 0.5) * grid));
    //var in_solution = (solution_val > 0 && solution_val < 255);
    // Update intersection and union
    intersection += (in_target && in_solution);
    union += (in_target || in_solution);
    }
if (union == 0)
    return 0;
else
    return intersection / union;
}
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
  } 
function drawMovingshapes(){
    for (i = 0; i < shapes.length; i++)
    {
      shapes[i].over();
      shapes[i].update();
      shapes[i].show();
    }
 }

function drawLayout()
    {
     // Draw submission line
      stroke(39, 3, 201);
      line(x_start, y_start, canvas_w, y_start);
      // Draw instruction text
      noStroke();
      fill(0);
      textSize(18);    
}

function presentMarker(){
    // Draw signal pixel for given value
    noStroke();
    fill(signal*255);
    rect(0, 0, button_height*2.5, button_height*2.5);
    rect(canvas_w - button_height*2.5, 0, button_height*2.5, button_height*2.5);  
    
}
function drawtarget(target,grid_2,y_start){

    x_target = grid_2*(Math.round((canvas_w - target[0].length*grid_2)*0.5/grid_2));
    y_target = y_start - (target.length + 2) * grid_2;

    noStroke();  
    var start_X = 0;
    var start_Y = 0;
    var End_X = 0;
    var End_Y = 0;
    var row = 0;
    var column = 0;
    for (r = 0; r < target.length; r++)
    {
      for (c = 0; c < target[r].length; c++)
      {
          fill((1-target[r][c])*255); 
          stroke(255);
          //grid_2 = grid_2*2;
          rect(x_target + c*grid_2, y_target + r*grid_2, grid_2, grid_2);
         
          if(r==0&&c == 0){
            start_X=x_target + c*grid_2 +2 ;
            start_Y=y_target + r*grid_2 +2 ;
           
          }
          if(r==(target.length-1)&&c == (target[r].length-1)){
            End_X = x_target + c*grid_2+grid_2-2;
            End_Y = y_target + r*grid_2+grid_2-2;
            row = r+1;
            column = c+1;
          }
      }
     
    }
    //Version 3 20240402
    // Save data for every big and small component location.
    // Stroke weight = 4; adding 2 index outside the box. The grid, including the stroke, is 50. This might affect the starting location of the actual black grid.
    // There is no need to address the stroke problem for the elements.The width for every element is 20.
    if(wtsaveBigCompData){
      task.Trace_BigCompLoc[task.trial]=[row,column,start_X, start_Y,End_X-start_X,End_Y-start_Y];
      parent.console.log('RecordData:05_Trace_BigCompLoc');  

      wtsaveBigCompData=false;
    }else if(wtsaveSmallCompData){
      task.Trace_SmallCompLoc[task.trial]=[row,column,start_X, start_Y,End_X-start_X,End_Y-start_Y];
      parent.console.log("RecordData：11_Trace_SmallCompLoc");
      wtsaveSmallCompData=false;
    }
}
function buttonPosition(buttonName,x,y,z,k,color,mousePressedCallback){
    buttonName.position(x, y);
    buttonName.size(z, k);
    buttonName.style('color',color );
    buttonName.style('font-size', '18px');
    buttonName.mousePressed(mousePressedCallback);  

  }
class Draggable {
    constructor(x, y, rectangles) {
      // State variables
      this.dragging = false; // Is the object being dragged?
      this.rollover = false; // Is the mouse over the object?
      this.returning = false; // It the object moving back after invalid move?
        this.id = [];
      this.x = x;
      this.y = y;    
      this.x_start = x;
      this.y_start = y;
      // Keep track of actions involving object
      this.event = {};
      // Layout setup: grid for aligning to
        this.grid = grid;
      // Component rectangles: collection of rectangles [x, y, w, h]
      this.rectangles = rectangles;
    }
  
    on_shape(x,y){
      // Return if input x,y position is somewhere on this shape
      var is_on = false;
        for (let s = 0; s < this.rectangles.length; s++)
        {
            var curr_rect = this.rectangles[s];
            if (x > this.x + curr_rect[0] && x < this.x + curr_rect[0] + curr_rect[2] &&
                y > this.y + curr_rect[1] && y < this.y + curr_rect[1] + curr_rect[3])
                is_on = true;
        }
      // But only if the task has actually started, and not currently moving back
      return (Object.keys(task).length > 0) && is_on && !this.returning
    }
    do_overlap_inclusive(rect1, rect2){
   // Return if these two rectangles [x, y, w, h] overlap *including* boundaries
      // But do this separately for horizontal and vertical overlap to exclude corners
      return ((rect1[0] <= (rect2[0] + rect2[2]) && rect2[0] <= (rect1[0] + rect1[2])
               && rect1[1] < (rect2[1] + rect2[3]) && rect2[1] < (rect1[1] + rect1[3])) ||
              (rect1[0] < (rect2[0] + rect2[2]) && rect2[0] < (rect1[0] + rect1[2])
               && rect1[1] <= (rect2[1] + rect2[3]) && rect2[1] <= (rect1[1] + rect1[3])))
   
    }
    do_overlap_exclusive(rect1, rect2) {
      // Return if these two rectangles [x, y, w, h] overlap *excluding* boundaries
        return (rect1[0] < (rect2[0] + rect2[2]) && rect2[0] < (rect1[0] + rect1[2]) 
                && rect1[1] < (rect2[1] + rect2[3]) && rect2[1] < (rect1[1] + rect1[3]))
      }
    over(){
      if (this.on_shape(mouseX, mouseY)) {
        this.rollover = true;
  
      } else {
        this.rollover = false;
  
      }
  
    }
  
    update(){
      if (this.returning)
      {
        // If close to home: snap to start, and stop returning
        if (Math.abs(this.x - this.x_start) < grid && Math.abs(this.y - this.y_start) < grid)
        {
          this.x = this.x_start;
          this.y = this.y_start;
          this.returning = false;
        }
        else
        {
          // Move 10% towards home 
          this.x += (this.x_start - this.x) * 0.1;
          this.y += (this.y_start - this.y) * 0.1;        
        }
      }
      if (this.dragging) {
        this.x = Math.max(-grid*3, Math.min(mouseX + this.offsetX, canvas_w+3*grid));
        this.y = Math.max(grid*14, Math.min(mouseY + this.offsetY, canvas_h - grid*0.25));
      }
    }
    show(){
      stroke(255);
      // Different fill based on state
      if (this.dragging) {
        fill(50);
      } else if (this.rollover) {
        fill(100);
      } else {
        fill(175);
      }
      for (let s = 0; s < this.rectangles.length; s++)
          rect(this.x + this.rectangles[s][0], this.y + this.rectangles[s][1],
              this.rectangles[s][2], this.rectangles[s][3]);
    }
  
    pressed(){
      // Dragging is allows if a) no submission, or b) submission is this object
      // Notice this if condition only works because of javascript short circuiting

      if (shape_submitted == -1 || shapes[shape_submitted] === this)
      {
        // Did I click on the rectangle?
        if (this.on_shape(mouseX,mouseY)) {
  
          // Push mouse pressed event
          for (let c=0; c < this.id.length; c++)
          {
            let id = this.id[c]['id']
            let x = this.id[c]['x']
            let y = this.id[c]['y']
            let all={id:id,x:x,y:y}
          }
          pushEvent({'type': 'Trace_Press', 
                        'id': this.id,
                        'time': Date.now()- task.trial_start[task.trial]});
          // And start dragging
          this.dragging = true;
          // If so, keep track of relative location of click to corner of rectangle
          this.offsetX = this.x - mouseX;
          this.offsetY = this.y - mouseY;
  
           // Initialise Last move event
          this.event = {'type': 'Trace_Move_First', 
            'id': this.id,
            'time': Date.now()- task.trial_start[task.trial],
          };
          // Return true. This makes sure you can't select two shapes simultaneously
          return true;
        }
        else
          return false;
      }
      else
        return false;
    }
    released(){
      if (this.dragging)
      {
        // Map to nearest multiple of grid
        this.x = this.grid*(Math.round(this.x/this.grid));
        this.y = this.grid*(Math.round(this.y/this.grid));   
        // If dragged above submission line: this shape is the submitted one
        if (this.y < y_start)
        {
          // Assign own list index to submitted variable
          for (let s = 0; s < shapes.length; s++)
          {
            if (shapes[s] === this)
              shape_submitted = s;
            else
            {
              // All other shapes can be removed
              shapes[s].x = 0;
              shapes[s].y = 0;
              shapes[s].rectangles = [];            
            }
          }
          // Set new position to start position
          this.x_start = this.x;
          this.y_start = this.y;
          // Enable submit button
          buttonOK.style('color', color(0, 0, 0, 255));
          // Log submit event
          this.event.submit =
            {'time': Date.now() - task.trial_start[task.trial] - this.event.time,
             'self': this.id, 
             'x': (x_target - this.x)/grid, 
             'y': (y_target - this.y)/grid,
             
          };
          // Add event to list
          pushEvent(this.event);
          //task.trial_events[task.trial].push(this.event);   
          buttonOK.show()
           
        }
        else
        {
  
          // If there is no shape submitted, and this is below submission: it's a building action
          if (shape_submitted == -1)
          {
            // Find if the shape touches any other shapes in the new position
            var do_touch = -1
            // Check against all shapes if they touch in the new position
            for (let s = 0; s < shapes.length; s++)
            {
              // Ignore self
              if (!(shapes[s] === this))
              {
                // There can be no exclusive overlap between any containing rectangle
                var any_overlap = false;
                // There needs to at least one touch between any containing rectangle
                var any_touch = false;
                // Run through all rectangles in both shapes to find if they touch but don't overlap
                for (let s1 = 0; s1 < this.rectangles.length; s1++)
                {
                  // Create own rectangle: add x and y as offset
                  var self_rect = [this.rectangles[s1][0] + this.x, 
                                   this.rectangles[s1][1] + this.y,
                                   this.rectangles[s1][2], 
                                   this.rectangles[s1][3]];
                  for (let s2 = 0; s2 < shapes[s].rectangles.length; s2++)
                  {
                    // Create other rectangle: add x and y as offset
                    var other_rect = [shapes[s].rectangles[s2][0] + shapes[s].x, 
                                      shapes[s].rectangles[s2][1] + shapes[s].y, 
                                      shapes[s].rectangles[s2][2],
                                      shapes[s].rectangles[s2][3]];
                    // These shapes touch if they *dont* overlap excluding boundaries, but *do* overlap including boundaries
                    if (this.do_overlap_exclusive(self_rect, other_rect))
                      any_overlap = true;
                    else
                        if (this.do_overlap_inclusive(self_rect, other_rect))
                          any_touch = true;
                  }
                }
                // Now if there isn't any overlap and there is any touch: set object touching
                if (!any_overlap & any_touch)
                  do_touch = s;
              }
            }  
            // If there are no touches: invalid move. If there are: glue together
            if (do_touch == -1)
            {
              // No touch. Start moving back to start position
              this.returning = true;
              // The release event contains unsuccessful glueing
              this.event.cancel =
                {'time': Date.now() - task.trial_start[task.trial] - this.event.time,
                 'self': this.id};
              // Add event to list
              pushEvent(this.event);
              //task.trial_events[task.trial].push(this.event);        
            }
            else
            {        
              // Touched other object. Find which one
              var other = shapes[do_touch];
              // Write the objects for glueing to event
              this.event.combine =
                {'time': Date.now() - task.trial_start[task.trial] - this.event.time,
                 // Clone objects so subsequent actions don't change data
                 'self': JSON.parse(JSON.stringify(this.id)),
                 'other': JSON.parse(JSON.stringify(other.id))};        
              // Find offset relative to the touching object
              let init_x = other.x;
              let init_y = other.y;
              parent.console.log('init_x'+init_x);
              parent.console.log('init_y'+init_y);
              
              var x_offset = this.x - other.x;
              var y_offset = this.y - other.y;
              // Add offset to each rectangle this contains
              for (let s=0; s < this.rectangles.length; s++)
              {
                this.rectangles[s][0] += x_offset;
                this.rectangles[s][1] += y_offset;
              }
              // Add offset to each component in ID
              var record_sub =[]
              for (let c=0; c < this.id.length; c++)
              {
                
                this.id[c]['x'] += x_offset / this.grid;
                this.id[c]['y'] += y_offset / this.grid;
                let id = this.id[c]['id']
                let x = this.id[c]['x']
                let y = this.id[c]['y']
                let all={id:id,x:x,y:y}
                record_sub.push(all);
              }
              // Then add id and rectangles to other object
              other.rectangles.push.apply(other.rectangles, this.rectangles);
              other.id.push.apply(other.id, this.id);
              // Add resulting object to the event
              this.event.combine['new'] = JSON.parse(JSON.stringify(other.id));
              // Add event to list
              let End_X = 0;
              let End_Y = 0;
              let Start_X = 0;
              let Start_Y = 0;

              for (let s=0; s < other.rectangles.length; s++)
                {
                  parent.console.log('End_X'+other.rectangles[s]);
                  let currentX = other.rectangles[s][0];
                  let currentY = other.rectangles[s][1];
                  if (currentX > End_X) {
                    End_X = currentX;
                  }
                  if (currentY > End_Y) {
                    End_Y = currentY;

                  }
                  if (currentX <= Start_X) {
                    Start_X = currentX;
                  }
                  if (currentY <= Start_Y) {
                    Start_Y = currentY;
                  }
                 
                }
                End_X = End_X+init_x+this.grid;
                End_Y= End_Y+init_y+this.grid;
                Start_X=Start_X+init_x;
                Start_Y=Start_Y+init_y;
                parent.console.log('End_X'+End_X);
                parent.console.log('End_Y'+End_Y);
                parent.console.log('Start_X'+Start_X);
                parent.console.log('Start_Y'+Start_Y);
                this.event.combine['new_location'] = [Start_X,Start_Y,End_X,End_Y];
              //task.trial_events[task.trial].push(this.event);            
              // Then essentially remove self: set x,y to 0 and rectangles to 0
              pushEvent(this.event);

              this.x = 0;
              this.y = 0;
              this.rectangles = [];
            }
          }
          else
          {
            // Shape has been submitted, and this is below submission line
            this.event.cancel =
              {'time': Date.now() - task.trial_start[task.trial] - this.event.time,
               'self': this.id};
            pushEvent(this.event);
            this.returning = true;
          }          
        }
      } 
      // Quit dragging
      this.dragging = false;
    }
  }